module.exports.getAmbitionLevels = async ({beautyAmbitionInput, sustainAmbitionInput, togetherAmbitionInput,
  participAmbitionInput, transdiciplinaryAmbitionInput, multiLevelEngagementAmbitionInput}) => {

  function setAmbition(ambition, index) {
    if(index > ambition.length-1) return ambition;
    return ambition.substring(0,index) + "1" + ambition.substring(index+1);
  }

  var beautyAmbition = ['0','0','0'];
  if(!Array.isArray(beautyAmbitionInput)) {
    beautyAmbitionInput = [beautyAmbitionInput];
  }
  if (beautyAmbitionInput.includes("integrate")) {
    beautyAmbition[2] = '1';
  }
  if (beautyAmbitionInput.includes("connect")) {
    beautyAmbition[1] = '1';
  }
  if (beautyAmbitionInput.includes("activate")) {
    beautyAmbition[0] = '1';
  }
  beautyAmbition = beautyAmbition.join('');

  var sustainAmbition = "000";
  if(!Array.isArray(sustainAmbitionInput)) {
    sustainAmbitionInput = [sustainAmbitionInput];
  }
  if (sustainAmbitionInput.includes("regenerate")) {
    sustainAmbition = setAmbition(sustainAmbition, 2);
  }
  if (sustainAmbitionInput.includes("close_loop")) {
    sustainAmbition = setAmbition(sustainAmbition, 1);
  }
  if (sustainAmbitionInput.includes("repurpose")) {
    sustainAmbition = setAmbition(sustainAmbition, 0);
  }

  var togetherAmbition = "000";
  if(!Array.isArray(togetherAmbitionInput)) {
    togetherAmbitionInput = [togetherAmbitionInput];
  }
  if (togetherAmbitionInput.includes("transform")) {
    togetherAmbition = setAmbition(togetherAmbition, 2);
  }
  if (togetherAmbitionInput.includes("consolidate")) {
    togetherAmbition = setAmbition(togetherAmbition, 1);
  }
  if (togetherAmbitionInput.includes("include")) {
    togetherAmbition = setAmbition(togetherAmbition, 0);
  }

  var participProcessAmbition = "000";
  if(!Array.isArray(participAmbitionInput)) {
    participAmbitionInput = [participAmbitionInput];
  }
  if (participAmbitionInput.includes("self-govern")) {
    participProcessAmbition = setAmbition(participProcessAmbition, 2);
  }
  if (participAmbitionInput.includes("co-develop")) {
    participProcessAmbition = setAmbition(participProcessAmbition, 1);
  }
  if (participAmbitionInput.includes("consult")) {
    participProcessAmbition = setAmbition(participProcessAmbition, 0);
  }

  var multiLevelEngagementAmbition = "000";
  if(!Array.isArray(multiLevelEngagementAmbitionInput)) {
    multiLevelEngagementAmbitionInput = [multiLevelEngagementAmbitionInput];
  }
  if (multiLevelEngagementAmbitionInput.includes("work_globally")) {
    multiLevelEngagementAmbition = setAmbition(multiLevelEngagementAmbition, 2);
  }
  if (multiLevelEngagementAmbitionInput.includes("work_across")) {
    multiLevelEngagementAmbition = setAmbition(multiLevelEngagementAmbition, 1);
  }
  if (multiLevelEngagementAmbitionInput.includes("work_locally")) {
    multiLevelEngagementAmbition = setAmbition(multiLevelEngagementAmbition, 0);
  }

  var transdiciplinaryAmbition = "000";
  if(!Array.isArray(transdiciplinaryAmbitionInput)) {
    transdiciplinaryAmbitionInput = [transdiciplinaryAmbitionInput];
  }
  if (transdiciplinaryAmbitionInput.includes("beyond_disciplinary")) {
    transdiciplinaryAmbition = setAmbition(transdiciplinaryAmbition, 2);
  }
  if (transdiciplinaryAmbitionInput.includes("interdisciplinary")) {
    transdiciplinaryAmbition = setAmbition(transdiciplinaryAmbition, 1);
  }
  if (transdiciplinaryAmbitionInput.includes("multidisciplinary")) {
    transdiciplinaryAmbition = setAmbition(transdiciplinaryAmbition, 0);
  }

  return {
    beautyAmbition: beautyAmbition,
    sustainAmbition: sustainAmbition,
    togetherAmbition: togetherAmbition,
    participProcessAmbition: participProcessAmbition,
    multiLevelEngagementAmbition: multiLevelEngagementAmbition,
    transdiciplinaryAmbition: transdiciplinaryAmbition,
  }
}
