import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserStats from "../models/userStats.js";
import User from "../models/user.js";
import Token from "../models/token.js";
import ApiError from "../utils/ApiError.js";
import { getUserDataForResponse } from "../services/user.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/jwt.js";

const generateAccessToken = (payload) => {
  return jwt.sign({ data: payload }, ACCESS_TOKEN_SECRET, {
    expiresIn: "60sec",
  });
};
export const token = async (req, res, next) => {
  try {
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new ApiError("Access denied", 401);
    Token.findOne({ token: refreshToken }).exec((err, token) => {
      if (err || !token) return next(new ApiError("Access denied", 401));

      jwt.verify(token.token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return next(new ApiError("Access denied", 401));

        const accessToken = generateAccessToken(user.data);

        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.status(200).json();
      });
    });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res, next) => {
  try {
    let _userId = req.body.id;

    // if (!refreshToken) throw new ApiError("Bad request", 400);
    Token.deleteMany({ _userId }).exec((err, token) => {
      if (err) return next(new ApiError("Access denied", 403));
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(204).json();
    });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { name, surname, email, password, username } = req.body;

    if (password.length > 100) throw new ApiError("Password too long. Maximum 100 characters", 400);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let initials = "";
    if (name.length > 0 && surname.length > 0) initials = name.charAt(0) + surname.charAt(0);

    const NewUserStats = new UserStats();
    NewUserStats.save();

    const NewUser = new User({
      name,
      surname,
      email,
      initials,
      password: hashPassword,
      username,
      userStats: NewUserStats._id,
    });

    NewUser.save((err) => {
      if (err && err.code === 11000) {
        const keys = Object.keys(err.keyPattern);
        if (keys[0] === "email") return next(new ApiError("This email is already in use", 409));
        else return next(new ApiError("This username is already in use", 409));
      } else if (err) return next(new ApiError("Something went wrong", 400));
      res.status(201).json("Created succesful");
    });
  } catch (err) {
    next(err);
  }
};
export const signInAnonymous = async (req, res, next) => {
  try {
    const uuid = uuidv4();
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(uuid, salt);

    const newAnonymousUser = new User({
      name: "anonymous",
      surname: "anonymous",
      username: hashPassword,
      initials: "an",
      email: uuid,
      password: hashPassword,
      isAnonymous: true,
    });
    const created = await newAnonymousUser.save();
    if (!created) throw new ApiError("Something went wrong", 400);

    const payload = {
      id: created._id,
      email: created.email,
      role: created.role,
      isAnonymous: created.isAnonymous,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign({ data: payload }, REFRESH_TOKEN_SECRET);

    const NewRefToken = new Token({ token: refreshToken, _userId: newAnonymousUser._id });
    NewRefToken.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none" });
    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "none" });

    const resData = {
      user: getUserDataForResponse(newAnonymousUser),
    };
    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("userStats");

    if (!user) throw new ApiError("User not found", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError("Incorrect password", 400);

    if (user.isBlocked) throw new ApiError("Account has been blocked", 403);

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      isAnonymous: user.isAnonymous,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign({ data: payload }, REFRESH_TOKEN_SECRET);

    const NewRefToken = new Token({ _userId: user._id, token: refreshToken });
    NewRefToken.save();

    const resData = {
      user: getUserDataForResponse(user),
    };
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none" });
    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "none" });
    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    let { _id } = req.user;

    const userDetails = await User.findOne({ _id }).populate("userStats");
    if (!userDetails) throw new ApiError("User not found", 404);

    if (userDetails.isBlocked) throw new ApiError("Account has been blocked", 403);

    res.status(200).json(getUserDataForResponse(userDetails));
  } catch (err) {
    next(err);
  }
};
export const updateUserDetails = (req, res, next) => {
  try {
    let { _id } = req.user;

    User.findByIdAndUpdate({ _id }, { ...req.body }).exec((err) => {
      if (err) return next(new ApiError(err.message, 400));
      res.status(204).json();
    });
  } catch (err) {
    next(err);
  }
};
export const getAll = (req, res, next) => {
  User.paginate({}, { page: 1, limit: 5 }, (err, users) => {
    if (err) return next(new ApiError(err.message, 400));
    res.status(200).json(users);
  });
};
export const checkIfUsernameIsTaken = async (req, res, next) => {
  try {
    const { username } = req.body;
    const userDetails = await User.findOne({ username });
    if (!userDetails) res.status(200).json();

    return next(new ApiError("This username is already in use", 409));
  } catch (err) {
    next(err);
  }
};

export const getUserStats = (req, res, next) => {
  const { id } = req.params;

  UserStats.findById({ _id: id }, (err, userStats) => {
    if (err) return next(new ApiError(err.message, 404));

    res.status(200).json(userStats);
  });
};
