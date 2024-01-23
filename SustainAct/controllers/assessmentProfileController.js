const { param, validationResult } = require('express-validator');
const assessmentService = require('../services/assessmentService');
const { getSDGWheelNodeData } = require('../services/sdgWheelService');
const { getActionsByActionIds } = require('../services/libraryOfActionsService');

const addSelectedActionsToTargetObjects = async (targets, actionIds) => {
  const actions = await getActionsByActionIds(actionIds);

  const targetsWithActions = await Promise.all(targets.map(async (target) => {
    const targetWithActions = target;
    targetWithActions.actions = actions.filter((action) => action.targetId === target.id);
    return targetWithActions;
  }));
  return targetsWithActions;
};

exports.generateContent = async (assessmentId) => {
  const assessment = await assessmentService.getAssessmentById(assessmentId);
  let selectedTargets = await assessmentService.getTargetObjects(assessment.selectedTargets);
  selectedTargets = await addSelectedActionsToTargetObjects(selectedTargets,
    assessment.selectedActions);

  let selectedTargetIds;
  selectedTargetIds = selectedTargets
    ? selectedTargets.map((selectedTarget) => selectedTarget.id)
    : selectedTargetIds = [];

  const sdgWheelNodeData = await getSDGWheelNodeData(selectedTargetIds);
  const selectedGoals = [
    ...new Set(selectedTargets.map((target) => parseInt(target.id, 10))),
  ];
  const selectedTags = await assessmentService.getSelectedTags(assessment.selectedTags);

  selectedTargets = await selectedTargets.map((selectedTarget) => ({
    ...selectedTarget,
    actionsCount: selectedTarget.actions?.length | 0 + selectedTarget.customActions?.length | 0,
  }));

  const policyCounts = {neb: 0, egd: 0}

  await selectedTargets.map((target) => {
    if (target.policies.neb) policyCounts.neb += 1;
    if (target.policies.egd) policyCounts.egd += 1;
  })

  return {
    assessmentName: assessment.title,
    assessmentOwner: assessment.owner,
    assessmentOwnerType: assessment.ownerType,
    assessmentOverview: assessment.overview,
    assessmentObjectives: assessment.objectives,
    assessmentType: assessment.type,
    assessmentStatus: assessment.status,
    assessmentLocation: assessment.location,
    goals: selectedGoals,
    goalsCount: selectedGoals.length,
    targets: selectedTargets,
    targetsCount: selectedTargets.length,
    policyCounts,
    sdgWheelNodeData,
    sdgWheel: true,
    tags: selectedTags,
  };
};

exports.get = [
  [
    param('assessment').notEmpty().trim().escape(),
  ],
  async (req, res, next) => {
    try {
      validationResult(req).throw();
      const { assessment } = req.params;
      const content = await this.generateContent(assessment);
      return res.render('assessmentProfile', {
        layout: 'layout',
        domain: process.env.DOMAIN,
        report: true,
        ...content,
      });
    } catch (err) {
      next(err);
    }
  }];
