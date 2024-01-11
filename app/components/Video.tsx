"use client";

import { CurationType } from "@/lib/constants";
import { PhotoIcon, VideoCameraIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { IResponseVideo } from "../dashboard/my-videos/page";
import TweetcastLoader from "./TweetcastLoader";

export interface IMedia extends IResponseVideo {}
interface IVideoData {
  video: IMedia;
  playHandler: Function;
}

export default function Video({ video, playHandler }: IVideoData) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLandingCurated, setIsLandingCurated] = useState<boolean>(
    video.landingCurated
  );
  const [isAuthCurated, setIsAuthCurated] = useState<boolean>(
    video.authCurated
  );

  const shortenedTitle =
    video.title.slice(0, 80) + (video.title.length > 80 ? "..." : "");

  const handleLoadStart = useCallback(() => {
    setLoading(true);
  }, []);

  const handleLoadedData = useCallback(() => {
    setLoading(false);
  }, []);

  const playVideo = useCallback(() => {
    playHandler(video);
  }, [playHandler, video]);

  const typeElement = video.mimeType.includes("video") ? (
    <VideoCameraIcon width={20} height={20} />
  ) : (
    <PhotoIcon width={20} height={20} />
  );

  const curateVideo = async (id: string, type: string) => {
    let newVal = false;
    const oldIsLandingCurated = isLandingCurated;
    const oldIsAuthCurated = isAuthCurated;

    if (type === CurationType.Landing) {
      newVal = !isLandingCurated;
      setIsLandingCurated(newVal);
    }
    if (type === CurationType.Auth) {
      newVal = !isAuthCurated;
      setIsAuthCurated(newVal);
    }
    const response = await fetch(`/api/videos/${id}/curate`, {
      method: "POST",
      body: JSON.stringify({ curated: newVal, type }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setIsLandingCurated(oldIsLandingCurated);
      setIsAuthCurated(oldIsAuthCurated);
      return;
    }

    const data = await response.json();
    setIsLandingCurated(data.video.landingCurated);
    setIsAuthCurated(data.video.authCurated);
  };

  return (
    <>
      <div className="mob-max:w-full w-96 flex flex-col flex-none">
        <div className="p-4 w-full h-auto border border-tc-card-border rounded-2xl">
          {session?.user?.isTopG && (
            <div
              className={`flex items-center mb-4 rounded-lg gap-4 p-2 ${
                isAuthCurated || isLandingCurated
                  ? "bg-tc-primary-alt bg-opacity-20"
                  : "bg-tc-primary bg-opacity-5"
              }`}
            >
              <h1 className="font-semibold">Curate Content</h1>
              <div className="ml-auto flex gap-2 place-items-center">
                <label>Landing</label>
                <input
                  type="checkbox"
                  onChange={() => curateVideo(video.id, CurationType.Landing)}
                  className="mt-1 text-sm rounded-md w-5 h-5 border-tc-card-border cursor-pointer focus:ring-transparent"
                  checked={isLandingCurated}
                />
              </div>
              <div className="flex gap-2 place-items-center">
                <label>Auth</label>

                <input
                  type="checkbox"
                  onChange={() => curateVideo(video.id, CurationType.Auth)}
                  className="mt-1 text-sm rounded-md w-5 h-5 border-tc-card-border cursor-pointer focus:ring-transparent"
                  checked={isAuthCurated}
                />
              </div>
            </div>
          )}
          <div className="flex justify-between h-20">
            <div className="mr-1">
              <p className="text-[#99A1A8] text-xs mt-1 tracking-wide">
                {moment(video.createdAt).format("Do MMM, YYYY HH:MM")}
              </p>
              <h1 className="text-18 font-semibold">{shortenedTitle}</h1>
            </div>
            <div className="flex flex-col">
              <p className="float-right text-tc-sm font-normal rounded-lg px-2 py-2 text-[#8795AA] bg-[#EAF0F0]">
                {typeElement}
              </p>
            </div>
          </div>

          <div
            className="mt-4 w-full h-80 flex justify-center bg-tc-gray rounded-2xl hover:cursor-pointer"
            onClick={playVideo}
          >
            {/* <Image
            src={url}
            width={75}
            height={66}
            alt="Video Thumbnail"
            priority
          /> */}
            {loading && <TweetcastLoader />}
            {video.mimeType.includes("video") && (
              <LazyLoadComponent>
                <video
                  className={`h-full w-full mx-auto object-cover rounded-2xl ${
                    loading ? "hidden" : "visible"
                  }`}
                  src={video.url}
                  muted
                  onLoadStart={handleLoadStart}
                  onLoadedData={handleLoadedData}
                ></video>
              </LazyLoadComponent>
            )}
            {video.mimeType.includes("image") && (
              <LazyLoadComponent>
                <picture className="w-full">
                  <img
                    className={`h-full w-full mx-auto object-cover rounded-2xl ${
                      loading ? "hidden" : "visible"
                    }`}
                    src={video.url}
                    alt=""
                  />
                </picture>
              </LazyLoadComponent>
            )}
          </div>

          <div className="flex mt-4 items-center justify-between ">
            <Link
              href={video.tweetLink}
              target="_blank"
              className="text-tc-primary-alt w-auto flex gap-x-2 text-tc-base font-medium"
            >
              <Image
                style={{ color: "red" }}
                src="/BlueTweet.svg"
                width={20}
                height={20}
                alt="Download"
              />
              View Tweet
            </Link>
            <Link
              href={video.url}
              className="flex text-tc-base gap-x-3 font-bold py-4 px-10 mob-max:px-4 rounded-lg border border-[#C4D1D6]"
            >
              <Image
                src="/Download.svg"
                width={20}
                height={20}
                alt="Download"
              />
              Download
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
