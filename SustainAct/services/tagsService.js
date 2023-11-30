/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
const TagGroup = require('../models/tagGroup');

exports.getTagGroupObjects = async () => {
  const tagGroups = await TagGroup.find().sort('order').collation({ locale: 'en_US', numericOrdering: true }).exec();
  return tagGroups.map((tagGroup) => tagGroup.toObject());
};

exports.getAllTags = async () => {
  const tagGroups = await TagGroup.find().exec();
  const subgroups = await tagGroups.map((tagGroup) => tagGroup.subGroups).flat();

  const subgroupWithTags = await subgroups.filter((subgroup) => {
    if (subgroup.tags.length > 0) {
      return subgroup;
    }
  });
  const subgroupTags = await subgroupWithTags.map((subgroup) => subgroup.tags);
  return tagGroups.concat(subgroupTags).flat();
};
