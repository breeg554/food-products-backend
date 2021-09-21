import { Request, Response, NextFunction } from "express";
import nodemailer from "nodemailer";
import ApiError from "../utils/ApiError";
export const sendShoppingList = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, senderName } = req.body;
  const { file } = req;

  if (!email || !name || !senderName || !file)
    return next(new ApiError("Recipient's e-mail address, name, pdf and sender name are required", 400));

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "smartmealplan@gmail.com",
      to: email,
      subject: `Cześć ${name}. Mamy dla ciebie listę zakupów!`,
      text: `${senderName} wysyła ci listę zakupów :)`,
      attachments: [
        {
          filename: "lista-zakupow.pdf",
          content: file.buffer,
        },
      ],
    });
    res.status(200).send(info);
  } catch (err: any) {
    next(err);
  }
};

export const sendRecipe = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, senderName } = req.body;
  const { file } = req;

  if (!email || !name || !senderName || !file)
    return next(new ApiError("Recipient's e-mail address, name, pdf and sender name are required", 400));

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "smartmealplan@gmail.com",
      to: email,
      subject: `Cześć ${name}. Obczaj ten przepis!`,
      text: `${senderName} udostępnia Ci przepis :)`,
      attachments: [
        {
          filename: "przepis.pdf",
          content: file.buffer,
        },
      ],
    });
    res.status(200).send(info);
  } catch (err: any) {
    next(err);
  }
};

export const sendPlanner = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, senderName } = req.body;
  const { file } = req;

  if (!email || !name || !senderName || !file)
    return next(new ApiError("Recipient's e-mail address, name, pdf and sender name are required", 400));

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASS,
      },
    });
    const info = await transporter.sendMail({
      from: "smartmealplan@gmail.com",
      to: email,
      subject: `Cześć ${name}. Łap plan posiłków!`,
      text: `${senderName} udostępnia Ci plan posiłków :)`,
      attachments: [
        {
          filename: "plan.pdf",
          content: file.buffer,
        },
      ],
    });
    res.status(200).send(info);
  } catch (err: any) {
    next(err);
  }
};
