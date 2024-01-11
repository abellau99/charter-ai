import { Transition } from "@headlessui/react";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import Spinner from "./Spinner";
import { IMedia } from "./Video";

interface IPlayVideo {
  media: IMedia | undefined;
  resetUrlHandler: () => void;
}

export default function VideoPlayer({ media, resetUrlHandler }: IPlayVideo) {
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const handleLoadStart = useCallback(() => {
    setVideoLoading(true);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setVideoLoading(false);
  }, []);

  return (
    <>
      <Transition appear show={!!media} as={Fragment}>
        <div className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              onClick={resetUrlHandler}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            />
          </Transition.Child>

          <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center mob-max:top-[50%] mob-max:-translate-y-[50%] inset-0 mx-auto">
            <div className="flex items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0 scale-75"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-75"
                // as={Fragment}
                // enter="transition ease-out duration-300 transform"
                // enterFrom="translate-y-full opacity-0"
                // enterTo="translate-y-0 opacity-100"
                // leave="transition ease-in duration-300 transform"
                // leaveFrom="translate-y-0"
                // leaveTo="translate-y-full"
              >
                <div className="relative w-[350px] h-[622px] mob-max:w-[300px] mob-max:h-[500px] transform rounded-2xl bg-transparent transition-all">
                  <div className="aspect-9/16 overflow-hidden">
                    {videoLoading && (
                      <div className="bg-white mx-auto z-10 h-[100%] w-[390px] rounded-phone mt-1 object-cover">
                        <Spinner />
                      </div>
                    )}
                    {media?.mimeType?.includes("video") && (
                      <video
                        className={`absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] transition-all duration-100 mx-auto z-10 h-[100%] w-[390px] mob-max:w-[300px] rounded-phone mt-1 object-cover ${
                          videoLoading ? "opacity-0" : "opacity-100"
                        }`}
                        src={media.url}
                        muted
                        autoPlay
                        loop
                        onLoadStart={handleLoadStart}
                        onLoadedData={handleLoadComplete}
                      ></video>
                    )}

                    {media?.mimeType?.includes("image") && (
                      <picture>
                        <img
                          className={`absolute left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%] transition-all duration-100 mx-auto z-10 h-[100%] w-[390px] mob-max:w-[300px] rounded-phone mt-1 object-cover ${
                            videoLoading ? "opacity-0" : "opacity-100"
                          }`}
                          src={media?.url}
                          alt=""
                        />
                      </picture>
                    )}
                    <div className="absolute top-4 -right-12">
                      <button
                        onClick={resetUrlHandler}
                        className="block bg-red-600 text-white rounded-full p-2"
                      >
                        <XMarkIcon width={24} height={24} />
                      </button>
                      <Link
                        href={media?.url || ""}
                        className="mt-2 block bg-white rounded-full p-2"
                      >
                        <ArrowDownTrayIcon width={24} height={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
