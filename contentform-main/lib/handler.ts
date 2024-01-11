import dbConnect from "@/config/database";
import createHttpError from "http-errors";
import { MongoServerError } from "mongodb";
import { Error as MongooseError } from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import nc from "next-connect";
import { ValidationError } from "yup";
import { authOptions } from "./../pages/api/auth/[...nextauth]";

interface ICurrentUser {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
  image?: string | undefined;
}
export interface NextApiRequestExtended extends NextApiRequest {
  currentUser: ICurrentUser;
}

interface ErrorResponse {
  error: {
    message: string;
    err?: any;
  };
  status?: number;
}

const errorHandler = (err: any, res: NextApiResponse<ErrorResponse>) => {
  console.info("ERROR HANDLER:");
  console.error(err);
  if (createHttpError.isHttpError(err) && err.expose) {
    console.log("HTTP ERROR");
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
  } else if (err instanceof ValidationError) {
    console.log("YUP VALIDATION ERROR");
    return res.status(400).json({
      error: { message: "VALIDATION_ERROR", err: err.errors.join(", ") },
    });
  } else if (err instanceof MongooseError.ValidationError) {
    console.log("DB VALIDATION ERROR");
    let condensedErrs = Object.keys(err.errors).map((key) => {
      return {
        [key]: err.errors[key].message,
      };
    });
    return res
      .status(400)
      .json({ error: { message: "VALIDATION_ERROR", err: condensedErrs } });
  } else if (err instanceof MongoServerError) {
    console.log("YUP VALIDATION ERROR");
    console.error(err.message);
    return res.status(500).json({
      error: {
        message: "INTERNAL_SERVER_ERROR",
        err,
      },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  } else {
    // default to 500 server error
    console.log("DEFAULT ERROR");
    return res.status(500).json({
      error: {
        message: "INTERNAL_SERVER_ERROR",
        err,
      },
      status: createHttpError.isHttpError(err) ? err.statusCode : 500,
    });
  }
};

const createHandler = () => {
  const handler = nc<NextApiRequestExtended, NextApiResponse>({
    onError(error, req, res) {
      errorHandler(error, res);
    },
    onNoMatch(req, res) {
      res.status(405).json({
        error: {
          message: `Method ${req.method} not allowed}`,
        },
      } as ErrorResponse);
    },
  });

  // Middlewares STARt -----
  // --- Authentication
  const publicRoutes = [
    "/api/auth",
    "/api/users/verify",
    "/api/users/forgot-password",
    "/api/users/reset-password",
    "/api/users/signup",
    "/api/stripe/webhook",
    "/api/tweets/public-fetch-tweet",
    "/api/videos/landing-curated",
    "/api/videos/auth-curated",
  ];
  handler.use(async (req, res, next) => {
    for (const r of publicRoutes) {
      if (req.url?.startsWith(r)) {
        return next();
      }
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      // res.redirect("/auth/login");
      throw new createHttpError.Unauthorized("Not authenticated! Log in!");
    }
    console.log(session);
    console.log(req.currentUser);
    if (session) {
      req.currentUser = session.user as ICurrentUser;
    }
    next();
  });

  /**
   * List/Array of all the routes that requires reCaptcha authentication
   */
  const reCaptchaRoutes: string[] = [
    "/api/users/signup",
    "/api/users/forgot-password",
  ];

  handler.use(async (req, res, next) => {
    if (reCaptchaRoutes.length === 0) return next();

    let skipCaptchaCheck: boolean = true;

    for (const r of reCaptchaRoutes) {
      if (req.url?.startsWith(r)) {
        skipCaptchaCheck = false;
        break;
      }
    }

    if (skipCaptchaCheck) return next();

    const token = JSON.parse(req.body).gReCaptchaToken;

    if (!token) {
      throw new createHttpError.Forbidden("Human verification failed");
    }

    // Recaptcha response
    const response = await verifyRecaptcha(token);

    if (!response.ok) {
      throw new createHttpError.Forbidden("Human verification failed");
    }

    const data = (await response.json()) as ICaptchaData;

    if (data.score < 0.5) {
      throw new createHttpError.Forbidden("Human verification failed");
    }

    next();
  });

  handler.use(async (req, res, next) => {
    await dbConnect();
    next();
  });
  // .use(async (req, res, next) => {
  //   try {
  //     next();
  //   } catch (error) {
  //     console.log("---------------- ERROR ------------------");
  //     console.log(error);
  //   }
  // });
  // .use((req, res, next) => {
  //   req.currentUser = {
  //     userId: null,
  //     email: null,
  //   };
  //   const { authorization } = req.headers;

  //   if (!authorization) {
  //     next();
  //   } else {
  //     verify(authorization, "secret", (error: any, decoded: any) => {});
  //   }
  // });

  return handler;
};

/**
 * This function uses the Google reCaptcha token passed from FE to verify.
 * @param token Google reCaptcha token
 * @returns Response
 */
async function verifyRecaptcha(token: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  var verificationUrl =
    "https://www.google.com/recaptcha/api/siteverify?secret=" +
    secretKey +
    "&response=" +
    token;

  return await fetch(verificationUrl, {
    method: "post",
  });
}

/**
 * Interface to define the response from Google reCaptcha
 */
interface ICaptchaData {
  /**
   * score returned by google reCaptcha
   */
  score: number;
}

export default createHandler;
