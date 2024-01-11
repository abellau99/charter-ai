import { DIRECT_UPLOAD_KEY_TEMPLATE } from "@/lib/constants";
import createHandler from "@/lib/handler";
import { generatePresignedUrl } from "@/services/aws";
import { format } from "util";

const handler = createHandler();

handler.get(async (req, res) => {
  const { fileName, type } = req.query;
  // const bgKey = `raw-uploads/${req.currentUser.id}/${fileName}`;
  const bgKey = format(
    DIRECT_UPLOAD_KEY_TEMPLATE,
    req.currentUser.id,
    fileName
  );
  const bgPresignedUrl = await generatePresignedUrl(bgKey, type as string);

  res.status(200).json({
    background: {
      url: bgPresignedUrl,
      key: bgKey,
    },
  });
});

export default handler;
