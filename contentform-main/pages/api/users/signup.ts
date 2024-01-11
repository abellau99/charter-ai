// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import { checkAndThrowDisposableEmail } from "@/lib/utils";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/services/sendgrid";
import createHttpError from "http-errors";

/**
 * Interface for the signup params
 *
 * @interface
 */
interface ISignupParams {
  /**
   * The name of the user
   * @type {string}
   */
  name: string;
  /**
   * The email of the user
   * @type {string}
   */
  email: string;
  /**
   * The password of the user
   * @type {string}
   */
  password: string;
}

const handler = createHandler();

handler.post(async (req, res) => {
  const { name, email, password }: ISignupParams = JSON.parse(req.body);

  /**
   * Check for disposable email first.
   */
  await checkAndThrowDisposableEmail(email);

  if (await User.findOne({ email })) {
    throw new createHttpError.UnprocessableEntity(
      "User with email already exists"
    );
  }
  const user = await User.create({ name, email, password });

  await user.createStripeCustomer();

  sendWelcomeEmail(user);

  res.status(201).json(user);
});

export default handler;
