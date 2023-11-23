module.exports.getAmbitionLevels = async ({beautyAmbitionInput, sustainAmbitionInput, togetherAmbitionInput,
  participProcessAmbitionInput, transdiciplinaryAmbitionInput, multiLevelEngagementAmbitionInput}) => {

  var beautyAmbition;
  if(!Array.isArray(beautyAmbitionInput)) {
    beautyAmbitionInput = [beautyAmbitionInput];
  }
  if (beautyAmbitionInput.includes("integrate_1") || beautyAmbitionInput.includes("integrate_2") ||
  beautyAmbitionInput.includes("integrate_3") || beautyAmbitionInput.includes("integrate_4")) {
    beautyAmbition = 3;
  }
  else if (beautyAmbitionInput.includes("connect_1") || beautyAmbitionInput.includes("connect_2") ||
  beautyAmbitionInput.includes("connect_3") || beautyAmbitionInput.includes("connect_4")) {
    beautyAmbition = 2;
  }
  else if (beautyAmbitionInput.includes("activate_1") || beautyAmbitionInput.includes("activate_2") ||
  beautyAmbitionInput.includes("activate_3") || beautyAmbitionInput.includes("activate_4")) {
    beautyAmbition = 1;
  }
  else {
    beautyAmbition = 0;
  }

  var sustainAmbition;
  if(!Array.isArray(sustainAmbitionInput)) {
    sustainAmbitionInput = [sustainAmbitionInput];
  }
  if (sustainAmbitionInput.includes("regenerate_1") || sustainAmbitionInput.includes("regenerate_2") ||
  sustainAmbitionInput.includes("regenerate_3")) {
    sustainAmbition = 3;
  }
  else if (sustainAmbitionInput.includes("close_loop_1") || sustainAmbitionInput.includes("close_loop_2") ||
  sustainAmbitionInput.includes("close_loop_3") || sustainAmbitionInput.includes("close_loop_4") ||
  sustainAmbitionInput.includes("close_loop_5")) {
    sustainAmbition = 2;
  }
  else if (sustainAmbitionInput.includes("repurpose_1") || sustainAmbitionInput.includes("repurpose_2") ||
  sustainAmbitionInput.includes("repurpose_3") || sustainAmbitionInput.includes("repurpose_4") ||
  sustainAmbitionInput.includes("repurpose_5")) {
    sustainAmbition = 1;
  }
  else {
    sustainAmbition = 0;
  }

  var togetherAmbition;
  if(!Array.isArray(togetherAmbitionInput)) {
    togetherAmbitionInput = [togetherAmbitionInput];
  }
  if (togetherAmbitionInput.includes("transform_1") || togetherAmbitionInput.includes("transform_2")) {
    togetherAmbition = 3;
  }
  else if (togetherAmbitionInput.includes("consolidate_1") || togetherAmbitionInput.includes("consolidate_2") ||
  togetherAmbitionInput.includes("consolidate_3")) {
    togetherAmbition = 2;
  }
  else if (togetherAmbitionInput.includes("include_1") || togetherAmbitionInput.includes("include_2") || 
  togetherAmbitionInput.includes("include_3")) {
    togetherAmbition = 1;
  }
  else {
    togetherAmbition = 0;
  }

  var participProcessAmbition;
  if(!Array.isArray(participProcessAmbitionInput)) {
    participProcessAmbitionInput = [participProcessAmbitionInput];
  }
  if (participProcessAmbitionInput.includes("self-govern_1") || participProcessAmbitionInput.includes("self-govern_2") ||
  participProcessAmbitionInput.includes("self-govern_3") || participProcessAmbitionInput.includes("self-govern_4")) {
    participProcessAmbition = 3;
  }
  else if (participProcessAmbitionInput.includes("co-develop_1") || participProcessAmbitionInput.includes("co-develop_2") ||
  participProcessAmbitionInput.includes("co-develop_3") || participProcessAmbitionInput.includes("co-develop_4")) {
    participProcessAmbition = 2;
  }
  else if (participProcessAmbitionInput.includes("consult_1") || participProcessAmbitionInput.includes("consult_2") ||
  participProcessAmbitionInput.includes("consult_3")) {
    participProcessAmbition = 1;
  }
  else {
    participProcessAmbition = 0;
  }

  var multiLevelEngagementAmbition;
  if(!Array.isArray(multiLevelEngagementAmbitionInput)) {
    multiLevelEngagementAmbitionInput = [multiLevelEngagementAmbitionInput];
  }
  if (multiLevelEngagementAmbitionInput.includes("work_globally_1") || multiLevelEngagementAmbitionInput.includes("work_globally_2")) {
    multiLevelEngagementAmbition = 3;
  }
  else if (multiLevelEngagementAmbitionInput.includes("work_across_1") || multiLevelEngagementAmbitionInput.includes("work_across_2") ||
  multiLevelEngagementAmbitionInput.includes("work_across_3")) {
    multiLevelEngagementAmbition = 2;
  }
  else if (multiLevelEngagementAmbitionInput.includes("work_locally_1") || multiLevelEngagementAmbitionInput.includes("work_locally_2") ||
  multiLevelEngagementAmbitionInput.includes("work_locally_3")) {
    multiLevelEngagementAmbition = 1;
  }
  else {
    multiLevelEngagementAmbition = 0;
  }

  var transdiciplinaryAmbition;
  if(!Array.isArray(transdiciplinaryAmbitionInput)) {
    transdiciplinaryAmbitionInput = [transdiciplinaryAmbitionInput];
  }
  if (transdiciplinaryAmbitionInput.includes("beyond_disciplinary_1") || transdiciplinaryAmbitionInput.includes("beyond_disciplinary_1") ||
  transdiciplinaryAmbitionInput.includes("beyond_disciplinary_3") || transdiciplinaryAmbitionInput.includes("beyond_disciplinary_4")) {
    transdiciplinaryAmbition = 3;
  }
  else if (transdiciplinaryAmbitionInput.includes("interdisciplinary_1") || transdiciplinaryAmbitionInput.includes("interdisciplinary_2") ||
  transdiciplinaryAmbitionInput.includes("interdisciplinary_3")) {
    transdiciplinaryAmbition = 2;
  }
  else if (transdiciplinaryAmbitionInput.includes("multidisciplinary_1") || transdiciplinaryAmbitionInput.includes("multidisciplinary_2") ||
  transdiciplinaryAmbitionInput.includes("multidisciplinary_3") || transdiciplinaryAmbitionInput.includes("multidisciplinary_4")) {
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
