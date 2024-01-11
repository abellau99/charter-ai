import createHandler from "@/lib/handler";
import Video, { IVideo } from "@/models/Video";
import { Document } from "mongodb";

interface IResponseVideo extends IVideo, Document {
  id: string;
  getSignedUrl(): Promise<string>;
}

const handler = createHandler();

handler.get(async (req, res) => {
  const videos: IResponseVideo[] = await Video.find({ landingCurated: true }).limit(
    10
  );
  // .sort({ createdAt: -1 });
  // const videos: IResponseVideo[] = Video.find({});
  const response: IResponseVideo[] = await Promise.all(
    videos.map(async (video: IResponseVideo) => {
      const url: string = await video.getSignedUrl();
      return {
        ...video.toObject(),
        url,
      };
    })
  );
  res.status(200).json(response);
});

export default handler;
