const Joi = require('joi');

exports.handleValidate = function handleValidate(scheme) {
  return (req, res, next) => {
    const validationResult = scheme.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({
        message: 'missing required name field',
      });
    }

    next();
  };
};
