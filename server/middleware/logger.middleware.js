const { rejectObjEmpty } = require('../utils');

function LoggerMiddleware(request, response, next) {
  const payload =
    rejectObjEmpty(request.body) ||
    rejectObjEmpty(request.params) ||
    rejectObjEmpty(request.query);

  console.log(
    `{${request.method}} ${request.path} : ${JSON.stringify(payload)} `
  );
  next();
}

module.exports = { LoggerMiddleware };
