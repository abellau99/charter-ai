import createHttpError from "http-errors";
import moment from "moment";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import User from "@/models/User";

const handler = createHandler();

handler.get(async (req, res) => {
  const { email, token } = req.query;
  console.log(email, token);
  const user = await User.findOne({ email, "verification.token": token });

  if (!user) {
    throw new createHttpError.NotFound("Invalid user and token");
  }

  if (moment() > user.verification.expiresAt) {
    throw new createHttpError.Forbidden("Token Expired!");
  }

  user.verification = {
    isVerified: true,
    token: "",
    expiresAt: null,
  };
  await user.save();
  res.redirect(`/auth/login?email=${email}`);
});

export default handler;
