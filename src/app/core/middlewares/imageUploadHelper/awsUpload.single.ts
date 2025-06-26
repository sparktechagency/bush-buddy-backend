/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";
import catchAsync from "../../../common/utils/catchAsync";
import { CONFIG } from "../../config";
import { s3Client } from "./awsS3Client";

export const AwsUploadSingle = (fieldName: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const file: any = req.file;

    if (file) {
      const fileNameParts = file.originalname.split("-");
      const firstPart = fileNameParts[0];
      const dateString = new Date()
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, "")
        .slice(2);

      const uniqueFileName = `vouched-${firstPart}-${dateString}.webp`;

      // 👉 Resize and convert to webp
      const resizedImageBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .webp({ quality: 80 }) // compress and convert
        .toBuffer();

      const params = {
        Bucket: CONFIG.AWS.aws_bucket,
        Key: uniqueFileName,
        Body: resizedImageBuffer,
        ContentType: "image/webp",
      };

      try {
        const profilePhoto = await s3Client.upload(params as any).promise();
        req.body[fieldName] = profilePhoto.Location;
      } catch (error) {
        console.error("Error uploading file to S3: ", error);
        return res.status(500).json({ error: "Failed to upload image." });
      }
    }

    next();
  });
};
