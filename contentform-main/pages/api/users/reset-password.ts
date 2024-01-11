import createHttpError from "http-errors";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import User from "@/models/User";
import moment from "moment";

interface IForgotPasswordParams {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const handler = createHandler();

handler.post(async (req, res) => {
  const { email, token, newPassword, confirmPassword }: IForgotPasswordParams =
    JSON.parse(req.body);
  const user = await User.findOne({ email, "passwordReset.token": token });

  if (!user) {
    throw new createHttpError.NotFound("User not found");
  }

  if (!user.verification.isVerified) {
    throw new createHttpError.NotAcceptable(
      "You have not verified your email yet"
    );
  }

  if (moment() > user.passwordReset.expiresAt) {
    throw new createHttpError.Forbidden("Token Expired");
  }

  if (newPassword !== confirmPassword) {
    throw new createHttpError.NotAcceptable("Password did not match");
  }

  user.password = newPassword;
  user.passwordReset = {
    lastResetAt: moment(),
    token: "",
    expiresAt: "",
  };

  try {
    await user.save();
  } catch (err) {
    console.error(err);
    throw new createHttpError.InternalServerError(JSON.stringify(err));
  }

  res.status(201).end();
});

export default handler;
