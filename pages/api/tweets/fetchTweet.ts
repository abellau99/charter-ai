import { DIRECT_UPLOAD_KEY_TEMPLATE, RAW_UPLOADS } from "@/lib/constants";
import createHandler from "@/lib/handler";
import { generatePresignedUrl } from "@/services/aws";
import { fetchTweetV2 } from "@/services/twitter";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { format } from "util";

interface ITweetParam {
  tweetUrl: string;
}

const handler = createHandler();

handler.post(async (req, res, next) => {
  const { tweetUrl }: ITweetParam = req.body;

  // TODO: Export this to different endpoint
  const tweetKey = format(
    DIRECT_UPLOAD_KEY_TEMPLATE,
    req.currentUser.id,
    RAW_UPLOADS.TWEET
  );
  const tweetPresignedUrl = await generatePresignedUrl(tweetKey, "image/png");

  // const overlayKey = `raw-uploads/${req.currentUser.id}/overlay.png`;
  const overlayKey = format(
    DIRECT_UPLOAD_KEY_TEMPLATE,
    req.currentUser.id,
    RAW_UPLOADS.OVERLAY
  );
  const overlayPresignedUrl = await generatePresignedUrl(
    overlayKey,
    "image/png"
  );
  res.status(201).json({
    tweetData: await fetchTweetV2(tweetUrl),
    tweetPresignedUrl,
    overlayPresignedUrl,
  });
});

export default handler;
