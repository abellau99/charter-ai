// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import createHandler from "@/lib/handler";
import User from "@/models/User";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

interface ISubscriptionParam {
  plan: string;
  interval: string;
}

interface IInterval {
  month: string;
  year: string;
}

interface IPriceMap {
  free: IInterval;
  pro: IInterval;
  [key: string]: any;
}

const price_map: IPriceMap = {
  free: {
    month: process.env.STRIPE_PRODUCT_FREE_MONTH!,
    year: process.env.STRIPE_PRODUCT_FREE_YEAR!,
  },
  pro: {
    month: process.env.STRIPE_PRODUCT_PRO_MONTH!,
    year: process.env.STRIPE_PRODUCT_PRO_YEAR!,
  },
};

const handler = createHandler();

handler.post(async (req, res) => {
  const { plan, interval }: ISubscriptionParam = req.body;
  const priceId: string = price_map[plan][interval];
  // const stripeParams: Stripe.Checkout.SessionCreateParams = {
  //   billing_address_collection: "auto",
  //   line_items: [
  //     {
  //       price: priceId,
  //       quantity: 1,
  //     },
  //   ],
  //   mode: "subscription",
  //   success_url: `${process.env.NEXTAUTH_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
  //   cancel_url: `${process.env.NEXTAUTH_URL}?canceled=true`,
  // };

  const user = await User.findById(req.currentUser.id);

  if (user.subscription.isPro) {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomer,
      return_url: `${process.env.NEXTAUTH_URL}`,
    });
    return res.send({
      alreadyPro: true,
      url: session.url,
    });
  }

  const stripeParams: Stripe.Checkout.SessionCreateParams = {
    customer: user.subscription.stripeCustomer,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard/create`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/subscription`,
  };
  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(stripeParams);
  res.send({
    id: checkoutSession.id,
  });
});

export default handler;
