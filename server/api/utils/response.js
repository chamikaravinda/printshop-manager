export const errorHandler = (statusCode, message,data) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  error.success = false;
  error.data = data
  return error;
};

export const successHandler = (statusCode, message, data) => {
  const success = {
    statusCode: statusCode,
    message: message,
    success: true,
    data: data,
  };
  return success;
};
