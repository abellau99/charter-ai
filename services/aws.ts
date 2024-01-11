import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl as cfSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getSignedUrl as awsGetSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "eu-west-2",
  credentials: {
    accessKeyId: process.env.ENV_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.ENV_AWS_SECRET_ACCESS_KEY!,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// -------------- Utility Functions
// CloudFront
const AWS_CF_DOMAIN = process.env.AWS_CF_DOMAIN;
const AWS_CF_KEYPAIR_ID = process.env.AWS_CF_KEYPAIR_ID!;
// const AWS_CF_PRIVATE_KEY = fs.readFileSync(
//   path.join(process.cwd(), "pk.pem"),
//   "utf8"
// );
const AWS_CF_PRIVATE_KEY = process.env
  .AWS_CF_PRIVATE_KEY!.split(String.raw`\n`)
  .join("\n");

export function getCFSignedUrl(key: string) {
  const url = `${AWS_CF_DOMAIN}/${key}`;

  const date = new Date();
  date.setDate(date.getDate() + 1);
  const signedUrl = cfSignedUrl({
    url,
    keyPairId: AWS_CF_KEYPAIR_ID,
    privateKey: AWS_CF_PRIVATE_KEY,
    dateLessThan: date.toString(),
  });
  return signedUrl;
}

// S3
export async function deleteRawUpload(key: string) {
  const deleteObjectParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const command = new DeleteObjectCommand(deleteObjectParams);
  await s3Client.send(command);
}

export async function getSignedUrl(key: string) {
  const getObjectParams = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const command = new GetObjectCommand(getObjectParams);
  const presignedUrl = await awsGetSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return presignedUrl;
}

export async function generatePresignedUrl(key: string, type: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: type,
  };

  const command = new PutObjectCommand(params);

  const presignedUrl = await awsGetSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return presignedUrl;
}

export default s3Client;
