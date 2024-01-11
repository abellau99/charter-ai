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

  const stripeParams: Stripe.SubscriptionCreateParams = {
    customer: user.subscription.stripeCustomer,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    collection_method: "charge_automatically",
    currency: "usd",
  };
  const subscription = await stripe.subscriptions.create(stripeParams);

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  if (invoice.payment_intent) {
    const intent = invoice.payment_intent as Stripe.PaymentIntent;
    return res.send({
      id: subscription.id,
      clientSecret: intent.client_secret,
    });
  }

  res.status(500).send("Contact support.");
});

export default handler;
