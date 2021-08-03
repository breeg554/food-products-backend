import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Token from "../models/token.js";
import ApiError from "../utils/ApiError.js";
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
      if (err || !token) return next(new ApiError("Access denied", 403));

      jwt.verify(token.token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return next(new ApiError("Access denied", 403));

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
    const { name, surname, email, password } = req.body;

    if (password.length > 100)
      throw new ApiError("Password too long. Maximum 100 characters", 400);

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashPassword,
    });

    const created = await newUser.save();
    if (!created) throw new ApiError("Something went wrong", 400);
    res.status(201).json("Created succesful");
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

    const NewRefToken = new Token({ token: refreshToken });
    NewRefToken.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie("accessToken", accessToken, { httpOnly: true });

    const resData = {
      user: {
        name: newAnonymousUser.name,
        surname: newAnonymousUser.surname,
        email: newAnonymousUser.email,
        isAnonymous: newAnonymousUser.isAnonymous,
        role: newAnonymousUser.role,
        _id: newAnonymousUser._id,
      },
    };
    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new ApiError("User not found", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError("Incorrect password", 400);

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
      user: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        isAnonymous: user.isAnonymous,
        role: user.role,
        _id: user._id,
      },
    };
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    let { _id } = req.user;

    const userDetails = await User.findOne({ _id });
    if (!userDetails) throw new ApiError("User not found", 404);

    const { name, surname, email, role, isAnonymous } = userDetails;

    res.status(200).json({ name, surname, role, email, _id, isAnonymous });
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
