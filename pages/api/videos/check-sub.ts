import User from "@/models/User";
import createHttpError from "http-errors";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";

const handler = createHandler();

handler.get(async (req, res, session) => {
  // Just a proxy and license checker
  const user = await User.findById(req.currentUser.id);
  // This is the PAY WALL
  if (!user.canCast()) {
    throw new createHttpError.Forbidden(
      "You have reached your daily limit. Upgrade to Pro."
    );
  }

  return res.status(201).end();
});

export default handler;
