function LoggerMiddleware(request, response, next) {
  console.log(
    `{${request.method}} ${request.path} : ${JSON.stringify(request.body)} `
  );
  next();
}

module.exports = { LoggerMiddleware };
