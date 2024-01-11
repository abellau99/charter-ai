import fs from "fs";
import { join } from "path";
import { promisify } from "util";

const pipeline = promisify(require("stream").pipeline);

export async function downloadFile(url: string, filename: string) {
  try {
    console.log("File download started!");
    const path = join("/tmp", filename);
    console.log(path);
    const fileStream = fs.createWriteStream(path);

    const response = await fetch(url);
    await pipeline(response.body, fileStream);
    return path;
  } catch (err) {
    console.log(err);
  }
}
