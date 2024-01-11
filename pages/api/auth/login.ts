import createHttpError from "http-errors";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import User from "@/models/User";

type LoginParams = {
  email: string;
  password: string;
};
const handler = createHandler();

handler.post(async (req, res) => {
  const { email, password }: LoginParams = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new createHttpError.NotFound("User not found");
  }
  if (!user.authenticate(password)) {
    throw new createHttpError.NotFound("User not found");
  }
  res.status(201).json(user);
});
export default handler;
