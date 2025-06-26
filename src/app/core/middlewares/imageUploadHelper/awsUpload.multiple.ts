/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import catchAsync from "../../../common/utils/catchAsync";
import { CONFIG } from "../../config";
import { s3Client } from "./awsS3Client";

export const AwsUploadMultiple = (fieldName: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const files: Express.Multer.File[] = (req.files as any)[fieldName] || [];
    const uploadedImages: string[] = [];

    if (files.length > 0) {
      let imageCount = 1;

      for (const file of files) {
        const fileNameParts = file.originalname.split(/[^a-zA-Z0-9]/);
        const firstWord = fileNameParts[0];
        const imageName = `vouched-${firstWord}-image-${String(imageCount).padStart(2, "0")}.webp`;
        imageCount++;

        // 👉 Resize and convert to webp
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
          const photos = await s3Client.upload(params as any).promise();
          uploadedImages.push(photos.Location);
        } catch (error) {
          console.error("S3 upload failed:", error);
          return res.status(500).json({ message: "File upload failed", error });
        }
      }

      req.body[fieldName] = uploadedImages;
    }

    next();
  });
};
