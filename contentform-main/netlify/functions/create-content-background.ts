import dbConnect from "@/config/database";
import {
  BackgroundType,
  DIRECT_UPLOAD_KEY_TEMPLATE,
  PusherEvents,
  RAW_UPLOADS,
} from "@/lib/constants";
import { ffmpegFreeCommand } from "@/lib/ffmpeg";
import User from "@/models/User";
import Video from "@/models/Video";
import { downloadFile } from "@/services/asset-download";
import { deleteRawUpload, getSignedUrl } from "@/services/aws";
import pusher from "@/services/pusher";
import type { HandlerContext, HandlerEvent } from "@netlify/functions";
// import { FfmpegCommand } from "fluent-ffmpeg";
import { unlink } from "node:fs/promises";
import { format } from "util";

const WATERMARK_PATH =
  "https://tweetcast-assets.s3.eu-west-2.amazonaws.com/images/ContentformWatermark.png";

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { fields, userId } = JSON.parse(event.body as string);

  console.log({ fields, userId });

  await dbConnect();

  const user = await User.findById(userId);

  const { mimeType, outputFileName: fileName } = outputOptions(
    fields.type as string
  );

  const isDirectUpload: boolean = fields.isDirectUpload === "true";

  let backgroundAsset = await parseBackground(
    fields.presignedKey || fields.backgroundURL,
    isDirectUpload
  );

  let filename = "";
  if (backgroundAsset.includes("https")) {
    if (isDirectUpload) {
      // Custom upload from user which was uploaded directly to S3
      const key = fields.presignedKey as string;
      filename = `input_${key.substring(key.lastIndexOf("/") + 1)}`;
    } else {
      // From Pexels
      filename = `input_${new Date(new Date()).getTime()}.mp4`;
    }

    console.log("Triggering file download!");
    console.log(filename);
    backgroundAsset = await downloadFile(backgroundAsset, filename);

    console.log("File download complete");
  }

  const tweetImage = await downloadSupportFile(userId, RAW_UPLOADS.TWEET);
  const bgOverlay = await downloadSupportFile(userId, RAW_UPLOADS.OVERLAY);

  const filePath = `/tmp/${fileName}`;

  let watermark = "";
  if (!user.subscription.isPro) {
    watermark = (await downloadFile(WATERMARK_PATH, "watermark.png")) || "";
  }

  console.log("PROMISED!");
  return await new Promise((resolve, reject) => {
    ffmpegFreeCommand(
      user,
      backgroundAsset,
      tweetImage,
      bgOverlay,
      filePath,
      fields.type as string,
      fields.offset as string,
      watermark
    )
      .on("end", async function () {
        const video = await createVideo(
          userId,
          fields.tweetLink as string,
          fields.title as string,
          mimeType,
          filePath,
          fileName
        );
        if (isDirectUpload) {
          deleteRawUpload(fields.presignedKey as string);
        }
        console.log("Processing finished !");
        const url = await video.getSignedUrl();
        console.log(url);
        pusher.trigger(`private_${userId}`, PusherEvents.ContentCreated, {
          ...video.toObject(),
          url,
        });

        await sleep(2000);
        resolve("ALL DONE!");
      })
      .on("error", async function (err) {
        console.log("An error occurred: " + err.message);
        console.log(user);
        pusher.trigger(
          `private_${user.id}`,
          PusherEvents.ContentCreationFailed,
          "An error occurred while creating your content. Please try again later."
        );
        await sleep(2000);

        reject(err);
      })
      .run();
  });
};

async function createVideo(
  userId: string,
  tweetLink: string,
  title: string,
  mimeType: string,
  filePath: string,
  fileName: string
) {
  const video = new Video({
    creator: userId,
    tweetLink,
    mimeType,
    title,
  });
  await video.create(filePath, fileName);
  await unlink(filePath);

  return video;
}

function outputOptions(type?: string) {
  // This is dirty for now. I will fix later

  let obj = {
    outputOption: "",
    videoCodec: "",
    mimeType: "",
    outputFileName: "",
  };
  if (type === BackgroundType.Video) {
    obj = {
      ...obj,
      mimeType: "video/mp4",
      outputFileName: `contentform-${new Date(new Date()).getTime()}.mp4`,
    };
  }

  if (type === BackgroundType.Image) {
    obj = {
      ...obj,
      mimeType: "image/png",
      outputFileName: `contentform-${new Date(new Date()).getTime()}.png`,
    };
  }

  return obj;
}

async function parseBackground(
  backgroundFootage: any,
  isDirectUpload: boolean = false
) {
  if (isDirectUpload) {
    return await getSignedUrl(backgroundFootage);
  }

  if (!backgroundFootage.includes("https://")) {
    // return path.join(process.cwd(), "public", backgroundFootage);
    return "https://tweetcast-assets.s3.eu-west-2.amazonaws.com/images/ContentDefaultBG.png";
  }

  return backgroundFootage;
}

async function downloadSupportFile(userId: string, filename: string) {
  let key: string = format(DIRECT_UPLOAD_KEY_TEMPLATE, userId, filename);
  let assetFileName: string = `${userId}_${filename}`;
  let signedUrl: string = await getSignedUrl(key);
  return (await downloadFile(signedUrl, assetFileName)) || "";
}

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
