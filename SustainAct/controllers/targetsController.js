const { param, validationResult } = require('express-validator');
const TargetsService = require('../services/targetsService');
const assessmentService = require('../services/assessmentService');
const { getActionsByTargetIds } = require('../services/libraryOfActionsService');

const addActionsToTargetObjects = async (targets, industry) => {
  const actions = await getActionsByTargetIds(targets, industry || 'built environment');
  const targetsWithActions = await Promise.all(targets.map(async (target) => {
    const targetWithActions = target;
    targetWithActions.actions = actions.filter((action) => action.targetId === target.id);
    return targetWithActions;
  }));
  return targetsWithActions;
};

// eslint-disable-next-line max-len
const addExistingTargetDataToTargetObjects = (selectedTargets, selectedActions) => Promise.all(selectedTargets.map(async (selectedTarget) => {
  const actionsWithSelectedTag = await Promise.all(selectedTarget.actions.map(async (action) => ({
    ...action,
    selected: await selectedActions.includes(action.actionId),
  })));

  return {
    ...selectedTarget,
    selected: true,
    actions: await actionsWithSelectedTag,
  };
}));

exports.get = [
  [
    param('assessment').notEmpty().trim().escape(),
  ], async (req, res) => {
    validationResult(req).throw();
    const assessmentId = req.params.assessment;
    const assessment = await assessmentService.getAssessmentById(assessmentId);
    const targetObjects = await TargetsService.getTargetsObjects(assessment.selectedTags);

    const targetsWithActions = await addActionsToTargetObjects(targetObjects);

    res.render('targets', {
      layout: 'layout',
      domain: process.env.DOMAIN,
      targets: targetsWithActions,
      csrfToken: req.csrfToken(),
    });
  }];

exports.post = [
  [
    param('assessment').notEmpty().trim().escape(),
  ], async (req, res) => {
    validationResult(req).throw();
    await assessmentService 
      .updateSelectedTargets(req.params.assessment, req.body);
    res.redirect(`../${req.params.assessment}/`);
  }];
