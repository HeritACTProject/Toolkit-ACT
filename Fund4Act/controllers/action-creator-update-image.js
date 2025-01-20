const { param, body, validationResult } = require('express-validator');
const profile = require('../models/profiles.js');
const fs = require('fs/promises');
const { execFile } = require("child_process");


exports.post = [
  [
    body('logo-url').trim().escape(),
  ], async (req, res, next) => {
    const formData = {
      id: req.user.id,
      email: req.body.email,
      logoUrl: req.body['logo-url'],
      websiteUrl: req.body['website-url'],
      mission: req.body.mission,
      prevActions: req.body['prev-actions'],
      prevGrants: req.body['prev-grants'],
      partnerships: req.body.partnerships,
      constitutionUrl: req.body['constitution-url'],
      climateActionPlanUrl: req.body['cap-url'],
    };

    try {
      validationResult(req.params, req.body).throw();
    } catch (err) {
      res.status(400).json({ errors: err.array });
      next(err);
    }
    try {
      await profile.saveOrgInfo(formData);
    } catch (err) {
      res.status(500).json({ errors: err.array });
      next(err);
    }

    next();
  }];
const checkIfDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, {recursive: true});
  }
};

convertImage = async (userId, actionSlug, image) => {
  try {
    const userDir = `./public/images/upload/${userId}`;
    await checkIfDirectoryExists(userDir)
    const base64Image = image.split(';base64,').pop();

    const decodedImage = Buffer.from(base64Image, "base64");
    await Bun.write(`${userDir}/${actionSlug}`, decodedImage);

    const {stdout, stderr, error} = await execFile('sh ./tools/convertImage.sh', [`${userDir}/${actionSlug}`], {shell:true}, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
    });

    return true;
  } catch (err) {
    return err;
  }
};
