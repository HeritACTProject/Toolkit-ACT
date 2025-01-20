const fs = require('fs/promises');
const { execFile } = require("child_process");

const checkIfDirectoryExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, {recursive: true});
  }
};

exports.convertImage = async (userId, filename, image) => {
  // file name will be either an action slug or "profile_image"
  try {
    const userDir = `./public/images/upload/${userId}`;
    await checkIfDirectoryExists(userDir)
    const base64Image = image.split(';base64,').pop();

    const decodedImage = Buffer.from(base64Image, "base64");
    await Bun.write(`${userDir}/${filename}`, decodedImage);

    const {stdout, stderr, error} = await execFile('sh ./tools/convertImage.sh', [`${userDir}/${filename}`], {shell:true}, (error, stdout, stderr) => {
      if (error) {
        throw error;
      }
    });

    return true;
  } catch (err) {
    return err;
  }
};
