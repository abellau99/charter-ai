import { CurationType } from "@/lib/constants";
import createHandler from "@/lib/handler";
import User from "@/models/User";
import MVideo from "@/models/Video";
import createHttpError from "http-errors";

const handler = createHandler();

handler.post(async (req, res) => {
  const user = await User.findById(req.currentUser.id);
  if (!user.isTopG) {
    throw new createHttpError.Forbidden(
      "You are not authorized to perform this action."
    );
  }

  const { id } = req.query;
  const { curated, type } = req.body;
  const video = await MVideo.findById(id);
  if (!video) {
    res.json({});
  }

  if (type === CurationType.Landing) {
    video.landingCurated = curated;
  }
  if (type === CurationType.Auth) {
    video.authCurated = curated;
  }
  await video.save();

  res.json({
    video,
  });
});

export default handler;
