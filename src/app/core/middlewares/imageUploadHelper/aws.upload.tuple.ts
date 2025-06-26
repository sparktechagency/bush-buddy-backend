/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import catchAsync from "../../../common/utils/catchAsync";
import { CONFIG } from "../../config";
import { s3Client } from "./awsS3Client";

type UploadFieldConfig = {
  fieldName: string;
  multiple: boolean; // true = array, false = single string
};

export const AwsUploadTuple = (fields: UploadFieldConfig[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    for (const field of fields) {
      const files: Express.Multer.File[] =
        (req.files as any)[field.fieldName] || [];
      const uploadedImages: string[] = [];

      if (files.length > 0) {
        let imageCount = 1;

        for (const file of files) {
          const fileNameParts = file.originalname.split(/[^a-zA-Z0-9]/);
          const firstWord = fileNameParts[0] || "image";
          const imageName = `vouched-${firstWord}-image-${String(imageCount).padStart(2, "0")}.webp`;
          imageCount++;

          const resizedImageBuffer = await sharp(file.buffer)
            .resize({ width: 800 })
            .webp({ quality: 80 })
            .toBuffer();

          const params = {
            Bucket: CONFIG.AWS.aws_bucket,
            Key: imageName,
            Body: resizedImageBuffer,
            ContentType: "image/webp",
          };

          try {
            const photo = await s3Client.upload(params as any).promise();
            uploadedImages.push(photo.Location);
          } catch (error) {
            console.error("S3 upload failed:", error);
            return res
              .status(500)
              .json({ message: "File upload failed", error });
          }
        }

        // 📦 Store in req.body as string or array based on `multiple` option
        req.body[field.fieldName] = field.multiple
          ? uploadedImages
          : uploadedImages[0] || null;
      }
    }

    next();
  });
};
