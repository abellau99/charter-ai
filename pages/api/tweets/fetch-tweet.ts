// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import { fetchTweet } from "@/services/twitter";

interface ITweetParam {
  tweetUrl: string;
}

const handler = createHandler();

handler.post(async (req, res) => {
  console.log("---------------------------------- FETCH TWEET");
  console.log(req.url);
  console.log(req.method);
  const { tweetUrl }: ITweetParam = req.body;
  res.status(201).json(await fetchTweet(tweetUrl));
});

export default handler;
