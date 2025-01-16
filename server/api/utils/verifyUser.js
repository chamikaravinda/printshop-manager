import jwt from "jsonwebtoken";
import { errorHandler } from "./response.js";
import { ACCESS_TOKEN } from "./commonConstant.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies[ACCESS_TOKEN];
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};



