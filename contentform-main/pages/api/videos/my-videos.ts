import createHandler from "@/lib/handler";
import User from "@/models/User";
import Video, { IVideo } from "@/models/Video";
import { Document } from "mongodb";

interface IResponseVideo extends IVideo, Document {
  id: string;
  getSignedUrl(): Promise<string>;
}

const handler = createHandler();

handler.get(async (req, res) => {
  const userId: string | undefined = req.currentUser.id;
  const user = await User.findById(userId).populate({
    path: "videos",
    model: Video,
  });

  if (!user) {
    res.status(404);
  }
  const videos: IResponseVideo[] = user.videos.sort(
    (a: IResponseVideo, b: IResponseVideo) => b.createdAt - a.createdAt
  );
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
