import http from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import { port, origin } from "./config/web-server.js";
import { adminBro, adminRouter } from "./adminBro.js";

let httpServer;

export const initialize = () => {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    app.use(adminBro.options.rootPath, adminRouter);
    app.use(morgan("combined"));
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ credentials: true, origin: origin }));
    // const csrfProtection = csrf({
    //   cookie: true,
    // });
    // app.use(csrfProtection);
    // app.get("/api/csrf-token", (req, res) => {
    //   res.json({ csrfToken: req.csrfToken() });
    // });
    app.use("/api", router);
    app.use((req, res, next) => {
      const error = new Error("Not found!");
      error.status = 404;
      next(error);
    });
    app.use((error, req, res, next) => {
      res.status(error.status || 500).json({
        error: {
          status: error.status || 500,
          message: error.message,
        },
      });
    });

    httpServer
      .listen(port)
      .on("listening", () => {
        console.log(`web-server listening on port:${port}`);
        resolve();
      })
      .on("error", (err) => {
        console.log(err);
        reject();
      });
  });
};
export const close = () => {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
