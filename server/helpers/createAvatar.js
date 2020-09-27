const AvatarGenerator = require('avatar-generator');
const path = require('path');
const point = path.join(__dirname, '../../tmp/');

const avatar = new AvatarGenerator({
  parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth'],
});
const createAvatar = async (email = 'email@example.com', variant = 'male') => {
  const image = await avatar.generate(email, variant);
  const userAvatarName = `${Date.now()}.png`;
  await image.png().toFile(`${point}${userAvatarName}`);
  const file = {
    fileName: `${userAvatarName}`,
    filePath: point,
  };
  return file;
};
module.exports = createAvatar;
