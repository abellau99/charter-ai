import {
  sendPasswordRequestEmail,
  sendWelcomeEmail,
} from "@/services/sendgrid";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import moment from "moment";
import { model, models, Schema, SchemaDefinition } from "mongoose";
import { Account, User as NextAuthUser } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import Stripe from "stripe";
import { ValidationError } from "yup";
import { options } from ".";
import { IVideo } from "./Video";

function validatesEmailUniqueness(email: string) {
  return models.User.findOne({ email }).then((user) => {
    if (user && user.isNew) {
      throw new ValidationError("Email already exists", 400);
    }
  });
}

interface IVerification {
  isVerified: boolean;
  token: string;
  expiresAt: Date;
}

interface IPasswordReset {
  token: string;
  lastResetAt: Date;
  expiresAt: Date;
}

export interface ISubscription {
  stripeCustomer: string;
  interval: string;
  isPro: boolean;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  provider: string;
  verification: IVerification;
  passwordReset: IPasswordReset;
  videos: IVideo;
  subscription: ISubscription;
  lastCastAt: Date;
  isTopG: boolean;
}

const UserSchemaDefinition: SchemaDefinition<IUser> = {
  name: {
    type: String,
    required: false,
  },
  isTopG: {
    type: Boolean,
    required: true,
    default: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: validatesEmailUniqueness,
  },
  password: {
    type: String,
    required: false,
    min: [6, "Must be at least 6, got {VALUE}"],
  },
  avatar: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    required: false,
  },
  lastCastAt: {
    type: Date,
  },
  subscription: {
    stripeCustomer: {
      type: String,
      required: false,
    },
    isPro: {
      type: Boolean,
      defaultValue: false,
    },
    interval: {
      type: String,
      required: false,
    },
  },
  verification: {
    isVerified: {
      type: Boolean,
      defaultValue: false,
    },
    token: String,
    expiresAt: Date,
  },
  passwordReset: {
    lastResetAt: Date,
    token: String,
    expiresAt: Date,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
};

export const UserSchema: Schema = new Schema(UserSchemaDefinition, options);

UserSchema.virtual("id").get(function (): any {
  return this._id;
});

// UserSchema.statics.oAuthReg = async function ({
//   user,
//   account,
// }: {
//   user: AdapterUser | NextAuthUser;
//   account: Account | null;
// }) {
//   if (await this.findOne({ email: user.email })) {
//     return;
//   }

//   const u = await this.create({
//     email: user.email,
//     name: user.name,
//     avatar: user.image,
//     provider: account?.provider,
//   });

//   u.createStripeCustomer();

//   sendWelcomeEmail(u);
// };

UserSchema.methods = {
  canLogin: function () {
    return this.verification.isVerified && this.verification.token.length === 0;
  },
  hashPassword: function () {
    this.password = bcrypt.hashSync(this.password, 10);
  },
  authenticate: function (password: string) {
    return bcrypt.compareSync(password, this.password);
  },
  canCast: function () {
    if (this.subscription.isPro) return true;

    if (!this.lastCastAt) return true;

    const lastCastAt = moment(this.lastCastAt);
    const now = moment();
    const diff = now.diff(lastCastAt, "days");

    return diff >= 1;
  },
  requestResetPassword: async function () {
    try {
      this.passwordReset = {
        token: crypto.randomBytes(16).toString("hex"),
        expiresAt: moment().add(1, "days"),
      };
      await this.save();
      sendPasswordRequestEmail(this as IUser);
    } catch (err) {
      console.error(err);
    }
  },
  createStripeCustomer: async function () {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2022-11-15",
    });
    const customer = await stripe.customers.create({
      email: this.email,
    });
    this.subscription.stripeCustomer = customer.id;
    await this.save();
  },
  // userVideos: async function () {
  //   const res = await this.populate({
  //     path: "videos",
  //     model: Video,
  //   });
  //   return res;
  // },
};

UserSchema.pre("save", async function () {
  if (this.isNew && !this.provider) {
    let verificationToken = crypto.randomBytes(16).toString("hex");

    while (
      await MUser.findOne({ verification: { token: verificationToken } })
    ) {
      verificationToken = crypto.randomBytes(16).toString("hex");
      console.log(verificationToken);
    }
    this.verification = {
      isVerified: false,
      token: verificationToken,
      expiresAt: moment().add(2, "days"),
    };
  }
  if (!this.password || !this.isModified("password")) return;
  this.hashPassword();
});

const MUser = models.User || model<IUser>("User", UserSchema);

export const oAuthReg = async function ({
  user,
  account,
}: {
  user: AdapterUser | NextAuthUser;
  account: Account | null;
}) {
  if (await MUser.findOne({ email: user.email })) {
    return;
  }

  const u = await MUser.create({
    email: user.email,
    name: user.name,
    avatar: user.image,
    provider: account?.provider,
  });

  u.createStripeCustomer();

  sendWelcomeEmail(u);
};

export default MUser;
