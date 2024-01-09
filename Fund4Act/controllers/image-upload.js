const fs = require('fs/promises');
const { execFile } = require("child_process");

const checkIfDirectoryExists = async (dirPath) => {
  console.log(dirPath)
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, {recursive: true});
  }
};

exports.convertImage = async (userId, actionSlug, image) => {
  try {
    const userDir = `./public/images/upload/${userId}`;
    await checkIfDirectoryExists(userDir)
    const base64Image = image.split(';base64,').pop();

    const decodedImage = Buffer.from(base64Image, "base64");
    Bun.write(`${userDir}/${actionSlug}`, decodedImage);

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
