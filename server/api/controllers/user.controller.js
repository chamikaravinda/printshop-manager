import { errorHandler, successHandler } from "../utils/response.js";
import User from "../models/user.model.js";
import { validateUser } from "../utils/validators.js";
import { ACCESS_TOKEN, USER_ROLE_ADMIN } from "../utils/commonConstant.js";
import bcrypt from "bcryptjs";

export const updateUserById = async (req, res, next) => {
  const { email, password, name, profilePicture } = req.body;

  console.log("Request received to update user", email);

  if (
    req.user.userRole != USER_ROLE_ADMIN &&
    req.user.id !== req.params.userId
  ) {
    console.error("Not allowed to update the user", email);
    return next(errorHandler(403, "Your are not allowed to update this user"));
  }

  const updateUser = new User(name, email, password, profilePicture);

  const validate = validateUser(updateUser);

  if (validate) {
    console.error("Invalid user data", email);
    return next(errorHandler(400, "Invalid user data", validate));
  }

  if (password && password.trim() != "") {
    const hashedPassword = bcrypt.hashSync(password, 10);
    updateUser.password = hashedPassword;
  }

  try {
    await User.updateById(req.params.userId, updateUser);
    res.status(200).json(successHandler(200, "Update user success"));
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  console.log("Request received to delete user", req.params.userId);

  if (!(req.user.userRole === USER_ROLE_ADMIN) && req.user.id !== req.params.userId) {
    console.error("Not authorized to delete the user", req.params.userId);
    return next(errorHandler(403, "Your are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    console.log("Delete success", req.params.userId);
    res.status(200).json(successHandler(200, "User has been delete"));
  } catch (error) {
    console.error("Error in deleting the user");
    console.error(error);
    next(error);
  }
};

export const signout = (req, res, next) => {
  console.log("Request received to signout user", req.user.id);
  try {
    res
      .clearCookie(ACCESS_TOKEN)
      .status(200)
      .json(successHandler(200, "User has been signed out"));
  } catch (error) {
    console.error("Error in user sign out");
    console.error(error);
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  console.log("Request received to get all users");
  if (!(req.user.userRole == USER_ROLE_ADMIN)) {
    console.error("User don't have the permission to get all users");
    return next(errorHandler(403, "Your are not allowed to see all users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort || "asc";

    const users = await User.findAll(sortDirection, startIndex, limit);

    const filteredUsers = users.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });

    console.log("Get all user success");
    res.status(200).json(
      successHandler(200, "Get users success", {
        users: filteredUsers,
      })
    );
  } catch (error) {
    console.error("Error in getting all the users");
    console.error(error);
    next(error);
  }
};
