import express from "express";
import { initialize, close } from "./web-server.js";
import { initializeDB, closeDB } from "./database.js";

const startup = async () => {
  console.log("Starting application");
  try {
    console.log("Initialize database");
    await initializeDB();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  try {
    console.log("Initialize web-server");
    await initialize();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
startup();

const shutdown = async (e) => {
  let err = e;
  console.log("Shutting down");
  try {
    console.log("Closing web-server");
    await close();
  } catch (e) {
    console.log(e);
    err = err || e;
  }
  try {
    console.log("Closing database");
    await closeDB();
  } catch (e) {
    console.log(e);
    err = err || e;
  }

  console.log("Exiting process");
  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};
process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
  shutdown();
});
process.on("SIGINT", () => {
  console.log("Received SIGINT");
  shutdown();
});
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception");
  console.error(err);
  shutdown(err);
});
