"use client";
import { ITweetData } from "@/app/interfaces/interfaces";
import Image from "next/image";
import { DateTimeSeparator } from "../components/Icons";

export default function TweetCanvas({ tweetData }: { tweetData: ITweetData }) {
  return (
    <div
      className="opacity-100 h-full grid grid-row-4"
      style={{
        fontSize: `16px`,
        color: `#000000`,
        padding: `5px`,
      }}
    >
      <div className="flex w-full place-items-center">
        <Image
          className="rounded-full"
          src={tweetData.profileImageUrl}
          width={25}
          height={25}
          alt="Twitter PP"
          priority
        />
        <div className="ml-2 flex flex-col">
          <div className="flex align-middle">
            <h1 className="text-tc-xs font-semibold">{tweetData.name}</h1>
            {tweetData.verified && (
              <Image
                className="ml-1"
                src="/Verified.svg"
                width={10}
                height={0}
                alt="Verified"
              ></Image>
            )}
          </div>
          <h2 className="text-tc-xs">@{tweetData.username}</h2>
        </div>
        <Image
          className="ml-auto"
          src="/BlueTweet.svg"
          width={25}
          height={25}
          alt="Twitter PP"
          priority
        />
      </div>
      <div className="mt-4 text-[13px] leading-5">
        <h1>{tweetData.tweetText}</h1>
      </div>

      <div
        className="flex items-center text-tc-xs font-light mt-3"
        style={{
          color: `#000000`,
        }}
      >
        <span>{tweetData.createdAtTime}</span>
        <DateTimeSeparator className="mx-1" fill="#000000" />
        <span>{tweetData.createdAtDate}</span>
      </div>

      {/* <div className="grid grid-cols-4 mt-4 text-tc-xs font-extralight">
        <div className="flex">
          <TweetComment className="my-auto" fill={"#000000"} />
        </div>
        <div className="flex">
          <TweetRetweet className="my-auto" fill={"#000000"} />
        </div>
        <div className="flex">
          <TweetLike className="my-auto" fill={"#000000"} />
        </div>
        <div className="flex">
          <TweetViews className="my-auto" fill={"#000000"} />
        </div>
      </div> */}
    </div>
  );
}
