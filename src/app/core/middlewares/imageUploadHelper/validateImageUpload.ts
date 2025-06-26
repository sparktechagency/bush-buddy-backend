/* eslint-disable no-undef */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../../core/error/AppError";

export const validateImageUpload = (
  requiredFields: { name: string; maxSizeMB?: number; required?: boolean }[]
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const field of requiredFields) {
        let files: Express.Multer.File[] | undefined;

        if (
          req.files &&
          typeof req.files === "object" &&
          !Array.isArray(req.files)
        ) {
          files = (req.files as { [fieldname: string]: Express.Multer.File[] })[
            field.name
          ];
        } else {
          files = undefined;
        }

        if ((!files || files.length === 0) && field.required !== false) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `Missing field: ${field.name}`
          );
        }

        if (!files || files.length === 0) {
          continue; // skip this field validation
        }

        for (const file of files) {
          if (!file.mimetype.startsWith("image/")) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              `${field.name} must be an image`
            );
          }

          const sizeLimit = (field.maxSizeMB || 5) * 1024 * 1024; // default 5MB
          if (file.size > sizeLimit) {
            throw new AppError(
              httpStatus.BAD_REQUEST,
              `${field.name} must be less than ${field.maxSizeMB || 5}MB`
            );
          }
        }
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
