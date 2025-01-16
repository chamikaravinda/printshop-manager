import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler, successHandler } from "../utils/response.js";
import jwt from "jsonwebtoken";
import { validateUser } from "../utils/validators.js";
import { ACCESS_TOKEN, DEFAULT_PROFILE_IMAGE } from "../utils/commonConstant.js";

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  console.log("Request received for signup", email);

  if (
    !name ||
    !email ||
    !password ||
    name === "" ||
    email === "" ||
    password === ""
  ) {
    console.error("Some fields are missing in the  signup request ");
    return next(errorHandler(400, "All fields must be required"));
  }
  const newUser = new User(name, email, password);

  const validateErrors = validateUser(newUser);

  if (validateErrors) {
    console.error("Invalid request for signup");
    return next(errorHandler(400, "Some fields are invalid", validateErrors));
  }

  try {
    let user = await User.findByEmail(email);

    if (user) {
      console.error("User already exists", email);
      return next(errorHandler(404, "User already exists"));
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    newUser.password = hashedPassword;
    newUser.profilePicture =  DEFAULT_PROFILE_IMAGE;

    await newUser.save();
    
    console.log("User Signup successful", email);
    res.status(200).json(successHandler(200, "Signup successful"));
  } catch (error) {
    console.error("Error in user signup", email);
    console.error(error);
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  console.log("Request received for signin");

  if (!email || !password || email === "" || password === "") {
    console.error("Invalid request for signin");
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    let validUser = await User.findByEmail(email);

    if (!validUser) {
      console.error("User not found", email);
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);

    if (!validPassword) {
      console.error("Invalid Password");
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = jwt.sign(
      {
        id: validUser.id,
        userRole: validUser.userRole,
      },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser;

    console.log("User signin successful", email);
    res
      .status(200)
      .cookie(ACCESS_TOKEN, token, {
        httpOnly: true,
      })
      .json(successHandler(200, "Sign in success", rest));
  } catch (error) {
    console.error("Error in user signin", email);
    console.error(error);
    return next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  console.log("Request received for google authentication", email);

  if (
    !name ||
    !email ||
    !googlePhotoUrl ||
    name === "" ||
    email === "" ||
    googlePhotoUrl === ""
  ) {
    console.error("Some fields are missing in the  google request ");
    return next(errorHandler(400, "All fields are required"));
  }

  const validateErrors = validateUser({ name, email });

  if (validateErrors) {
    console.error("Invalid request for google auth");
    return next(
      errorHandler(400, "Invalid request for google auth", validateErrors)
    );
  }

  try {
    const user = await User.findByEmail(email);
    if (user) {
      console.log("Signin the user since the profile exists", email);
      const token = jwt.sign(
        {
          id: user.id,
          userRole: user.userRole,
        },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user;
      res
        .status(200)
        .cookie(ACCESS_TOKEN, token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      console.log("Signup the user since the profile not exists", email);
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User(
        name,
        email,
        hashedPassword,
        googlePhotoUrl,
      );
      await newUser.save();
      console.log("User Signup successful", email);
      const token = jwt.sign(
        {
          id: newUser.id,
          userRole: newUser.userRole,
        },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser;
      console.log("Sending the token and user data to log in automatically", email);
      res
        .status(200)
        .cookie(ACCESS_TOKEN, token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    console.error("Error in google auth", email);
    console.error(error);
    next(error);
  }
};
