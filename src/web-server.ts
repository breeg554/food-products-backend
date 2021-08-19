import http from "http";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import router from "./routes";
import ApiError from "./utils/ApiError";
import { port, origin } from "./config/web-server";
import { adminBro, adminRouter } from "./adminBro";

let httpServer: any;

export const initialize = () => {
  return new Promise((resolve: any, reject: any) => {
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
      const error = new ApiError("Not found!", 404);
      next(error);
    });
    app.use((error: any, req: any, res: any, next: any) => {
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
      .on("error", (err: any) => {
        console.log(err);
        reject();
      });
  });
};
export const close = () => {
  return new Promise((resolve: any, reject: any) => {
    httpServer.close((err: any) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
