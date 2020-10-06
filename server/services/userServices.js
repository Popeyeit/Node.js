exports.getUserByEmail = async function (email) {
  const res = await this.findOne({
    email,
  });

  return res;
};
exports.updateUserToken = async function (id, newToken) {
  return await this.findByIdAndUpdate(id, {
    token: newToken,
  });
};
