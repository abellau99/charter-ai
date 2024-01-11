// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";

type LoginParams = {
  email: string;
  password: string;
};
const handler = createHandler();

handler.get(async (req, res) => {
  res.status(201).json({ data: "protected" });
});

export default handler;
