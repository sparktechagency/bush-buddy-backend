import AWS from "aws-sdk";
import { CONFIG } from "../../config";

export const s3Client = new AWS.S3({
  accessKeyId: CONFIG.AWS.aws_access_key_id,
  secretAccessKey: CONFIG.AWS.aws_secret_access_key,
});
