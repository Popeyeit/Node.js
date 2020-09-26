const AvatarGenerator = require('avatar-generator');
const path = require('path')
const point = path.join(__dirname, "../../public/images/");

const avatar = new AvatarGenerator({
    parts: ['background', 'face', 'clothes', 'head', 'hair', 'eye', 'mouth']
});
const createAvatar = async (email = "email@example.com", variant = 'male') => {
    const image = await avatar.generate(email, variant);
    const userAvatarName = `${Date.now()}`;
    image.png().toFile(`${point}${userAvatarName}.png`);
    return userAvatarName;
};
module.exports = createAvatar