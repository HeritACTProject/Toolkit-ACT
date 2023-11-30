/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
const { nanoid } = require('nanoid/async');
const { decodeEntity } = require('html-entities');
const Assessment = require('../models/assessment');
const TagGroup = require('../models/tagGroup');
const Target = require('../models/target');

exports.getAssessmentById = async (assessmentId) => {
  const assessment = await Assessment.findOne(
    { id: assessmentId }
  );
  if (assessment === null) throw new Error(404);
  return assessment;
};

const getSelectedTargets = async (organisationId, actionId) => {
  const action = await this.getAction(organisationId, actionId);
  return action.selectedTargets;
};

exports.getSelectedTargetsWithTargetInfo = async (organisationId, actionId) => {
  const selectedTargets = await getSelectedTargets(organisationId, actionId);
  const selectedTargetIds = await selectedTargets.map((target) => target.id);
  const targets = await Target.find({ id: { $in: selectedTargetIds } }, {
    id: 1,
    title: 1,
    goal: 1,
    description: 1,
    target: 1,
  }).exec();
  return selectedTargets.map((target) => {
    const matchingTarget = targets.find(({ id }) => id === target.id);
    return {
      ...target,
      description: matchingTarget.description,
      title: matchingTarget.title,
      goal: matchingTarget.goal,
      target: matchingTarget.target,
    };
  });
};

exports.getSelectedTags = async (selectedTagIds) => {
  const tagGroups = await TagGroup.find().exec();
  const selectedTags = [];
  selectedTagIds.map((selectedTagId) => tagGroups.some((group) => {
    group.subGroups.some((subGroup) => {
      subGroup.tags.some((tag) => {
        if (tag.id === selectedTagId) {
          selectedTags.push(tag);
          return true;
        } return false;
      });
    });
  }));
  return selectedTags;
};

exports.getTargetObjects = async (actionTargets) => {
  if (actionTargets.length === null) {
    return null;
  }
  const targetIds = actionTargets.map((target) => target.id);
  const targets = await Target.find({ id: { $in: targetIds } }).exec();
  const result = actionTargets.map((actionTarget) => {
    const oldTargetObject = targets.filter((target) => target.id === actionTarget.id);
    const newTargetObject = actionTarget;
    newTargetObject.title = oldTargetObject[0].title;
    newTargetObject.goal = oldTargetObject[0].goal;
    return newTargetObject;
  });
  return result;
};

exports.saveAssessmentInfo = async (
  {
    name, owner, ownerType, overview, objectives, type, status,
    location,
  },
) => {
  const assessmentId = await nanoid(11);
  const newAssessment = {
    title: name,
    id: assessmentId,
    owner,
    ownerType,
    overview,
    objectives,
    type: decodeEntity(type),
    status,
    location,
  };
  const assessment = new Assessment(newAssessment);
  await assessment.save().catch(function (error) {
    console.log(error);
  });;
  return newAssessment;
};

exports.saveSelectedTags = async (assessmentId, selectedTagIds) => {
  const assessment = await this.getAssessmentById(assessmentId);
  assessment.selectedTags = selectedTagIds;

  await assessment.save();
};

exports.sortTargetsById = (targets) => {
  const numSort = (a, b) => Number(a) - Number(b);
  const sortTargets = (a, b) => a - b || numSort(a, b);
  const targetsArray = typeof targets === 'string' ? [targets] : targets;

  // sort targets by goal then target - 2.3 (goal, seperator, target)
  return targetsArray.map((id) => id.split('.'))
    .sort((a, b) => numSort(a[0], b[0]) || sortTargets(a[1], b[1]))
    .map((id) => id.join('.'));
};

const updateTargets = async (assessmentId, targets, actions) => {
  await Assessment.findOneAndUpdate(
    { id: assessmentId },
    {
      $set: {
        'selectedTargets': targets,
        'selectedActions': actions,
      },
    },
    { useFindAndModify: false },
  );
};

exports.getSelectedActions = async (organisationId, actionId) => {
  const action = await this.getAction(organisationId, actionId);
  return action.selectedActions;
};

exports.updateSelectedTargets = async (assessmentId,
  { targets, actions, ...formData }) => {
  const targetIds = this.sortTargetsById(targets);

  const selectedTargets = targetIds.map((id) => {
    const positiveImpact = formData[`${id}-positive`] === 'positive' ? 'positive' : 'negative';
    const directImpact = formData[`${id}-direct`] === 'direct' ? 'direct' : 'indirect';

    let title = formData[`customActions.${id}.title`];
    let description = formData[`customActions.${id}.description`];
    let indicator1 = formData[`customActions.${id}.indicator1`];
    let indicator2 = formData[`customActions.${id}.indicator2`];
    let numberOfActions;

    if (Array.isArray(title))numberOfActions = title.length;
    else if (typeof (title) === 'string') numberOfActions = 1;
    else numberOfActions = 0;

    if (numberOfActions === 1) {
      title = [title];
      description = [description];
      indicator1 = [indicator1];
      indicator2 = [indicator2];
    }

    const customActions = [];
    for (let actionIndex = 0; actionIndex < numberOfActions; actionIndex += 1) {
      let actionTitle = title[actionIndex];
      let actionDescription = description[actionIndex];
      let actionIndicator1 = indicator1[actionIndex];
      let actionIndicator2 = indicator2[actionIndex];
      actionTitle = actionTitle && typeof (actionTitle) === 'string' ? actionTitle.trim() : '';
      actionDescription = actionDescription && typeof (actionDescription) === 'string' ? actionDescription.trim() : '';
      actionIndicator1 = actionIndicator1 && typeof (actionIndicator1) === 'string' ? actionIndicator1.trim() : '';
      actionIndicator2 = actionIndicator2 && typeof (actionIndicator2) === 'string' ? actionIndicator2.trim() : '';

      const isIndicatorsEmpty = !actionIndicator1 && !actionIndicator2;

      const isActionEmpty = !actionTitle && !actionDescription && isIndicatorsEmpty;

      if (!isActionEmpty) {
        customActions.push({
          title: actionTitle,
          description: actionDescription,
          indicators: [
            actionIndicator1,
            actionIndicator2,
          ],
        });
      }
    }

    return {
      id,
      impact: [positiveImpact, directImpact],
      customActions,
    };
  });

  await updateTargets(assessmentId, selectedTargets, actions);
};

const parseKpis = (target, data) => {
  const kpis = [];
  const kpiIsArray = Array.isArray(data[`${target}-kpi-name`]);
  const kpiCount = kpiIsArray ? data[`${target}-kpi-name`].length : 1;
  for (let i = 0; i < kpiCount; i += 1) {
    kpis[i] = {
      name: kpiIsArray ? data[`${target}-kpi-name`][i] : data[`${target}-kpi-name`],
      source: kpiIsArray ? data[`${target}-kpi-source`][i] : data[`${target}-kpi-source`],
      currentMeasure: kpiIsArray ? data[`${target}-kpi-current-measure`][i] : data[`${target}-kpi-current-measure`],
      targetMeasure: kpiIsArray ? data[`${target}-kpi-target-measure`][i] : data[`${target}-kpi-target-measure`],
    };
    if (!Object.values(kpis[i]).some((x) => x !== null && x !== '')) kpis[i] = null;
  }
  return kpis.filter((element) => element !== null);
};

exports.saveTargetPlan = async (organisationId, actionId, { targets, ...FormData }) => {
  const selectedTargets = await getSelectedTargets(organisationId, actionId);
  const targetsArray = typeof targets === 'string' ? [targets] : targets;
  const targetPlans = targetsArray.map((target) => ({
    id: target,
    description: FormData[`${target}-description`],
    startDate: FormData[`${target}-start-date`],
    endDate: FormData[`${target}-end-date`],
    kpis: parseKpis(target, FormData),
    comment: FormData[`${target}-comment`],
  }));

  const selectedTargetsWithPlans = await selectedTargets.map((selectedTarget) => ({
    ...selectedTarget,
    targetPlan: targetPlans.find((targetPlan) => targetPlan.id === selectedTarget.id),
  }));

  updateTargets(organisationId, actionId, selectedTargetsWithPlans);
};

exports.saveGroups = async (organisationId, actionId, groups) => {
  await Organisation.findOneAndUpdate(
    { id: organisationId, 'actions.id': actionId },
    {
      $set: {
        'actions.$.groups': groups,
      },
    },
    { useFindAndModify: false },
  );
};
