// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import limiter from "@/services/rate-limiter";
import { fetchTweetV2 } from "@/services/twitter";

interface ITweetParam {
  tweetUrl: string;
}

const handler = createHandler();

handler.post(async (req, res) => {
  limiter(req, res, async function () {
    const { tweetUrl }: ITweetParam = req.body;
    if (tweetUrl.length <= 0) {
      res.status(201);
    }

    try {
      const tweet = await fetchTweetV2(tweetUrl);
      res.status(201).json(tweet);
    } catch (error) {
      res.status(400).json({
        error: {
          message: "Invalid tweet URL",
        },
      });
    }
  });
});

export default handler;
