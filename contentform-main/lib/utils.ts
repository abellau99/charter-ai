import { ITweetData } from "@/app/interfaces/interfaces";
import logger from "@/services/logger";
import createHttpError from "http-errors";

export const parseTweet = (data: ITweetData): ITweetData => {
  const parser = new DOMParser();

  const tData = {
    ...(data as ITweetData),
    tweetText:
      parser.parseFromString(data.tweetText, "text/html").documentElement
        .textContent || "",
  } as ITweetData;

  return tData;
};

/**
 * URL to the github page that maintains the list of disposable domains
 */
const DISPOSABLE_EMAIL_LIST_URL: string =
  "https://disposable.github.io/disposable-email-domains/domains.json";

/**
 * Function that checks if the email is a disposable email.
 * @param email - Email to be tested
 * @returns Returns void for valid emails and throws HTTPError for invalid email
 */
export async function checkAndThrowDisposableEmail(email: string) {
  logger.info("Disposable Email validation");
  const res = await fetch(DISPOSABLE_EMAIL_LIST_URL);

  if (!res.ok) {
    return;
  }
  const data = (await res.json()) as string[];

  const isDisposable = data.includes(email.split("@")[1]);
  if (isDisposable) {
    logger.warn(`Disposable email: ${email}. REJECTING!`);
    throw new createHttpError.NotAcceptable(
      "Disposable email address not allowed"
    );
  }
}
