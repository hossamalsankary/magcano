const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    console.log(err);

    res.status(err.statusCode).json({ massage: err.message });
  } else {
    console.log(err.stack);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ massage: "Opps Some Thing Went Wrong ..." });
  }
};

module.exports = errorHandlerMiddleware;
