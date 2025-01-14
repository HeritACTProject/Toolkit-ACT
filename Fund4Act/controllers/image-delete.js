exports.deleteImage= async (userId, actionSlug) => {
  try {
    const userDir = `./public/images/upload/${userId}`;

    const imageFile = Bun.file(`${userDir}/${actionSlug}.webp`);
    if (!imageFile.exists()) return;

    await imageFile.delete();

    return true;
  } catch (err) {
    return err;
  }
};
