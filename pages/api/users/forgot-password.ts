import createHttpError from "http-errors";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import User from "@/models/User";

interface IForgotPasswordParams {
  email: string;
}

const handler = createHandler();

handler.post(async (req, res) => {
  const { email }: IForgotPasswordParams = JSON.parse(req.body);
  const user = await User.findOne({ email });

  if (!user) {
    throw new createHttpError.NotFound("Email not found");
  }

  if (!user.verification.isVerified) {
    throw new createHttpError.NotFound("You have not verified your email yet");
  }

  user.requestResetPassword();

  res.status(201).end();
});

export default handler;
