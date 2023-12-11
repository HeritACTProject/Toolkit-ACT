module.exports.getAmbitionLevels = async ({beautyAmbitionInput, sustainAmbitionInput, togetherAmbitionInput,
  participAmbitionInput, transdiciplinaryAmbitionInput, multiLevelEngagementAmbitionInput}) => {

  var beautyAmbition;
  if(!Array.isArray(beautyAmbitionInput)) {
    beautyAmbitionInput = [beautyAmbitionInput];
  }
  if (beautyAmbitionInput.includes("integrate")) {
    beautyAmbition = 3;
  }
  else if (beautyAmbitionInput.includes("connect")) {
    beautyAmbition = 2;
  }
  else if (beautyAmbitionInput.includes("activate")) {
    beautyAmbition = 1;
  }
  else {
    beautyAmbition = 0;
  }

  var sustainAmbition;
  if(!Array.isArray(sustainAmbitionInput)) {
    sustainAmbitionInput = [sustainAmbitionInput];
  }
  if (sustainAmbitionInput.includes("regenerate")) {
    sustainAmbition = 3;
  }
  else if (sustainAmbitionInput.includes("close_loop")) {
    sustainAmbition = 2;
  }
  else if (sustainAmbitionInput.includes("repurpose")) {
    sustainAmbition = 1;
  }
  else {
    sustainAmbition = 0;
  }

  var togetherAmbition;
  if(!Array.isArray(togetherAmbitionInput)) {
    togetherAmbitionInput = [togetherAmbitionInput];
  }
  if (togetherAmbitionInput.includes("transform")) {
    togetherAmbition = 3;
  }
  else if (togetherAmbitionInput.includes("consolidate")) {
    togetherAmbition = 2;
  }
  else if (togetherAmbitionInput.includes("include")) {
    togetherAmbition = 1;
  }
  else {
    togetherAmbition = 0;
  }

  var participProcessAmbition;
  if(!Array.isArray(participAmbitionInput)) {
    participAmbitionInput = [participAmbitionInput];
  }
  if (participAmbitionInput.includes("self-govern")) {
    participProcessAmbition = 3;
  }
  else if (participAmbitionInput.includes("co-develop")) {
    participProcessAmbition = 2;
  }
  else if (participAmbitionInput.includes("consult")) {
    participProcessAmbition = 1;
  }
  else {
    participProcessAmbition = 0;
  }

  var multiLevelEngagementAmbition;
  if(!Array.isArray(multiLevelEngagementAmbitionInput)) {
    multiLevelEngagementAmbitionInput = [multiLevelEngagementAmbitionInput];
  }
  if (multiLevelEngagementAmbitionInput.includes("work_globally")) {
    multiLevelEngagementAmbition = 3;
  }
  else if (multiLevelEngagementAmbitionInput.includes("work_across")) {
    multiLevelEngagementAmbition = 2;
  }
  else if (multiLevelEngagementAmbitionInput.includes("work_locally")) {
    multiLevelEngagementAmbition = 1;
  }
  else {
    multiLevelEngagementAmbition = 0;
  }

  var transdiciplinaryAmbition;
  if(!Array.isArray(transdiciplinaryAmbitionInput)) {
    transdiciplinaryAmbitionInput = [transdiciplinaryAmbitionInput];
  }
  if (transdiciplinaryAmbitionInput.includes("beyond_disciplinary")) {
    transdiciplinaryAmbition = 3;
  }
  else if (transdiciplinaryAmbitionInput.includes("interdisciplinary")) {
    transdiciplinaryAmbition = 2;
  }
  else if (transdiciplinaryAmbitionInput.includes("multidisciplinary")) {
    transdiciplinaryAmbition = 1;
  }
  else {
    transdiciplinaryAmbition = 0;
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
