import { BackgroundType } from "@/lib/constants";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

import ffmpeg, { FfmpegCommand } from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath.path);

function ffmpegFreeCommand(
  user: any,
  backgroundAsset: any,
  tweetImage: string,
  bgOverlay: string,
  filePath: string,
  type: string,
  offset?: string,
  watermark?: string
): FfmpegCommand {
  var command: FfmpegCommand = ffmpeg(backgroundAsset);

  command.input(bgOverlay);

  if (user.subscription.isPro) {
    command
      .input(tweetImage)
      .complexFilter([
        // "[0:v]scale=800:-1,crop=ih*1/2:ih[bg];[1:v]scale=800*0.8:-1[fg];[2:v]scale=350:-1,format=rgba,colorchannelmixer=aa=0.8[wm];[bg][fg]overlay=(W-w)/2:(H-h)/2[tweet_overlay];[tweet_overlay][wm]overlay=(W-w)/2:1100",
        // "[0:v]scale=800:-1[bg];[1:v]scale=600:-1[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2",
        {
          filter: "scale",
          options: {
            width: -1,
            height: 1920,
          },
          inputs: ["0:v"],
          outputs: "scaled_bg",
        },
        {
          filter: "crop",
          options: {
            w: 1080,
            h: 1920,
          },
          inputs: "scaled_bg",
          outputs: "cropped_bg",
        },
        {
          filter: "scale",
          options: {
            width: -1,
            height: 1920,
          },
          inputs: ["1:v"],
          outputs: "scaled_bg_overlay",
        },
        {
          filter: "crop",
          options: {
            w: 1080,
            h: 1920,
          },
          inputs: "scaled_bg_overlay",
          outputs: "cropped_bg_overlay",
        },
        {
          filter: "scale",
          options: {
            width: 950,
            height: -1,
          },
          inputs: ["2:v"],
          outputs: "fg",
        },
        {
          filter: "overlay",
          options: {
            x: 0,
            y: 0,
          },
          inputs: ["cropped_bg", "cropped_bg_overlay"],
          outputs: ["bg"],
        },
        {
          filter: "overlay",
          options: {
            x: "(W-w)/2",
            y: "(H-h)/2",
          },
          inputs: ["bg", "fg"],
        },
      ])
      // .videoCodec(videoCodec)
      .output(filePath)
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      });
  } else {
    let offsetInt: number = parseInt(offset!.replace("px", "")) * 2 + 10;
    offsetInt = offsetInt + offsetInt * 0.5 + 10;

    command
      .input(tweetImage)
      .input(watermark || "")
      .complexFilter([
        // "[0:v]scale=800:-1,crop=ih*1/2:ih[bg];[1:v]scale=800*0.8:-1[fg];[2:v]scale=350:-1,format=rgba,colorchannelmixer=aa=0.8[wm];[bg][fg]overlay=(W-w)/2:(H-h)/2[tweet_overlay];[tweet_overlay][wm]overlay=(W-w)/2:1100",
        `[0:v]scale=width=-1:height=1920[scaled_bg];
        [scaled_bg]crop=w=1080:h=1920[cropped_bg];
        [1:v]scale=width=-1:height=1920[scaled_bg_overlay];
        [scaled_bg_overlay]crop=w=1080:h=1920[cropped_bg_overlay];
        [2:v]scale=950:-1[fg];
        [3:v]scale=400:-1,format=rgba,colorchannelmixer=aa=0.8[wm];
        [cropped_bg][cropped_bg_overlay]overlay=0:0[bg];
        [bg][fg]overlay=(W-w)/2:(H-h)/2[tweet_overlay];
        [tweet_overlay][wm]overlay=(W-w)/2:${offsetInt}`,
      ])
      // .outputOptions(outputOption)
      // .videoCodec(videoCodec)
      .output(filePath)
      .on("start", function (commandLine) {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      });
  }

  if (type === BackgroundType.Video) {
    command.outputOptions("-f mp4");
  }

  return command;
}

export { ffmpegFreeCommand };
