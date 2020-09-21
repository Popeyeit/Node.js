const Joi = require('joi');

// exports.handleValidate = function handleValidate(scheme) {
//   return (req, res, next) => {
//     const validationResult = scheme.validate(req.body);
//     console.log('validationResult.error',
//       validationResult.error);

//     if (validationResult.error) {
//       return res.status(400).send({
//         message: 'missing required name field',
//       });
//     }

//     next();
//   };
// };
exports.handleValidate = function handleValidate(scheme, reqPart = 'body') {
  return (req, res, next) => {
    const validationResult = scheme.validate(req[reqPart]);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  };
};