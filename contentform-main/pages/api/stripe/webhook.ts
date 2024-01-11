// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import createHandler from "@/lib/handler";
import User from "@/models/User";
import { buffer } from "micro";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export const config = { api: { bodyParser: false } };

const handler = createHandler();

handler.post(async (req, res) => {
  let event = req.body;
  // Replace this endpoint secret with your endpoint's unique secret
  // If you are testing with the CLI, find the secret by running 'stripe listen'
  // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
  // at https://dashboard.stripe.com/webhooks
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      console.log(
        `⚠️  Webhook signature verification failed.`,
        "Signature Missing"
      );
      return res.send(400);
    }
    try {
      const reqBuffer = await buffer(req);
      event = stripe.webhooks.constructEvent(
        reqBuffer,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, `${err}`);
      return res.send(400);
    }
  }
  let subscription;
  let status;
  // Handle the event
  let user;
  switch (event.type) {
    case "invoice.paid":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break;
    case "customer.subscription.deleted":
      // if (event.request != null) {
      //   // handle a subscription canceled by your request
      //   // from above.
      // } else {
      //   // handle subscription canceled automatically based
      //   // upon your subscription settings.
      // }
      subscription = event.data.object;
      status = subscription.status;

      console.log(`Subscription status is ${status}.`);
      // Then define and call a method to handle the subscription deleted.
      // handleSubscriptionDeleted(subscriptionDeleted);
      user = await User.findOne({
        "subscription.stripeCustomer": subscription.customer,
      });

      if (!user) {
        console.log(`User with CustomerID: ${subscription.customer} not found`);
        return;
      }

      user.subscription.isPro = false;
      user.subscription.interval = null;
      await user.save();

      break;
    case "customer.subscription.updated":
      subscription = event.data.object;
      status = subscription.status;
      console.log(`Subscription status is ${status}.`);

      user = await User.findOne({
        "subscription.stripeCustomer": subscription.customer,
      });

      if (!user) {
        console.log(`User with CustomerID: ${subscription.customer} not found`);
        return;
      }
      // user.subscription.isPro =
      //   subscription.plan.metadata.isPro ||
      //   subscription.plan.metadata.amount > 0;
      user.subscription.isPro =
        subscription.items.data[0].plan.product ===
        process.env.STRIPE_PRODUCT_PRO_ID;
      user.subscription.interval = subscription.items.data[0].plan.interval;
      await user.save();

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
  // Return a 200 response to acknowledge receipt of the event
  // console.log({ sub: event.data.object });
  res.send({ received: true });
});

export default handler;
