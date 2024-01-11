"use client";
import TweetCanvas from "@/app/dashboard/create/TweetCanvas";
import { ITweetData } from "@/app/interfaces/interfaces";
import { parseTweet } from "@/lib/utils";
import { Transition } from "@headlessui/react";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import TweetLoader from "../TweetLoader";
import { GradientBorderTL, Star } from "./ComplexBorder";

const defaultTweetData: ITweetData = {
  name: "",
  username: "",
  profileImageUrl: "",
  verified: false,
  createdAtDate: "",
  createdAtTime: "",
  tweetText: "",
  replyCount: undefined,
  retweetCount: undefined,
  likeCount: undefined,
  impressionCount: undefined,
};

const COOKIE_KEY = "tc-limit";

const PLATFORMS = [
  {
    platform: "Twitter",
    output: "videos",
    color: "text-blue-500",
  },
  // {
  //   platform: "Linkedin",
  //   output: "videos",
  //   color: "text-blue-500",
  // },
  // {
  //   platform: "Reddit",
  //   output: "videos",
  //   color: "text-red-500",
  // },
  // {
  //   platform: "YouTube",
  //   output: "tweet",
  //   color: "text-red-500",
  // },
];

export default function Section1() {
  const router = useRouter();
  const [loadingTweet, setLoadingTweet] = useState<boolean>(false);
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const [tweetData, setTweetData] = useState<ITweetData>(defaultTweetData);

  const [limitReached, setLimitReached] = useState<boolean>(false);

  useEffect(() => {
    if (getCookie(COOKIE_KEY) === true) {
      setLimitReached(true);
    } else {
      setLimitReached(false);
    }
  }, []);

  const fetchTweetHandler = useCallback(async () => {
    if (limitReached) {
      router.replace("/auth/signup");
    }
    if (tweetUrl.length === 0) {
      setTweetData(defaultTweetData);
      return;
    }
    setLoadingTweet(true);
    const response = await fetch("/api/tweets/public-fetch-tweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweetUrl: tweetUrl }),
    });
    setLoadingTweet(false);

    if (!response.ok) {
      if (response.status === 429) {
        setLimitReached(true);
      } else {
        setLimitReached(false);

        const error = await response.json();
        enqueueSnackbar(error.error.message, { variant: "error" });
      }
      return;
    }

    const data = await response.json();
    setTweetData(parseTweet(data));
    setLimitReached(true);
    setCookie(COOKIE_KEY, true);
  }, [tweetUrl, limitReached, router]);

  const [platformIndex, setPlatformIndex] = useState<number>(0);
  useEffect(() => {
    const platformCycler = setInterval(() => {
      setPlatformIndex((prev) => {
        if (prev === PLATFORMS.length - 1) {
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 3000);

    return () => {
      clearInterval(platformCycler);
    };
  }, []);

  return (
    <div className="flex mob-max:flex-col mt-[150px] mob-max:mt-8 justify-around">
      <div className="ml-auto mr-8 mob-max:mr-0 w-[500px] mob-max:w-full flex flex-col">
        <div>
          <span className="block text-tc-landing-h1 mob-max:text-tc-landing-h1-mob font-bold align-bottom">
            Turn your&nbsp;
          </span>
          <span
            className={`text-tc-landing-h1 mob-max:text-tc-landing-h1-mob font-bold align-bottom ${PLATFORMS[platformIndex].color}`}
          >
            {PLATFORMS[platformIndex].platform}&nbsp;
          </span>
          <span className="text-tc-landing-h1 mob-max:text-tc-landing-h1-mob font-bold inline-block">
            content&nbsp;
          </span>
          <span className="align-bottom text-tc-landing-h1 mob-max:text-tc-landing-h1-mob font-bold">
            into{" "}
            <span className="text-[#999999]">
              {PLATFORMS[platformIndex].output}
            </span>
          </span>
        </div>
        <div className="mt-3 text-tc-18 mob-max:text-tc-18-26 font-normal">
          <p>
            All you have to do is paste the link of your tweet, add a background
            of choice, and boom, you&apos;ll have a video!
          </p>
        </div>
        <div className="relative">
          <Transition
            show={!limitReached}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className={`absolute top-0 mob-max:top-[450px] mr-16 mob-max:mr-0 w-full transition-all duration-[1500ms]`}
            >
              <label
                htmlFor="email"
                className="block text-tc-primary mt-10 mb-2 text-tc-18 font-medium"
              >
                Tweet link
              </label>
              <input
                // className={`form-input h-12 w-full rounded-lg appearance-none px-2 text-tc-primary leading-normal border-none focus:border-none focus:outline-none focus:shadow-outline ${
                className="form-input bg-tc-input h-12 w-4/5 mob-max:w-full rounded-lg appearance-none px-4 text-tc-primary leading-normal border-none focus:ring-tc-primary"
                placeholder="https://twitter.com/..."
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
              />
            </div>
          </Transition>
          <Transition
            show={true}
            enter="transform transition-transform duration-[1000ms] ease-out"
          >
            <button
              onClick={fetchTweetHandler}
              className={`glow-primary-hover absolute bg-tc-primary transition-all duration-[1000ms] text-center text-tc-16 font-bold py-4 px-14 rounded-lg text-white w-60 mob-max:w-full ${
                limitReached
                  ? "top-0 mob-max:top-[450px] mt-[42px]"
                  : "top-32 mob-max:top-[578px] mt-1"
              }`}
            >
              {limitReached ? "Get Started" : "Make magic"}
            </button>
          </Transition>
        </div>
      </div>
      <div className="mr-auto w-[500px] mob-max:w-full mob-max:mt-12 h-[500px] mob-max:h-[400px] justify-self-center relative">
        <GradientBorderTL className="absolute top-0 left-0 mob-max:-top-[5px] mob-max:left-[5px]" />
        <Star className="absolute top-14 -left-[9px] mob-max:left-0" />
        <Star className="absolute bottom-40 mob-max:top-64 -right-[9px] mob-max:right-0" />

        <div className="h-full w-full p-4 bg-white rounded-[32px] p-">
          <div className="h-full w-full rounded-[32px] relative overflow-hidden">
            <div className="absolute branding-gradient w-full h-full top-0 left-0"></div>
            <picture>
              <img
                className="absolute top-10 left-1/2 -translate-x-1/2 z-20 w-[300px] mob-max:w-[200px]"
                src="https://tweetcast-assets.s3.eu-west-2.amazonaws.com/images/IPhone13Frame.png"
                alt="Iphone13Frame"
              />
            </picture>
            <picture>
              <img
                className="absolute w-[290px] mob-max:w-[190px] left-1/2 -translate-x-1/2 top-10 transition-all duration-100 mx-auto z-10 h-[100%] rounded-[40px] mob-max:rounded-[30px] mt-1 object-cover"
                src="https://media.tenor.com/W_KVTsw4rSEAAAAC/cat-typing.webp"
                alt="Preview"
              />
            </picture>

            {loadingTweet && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-30">
                <TweetLoader />
              </div>
            )}
            {!tweetData.username && !loadingTweet && (
              <Image
                className="absolute w-[250px] mob-max:w-[150px] top-1/2 left-1/2 -translate-x-1/2 z-30"
                src="/Landing/SampleTweet.png"
                width={270}
                height={0}
                alt="Preview"
                priority
              />
            )}

            {tweetData.username && !loadingTweet && (
              <div className="absolute p-2 top-1/2 -translate-y-1/3 left-1/2 -translate-x-1/2 z-30 bg-white w-[250px] mob-max:w-[250px] rounded-lg place-self-center">
                <TweetCanvas tweetData={tweetData} />
              </div>
            )}
          </div>
        </div>
        <GradientBorderTL className="absolute bottom-0 right-0 rotate-180 mob-max:-bottom-[5px] mob-max:right-[5px]" />
      </div>
    </div>
  );
}
