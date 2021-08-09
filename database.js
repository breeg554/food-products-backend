import mongoose from "mongoose";
import { connectionString } from "./config/db.js";

export const initializeDB = async () => {
  await mongoose.connect(connectionString, { useNewUrlParser: true, useFindAndModify: false });
};
export const closeDB = async () => {
  await mongoose.disconnect();
};
