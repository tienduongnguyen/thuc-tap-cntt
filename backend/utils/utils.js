const logger = require("./logger");
module.exports = {
  onError(error, message, code) {
    let msg = null;
    if (typeof error == "object") {
      logger.error(error);
    } else {
      msg = error;
    }
    return {
      message: msg || message || "Error",
      code: code || 500,
      status: 0,
    };
  },
  onSuccess(data) {
    return {
      data: data == undefined ? {} : data,
      message: "Success",
      code: 200,
      status: 1,
    };
  },
  onSuccessArray(data) {
    if (data && data.length != 0) {
      return {
        data,
        message: "Success",
        code: 200,
        status: 1,
      };
    }
    return {
      data: [],
      message: "Empty",
      code: 204,
      status: 1,
    };
  },
};
