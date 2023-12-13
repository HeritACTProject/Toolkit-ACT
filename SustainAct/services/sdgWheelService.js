const Target = require('../models/target');

exports.getSDGWheelNodeData = async (selectedTargetIds) => {
  const targets = await Target.find();
  const flatNodes = [{
    name: 'SDGs',
    parent: '',
  }];
  for (let goal = 1; goal <= 17; goal += 1) {
    flatNodes.push({
      name: `${goal}`,
      parent: 'SDGs',
      image: `/images/ICON_ONLY_SDG_${goal}.svg`,
    });
    let targetsInGoal = targets
      .filter((target) => target.goal === goal.toString())
      // sort by target in reverse order
      .sort((a, b) => -(a.target < b.target));
    targetsInGoal = targetsInGoal.reverse();
    let previous = goal;
    targetsInGoal.forEach((target) => {
      const policiesTextArray = [];
      if(target.policies){
        if(target.policies.neb){
          policiesTextArray.push("New European Bauhaus");
        }
        if(target.policies.egd){
          policiesTextArray.push("European Green Deal");
        }
      }
      const targetObject = {
        name: target.id,
        title: target.title,
        policies: policiesTextArray,
        parent: previous.toString(),
      };
      if (target.id === targetsInGoal[targetsInGoal.length - 1].id) {
        targetObject.size = 1;
      }
      if (selectedTargetIds.find((selectedTargetId) => selectedTargetId === target.id)) {
        targetObject.selected = true;
      }
      previous = target.id;
      flatNodes.push(targetObject);
    });
  }

  return JSON.stringify(flatNodes);
};
