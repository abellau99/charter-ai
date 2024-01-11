import User from "@/models/User";
import s3Client, { BUCKET_NAME, getCFSignedUrl } from "@/services/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import moment from "moment";
import { model, models, Schema, SchemaDefinition } from "mongoose";
import { options } from ".";
import { IUser } from "./User";

export interface IVideo {
  creator: IUser;
  tweetLink: string;
  title: string;
  mimeType: string;
  castS3Key: string;
  landingCurated: boolean;
  authCurated: boolean;
}

const VideoSchemaDefinition: SchemaDefinition<IVideo> = {
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tweetLink: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  castS3Key: {
    type: String,
    required: false,
  },
  landingCurated: {
    type: Boolean,
    required: true,
    default: false,
  },
  authCurated: {
    type: Boolean,
    required: true,
    default: false,
  },
};

export const VideoSchema: Schema = new Schema(VideoSchemaDefinition, options);

VideoSchema.virtual("id").get(function (): any {
  return this._id;
});

// VideoSchema.virtual("castUrl").get(async function () {
//   const getObjectParams = {
//     Bucket: BUCKET_NAME,
//     Key: this.castS3Key,
//   };

//   const command = new GetObjectCommand(getObjectParams);
//   const presignedUrl = await getSignedUrl(s3Client, command, {
//     expiresIn: 3600,
//   });

//   console.log("-----------------------");
//   console.log(presignedUrl);

//   return presignedUrl;
// });

VideoSchema.methods = {
  create: async function (filePath: string, fileName: string) {
    await this.create;
    const stream = fs.createReadStream(filePath);

    const key: string = `contents/${this.id}/${fileName}`;
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: stream,
    };

    const command = new PutObjectCommand(params);

    await s3Client.send(command);

    this.castS3Key = key;
    await this.save();
    const user = await User.findById(this.creator._id);

    user.videos.push(this);
    user.lastCastAt = moment();

    await user.save();
    console.log("UPLOAD FINISH");
  },

  getSignedUrl: async function (): Promise<string> {
    const presignedUrl = getCFSignedUrl(this.castS3Key);

    return presignedUrl;
  },
};

const MVideo = models.Video || model<IVideo>("Video", VideoSchema);

export default MVideo;
