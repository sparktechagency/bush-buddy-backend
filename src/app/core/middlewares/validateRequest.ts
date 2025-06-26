/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import catchAsync from "../../common/utils/catchAsync";
const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (typeof req.body.data === "string") {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (parseError: any) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in request body",
          error: parseError?.message,
        });
      }
    }
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
      file: req.file,
      files: req.files,
    });

    next();
  });
};

export default validateRequest;
