import mongoose from "mongoose";
import { connectionString } from "./config/db.js";

export const initializeDB = async () => {
  await mongoose.connect(connectionString, { useNewUrlParser: true });
};
export const closeDB = async () => {
  await mongoose.disconnect();
};
