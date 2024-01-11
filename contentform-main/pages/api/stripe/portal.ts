// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import User from "@/models/User";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const handler = createHandler();

handler.get(async (req, res) => {
  const stripeCustomer = (await User.findById(req.currentUser.id)).subscription
    .stripeCustomer;
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer,
    return_url: `${process.env.NEXTAUTH_URL}`,
  });
  res.send({
    url: session.url,
  });
});

export default handler;
