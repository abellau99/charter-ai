import { ITweetData, ITweetDataV2 } from "@/app/interfaces/interfaces";
import createHttpError from "http-errors";
import { Client } from "twitter-api-sdk";

const twitterClient: Client = new Client(process.env.TWITTER_BEARER_TOKEN!);

interface PublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  impression_count?: number | undefined;
}

export async function fetchTweet(url: string) {
  console.log("--------------------- TRIGGER");
  const tweetId: string = url.split("/").slice(-1).toString();
  const tweet = await twitterClient.tweets.findTweetById(tweetId, {
    expansions: ["author_id"],
    "user.fields": ["username", "name", "profile_image_url", "verified"],
    "tweet.fields": ["created_at", "public_metrics"],
  });
  console.log(tweet);
  const { data, includes } = tweet;
  const userContext = includes!.users![0];

  const date = new Date(data!.created_at!);

  const dateString = date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const publicMetrics = data!.public_metrics as PublicMetrics;

  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  let sanitizedTweetText = data!.text.replace(urlRegex, "");

  return {
    name: userContext.name,
    username: userContext.username,
    profileImageUrl: userContext.profile_image_url?.replace("_normal", ""),
    verified: userContext.verified,
    createdAtDate: dateString,
    createdAtTime: timeString,
    tweetText: sanitizedTweetText,
    replyCount: humanizeNumbers(publicMetrics!.reply_count),
    retweetCount: humanizeNumbers(publicMetrics!.retweet_count),
    likeCount: humanizeNumbers(publicMetrics!.like_count),
    impressionCount: humanizeNumbers(publicMetrics!.impression_count!),
  } as ITweetData;
}

export async function fetchTweetV2(url: string) {
  console.log("--------------------- TRIGGER V2");
  // const tweetId: string = url.split("/").slice(-1).toString();
  const idRegex = /\/(\d+)/;
  // const tweetId: string = url.split("/").slice(-1).toString();
  const match = url.match(idRegex);
  if (!match) {
    throw new createHttpError.BadRequest("Invalid tweet URL");
  }
  const tweetId: string = match[1];

  const tweetResponse: ITweetDataV2 = (await getTweet(tweetId)) as ITweetDataV2;
  console.log({ tweetResponse });

  const userContext = tweetResponse.user!;

  const date = new Date(tweetResponse!.created_at!);

  const dateString = date.toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const timeString = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });

  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
  let sanitizedTweetText = tweetResponse!.text.replace(urlRegex, "");

  return {
    name: userContext.name,
    username: userContext.screen_name,
    profileImageUrl: userContext.profile_image_url_https?.replace(
      "_normal",
      ""
    ),
    verified: userContext.verified,
    isBlueVerified: userContext.is_blue_verified,
    createdAtDate: dateString,
    createdAtTime: timeString,
    tweetText: sanitizedTweetText,
    // replyCount: humanizeNumbers(publicMetrics!.reply_count),
    // retweetCount: humanizeNumbers(publicMetrics!.retweet_count),
    // likeCount: humanizeNumbers(publicMetrics!.like_count),
    // impressionCount: humanizeNumbers(publicMetrics!.impression_count!),
  } as ITweetData;
}

async function getTweet(tweetId: string) {
  const url: string = `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}`;
  const response = await fetch(url);
  const jsonResponse = await response.json();

  return jsonResponse;
}

function humanizeNumbers(num: number) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else if (num === 0) {
    return "";
  } else {
    return num.toFixed(0);
  }
}
