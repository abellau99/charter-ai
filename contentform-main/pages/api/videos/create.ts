import User from "@/models/User";
import createHttpError from "http-errors";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import formidable from "formidable";

ffmpeg.setFfmpegPath(ffmpegPath.path);

interface IFormData {
  fields: formidable.Fields;
  files: formidable.Files;
}

const handler = createHandler();

handler.post(async (req, res, session) => {
  // Just a proxy and license checker
  const user = await User.findById(req.currentUser.id);

  // const video = await Video.findOne({});
  // const url = await video.getSignedUrl();
  // return res.status(201).json({
  //   ...video.toObject(),
  //   url,
  // });

  // This is the PAY WALL
  if (!user.canCast()) {
    throw new createHttpError.Forbidden(
      "You have reached your daily limit. Upgrade to Pro."
    );
  }

  const form = formidable({ multiples: false });

  const formData = new Promise<IFormData>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject("err");
      }
      resolve({ fields, files });
    });
  });

  try {
    const { fields, files }: IFormData = await formData;
    return res.status(201).json({ fields, userId: req.currentUser.id });
  } catch (e) {
    return createHttpError.InternalServerError(e?.toString());
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
