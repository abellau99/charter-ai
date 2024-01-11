import createHandler from "@/lib/handler";
import User from "@/models/User";
import { DateTime } from "luxon";

const handler = createHandler();

handler.get(async (req, res) => {
  const user = await User.findById(req.currentUser.id);

  // const lastCastAt = DateTime.fromISO(user?.lastCastAt);
  const lastCastAt = DateTime.fromJSDate(new Date(user?.lastCastAt));

  let nextAt: DateTime | null = lastCastAt.plus({ days: 1 });

  if (nextAt < DateTime.now()) {
    nextAt = null;
  }

  res.status(200).json({ lastCastAt, nextAt });
});

export default handler;
