const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  const{code} = err;
  if(code)err.statusCode = StatusCodes.UNAUTHORIZED;

  err.statusCode = err.statusCode||500;
console.log(err);
switch (err.statusCode) {
  case 500:
    res
      .status(err.statusCode)
      .json({ massage: "Opps Some Thing Went Wrong" });

    break;
  case 400:
    res
      .status(err.statusCode)
      .json({ massage: "Opps We Missing Some Data" });

    break;
  case 401:
    res
      .status(err.statusCode)
      .json({ massage: "UNAUTHORIZED" });

    break;
    case 405:
      res
        .status(err.statusCode)
        .json({ massage: "This Email Is Used Befor" });

      break;

  default:
    break;
}
};

module.exports = errorHandlerMiddleware;
