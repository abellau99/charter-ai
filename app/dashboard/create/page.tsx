"use client";
import ButtonComponent from "@/app/components/ButtonComponent";
import { StyledThemeDiv } from "@/app/components/StyledComponents";
import TweetLoader from "@/app/components/TweetLoader";
import { IMedia } from "@/app/components/Video";
import VideoPlayer from "@/app/components/VideoPlayer";
import { ITweetData } from "@/app/interfaces/interfaces";
import useVisible from "@/hooks/use-visible";
import {
  BackgroundType,
  BUTTON,
  PusherEvents,
  STATUS,
  VIDEO_FORM,
} from "@/lib/constants";
import { parseTweet } from "@/lib/utils";
import { pusherChannel } from "@/services/pusher-client";
import { Switch, Transition } from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames";
import html2canvas from "html2canvas";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import * as yup from "yup";
import Checkbox from "../components/Checkbox";
import {
  DateTimeSeparator,
  TweetComment,
  TweetLike,
  TweetRetweet,
  TweetViews,
  UploadIcon,
} from "../components/Icons";
import Radio from "../components/Radio";
import Slider from "../components/Sliders";
import VideoInput from "../components/VideoInput";
import { IResponseVideo } from "../my-videos/page";
import CastingModal from "./CastingModal";
import StockAsset from "./StockAssets";
import UpgradeModal from "./UpgradeModal";

const DEFAULT_BG_URL = "/ContentDefaultBG.png";

const videoSchema = yup.object().shape({
  tweetLink: yup.string().url().required().label(VIDEO_FORM.TWEET_LINK),
  backgroundFootage: yup.mixed().label(VIDEO_FORM.BACKGROUND_FOOTAGE_URL),
  backgroundURL: yup.string().label(VIDEO_FORM.BACKGROUND_FOOTAGE_URL),
  overlayColor: yup.string().required().label(VIDEO_FORM.OVERLAY_COLOR),
  overlayOpacity: yup.number().label(VIDEO_FORM.OVERLAY_OPACITY),
  colorTheme: yup.string().required().label(VIDEO_FORM.COLOR_THEME),
  opacity: yup.string().required().label(VIDEO_FORM.OPACITY),
  textColor: yup.string().required().label(VIDEO_FORM.TEXT_COLOR),
  usernameColor: yup.string().required().label(VIDEO_FORM.TEXT_COLOR),
  showVerifiedIcon: yup
    .boolean()
    .required()
    .label(VIDEO_FORM.SHOW_VERIFIED_ICON),
  showHeader: yup.boolean().required().label(VIDEO_FORM.SHOW_DATE),
  showDate: yup.boolean().required().label(VIDEO_FORM.SHOW_DATE),
  showEngagement: yup.boolean().required().label(VIDEO_FORM.SHOW_ENGAGEMENT),
  showTwitterLogo: yup.boolean().required().label(VIDEO_FORM.SHOW_TWITTER_LOGO),
  textSize: yup.number().required().label(VIDEO_FORM.TEXT_SIZE),
  presignedKey: yup.string(),
});
interface ICreateVideoProps {
  tweetLink: string;
  backgroundFootage: File | null;
  backgroundURL: string;
  overlayColor: string;
  overlayOpacity: number;
  colorTheme: string;
  opacity: string;
  textColor: string;
  usernameColor: string;
  tweetBGColor: string;
  showVerifiedIcon: boolean;
  showDate: boolean;
  showHeader: boolean;
  showEngagement: boolean;
  showTwitterLogo: boolean;
  textSize: number;
  presignedKey: string;
}

const palletClasses: string =
  // "transform focus:scale-110 transition-transform w-8 h-8 border rounded-lg focus:ring-2 focus:ring-tc-pallet-focused focus:shadow-lg";
  "transform focus:scale-110 transition-transform w-8 h-8 border rounded-lg";

// https://www.freecodecamp.org/news/how-to-style-your-react-apps-with-less-code-using-tailwind-css-and-styled-components/

// const VideoSubLabel = styled.h2.attrs((props) => ({
//   style: {
//     background: "transparent",
//   },
// }))``;

const VideoSubLabel = styled.h2.attrs({
  className: `block text-tc-primary mt-6 mb-2 text-tc-base font-medium`,
})``;

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

const DEFAULT_TEXT_COLOR = "FFFFFF";
const DEFAULT_USERNAME_COLOR = "BBBBBB";
const DEFAULT_THEME = "dark";
const DEFAULT_TEXT_SIZE = 12;
const DEFAULT_OVERLAY_OPACITY = 10;

export default function AddVideo() {
  const { data: session } = useSession();
  const [pickerColor, setPickerColor] = useColor(
    "hex",
    `#${DEFAULT_TEXT_COLOR}`
  );
  const [pickerUsernameColor, setUsernamePickerColor] = useColor(
    "hex",
    `#${DEFAULT_USERNAME_COLOR}`
  );
  const [pickerTweetBGColor, setTweetBGPickerColor] = useColor(
    "hex",
    `#000000`
  );
  const [pickerOverlayColor, setPickerOverlayColor] = useColor(
    "hex",
    `#000000`
  );

  const {
    ref: textColorRef,
    isVisible: textColorIsVisible,
    setIsVisible: setTextColorIsVisible,
  } = useVisible(false);
  const {
    ref: usernameColorRef,
    isVisible: usernameColorIsVisible,
    setIsVisible: setUsernameColorIsVisible,
  } = useVisible(false);
  const {
    ref: tweetBGRef,
    isVisible: tweetBGVisible,
    setIsVisible: setTweetBGVisible,
  } = useVisible(false);
  const {
    ref: overlayColorRef,
    isVisible: overlayPickerVisible,
    setIsVisible: setOverlayPickerVisible,
  } = useVisible(false);
  // const [isPro] = useState<boolean | undefined>(
  //   session?.user?.subscription?.isPro
  // );
  const tweetOverlayRef = useRef<HTMLDivElement>(null);
  const bgOverlayRef = useRef<HTMLDivElement>(null);
  const videoElemRef = useRef<HTMLVideoElement>(null);

  const watermarkOverlayRef = useRef<HTMLImageElement>(null);
  const [expandBottomDrawer, setExpandBottomDrawer] = useState<boolean>(false);
  const [tab, setTab] = useState<number>(0);
  const [casting, setCasting] = useState<boolean>(false);
  const [openUpgradeModal, setOpenUpgradeModal] = useState<boolean>(false);
  const [showMedia, setShowMedia] = useState<IMedia | undefined>(undefined);
  const [showStockFootage, setShowStockFootage] = useState<boolean>(true);
  const [bgType, setBgType] = useState<string>(BackgroundType.Image);

  const [presignedUrl, setPresignedUrl] = useState<string>("");
  const [tweetPresignedUrl, setTweetPresignedUrl] = useState<string>("");
  const [overlayPresignedUrl, setOverlayPresignedUrl] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // const isPro = useCallback(() => {
  //   return session?.user?.subscription?.isPro;
  //   // return false;
  // }, [session?.user?.subscription.isPro]);
  const isPro = useCallback(() => {
    return session?.user?.subscription?.isPro;
    // return false;
  }, [session?.user?.subscription.isPro]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    clearErrors,
    reset,
    trigger,
    formState: { errors },
  } = useForm<ICreateVideoProps>({
    mode: "all",
    resolver: yupResolver(videoSchema),
    defaultValues: useMemo(
      () => ({
        tweetLink: "",
        backgroundFootage: null,
        backgroundURL: DEFAULT_BG_URL,
        overlayColor: "000000",
        overlayOpacity: DEFAULT_OVERLAY_OPACITY,
        colorTheme: DEFAULT_THEME,
        opacity: "1",
        textColor: DEFAULT_TEXT_COLOR,
        usernameColor: DEFAULT_USERNAME_COLOR,
        tweetBGColor: "000000",
        secondary: "FFFFFF",
        showVerifiedIcon: false,
        showDate: false,
        showHeader: true,
        showEngagement: false,
        showTwitterLogo: false,
        textSize: DEFAULT_TEXT_SIZE,
        presignedKey: "",
      }),
      [] // THIS MIGHT NEED CHANGING AFTER ISPRO!!!
    ),
  });

  // useEffect(() => {
  //   if (isPro()) {
  //     setValue("colorTheme", "dark");
  //     setValue("textColor", "FFFFFF");
  //     setValue("showVerifiedIcon", true);
  //     setValue("showDate", true);
  //     setValue("showEngagement", true);
  //     setValue("textSize", 12);
  //   }
  // }, [isPro, setValue]);

  const [loadingTweet, setLoadingTweet] = useState<boolean>(false);
  const [tweetData, setTweetData] = useState<ITweetData>(defaultTweetData);

  const watchTweetLink = watch("tweetLink");
  const watchColorTheme = watch("colorTheme");
  const watchOpacity = watch("opacity");
  const watchBackgroundFootage = watch("backgroundFootage");
  const watchOverlayColor = watch("overlayColor");
  const watchOverlayOpacity = watch("overlayOpacity");
  const watchBackgroundURL = watch("backgroundURL");
  const watchTextColor = watch("textColor");
  const watchUsernameColor = watch("usernameColor");
  const watchTweetBGColor = watch("tweetBGColor");
  const watchTextSize = watch("textSize");
  const watchShowVerifiedIcon = watch("showVerifiedIcon");
  const watchShowDate = watch("showDate");
  const watchShowHeader = watch("showHeader");
  const watchShowEngagement = watch("showEngagement");
  const watchShowTwitterLogo = watch("showTwitterLogo");
  const watchPresignedKey = watch("presignedKey");

  const [dynamicBottom, setDynamicBottom] = useState<number>(0);

  const resetCommons = useCallback(() => {
    setValue("backgroundURL", DEFAULT_BG_URL);
    setPresignedUrl("");
    setTweetPresignedUrl("");
    setOverlayPresignedUrl("");
    setValue("presignedKey", "");
    setBgType(BackgroundType.Image);
    setStatus(null);
  }, [setValue]);

  const resetForm = useCallback(() => {
    resetCommons();
    reset();
    setTweetData(defaultTweetData);
  }, [reset, setTweetData, resetCommons]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDynamicBottom(window.innerHeight - 100);
    }
  }, [expandBottomDrawer]);

  useEffect(() => {
    console.log(session?.user?.id);
    if (session?.user) {
      let channel = pusherChannel(session?.user?.id);
      console.log(channel);
      // channel.unbind_all();
      channel.bind(
        PusherEvents.ContentCreated,
        function (video: IResponseVideo) {
          console.log(video);
          setCasting(false);
          setShowStockFootage(true);

          resetForm();
          setShowMedia(video);

          enqueueSnackbar("Your Content is ready!", {
            variant: "success",
          });
        }
      );

      channel.bind(
        PusherEvents.ContentCreationFailed,
        function (message: string) {
          console.log(message);
          setCasting(false);
          resetForm();

          enqueueSnackbar(message, {
            variant: "error",
          });
        }
      );
    }
  }, [session?.user, enqueueSnackbar, resetForm]);

  const onTweetEnterHandler = useCallback(async () => {
    if (!(await trigger("tweetLink"))) {
      return;
    }
    setLoadingTweet(true);
    const response = await fetch("/api/tweets/fetchTweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweetUrl: watchTweetLink }),
    });
    setLoadingTweet(false);

    if (!response.ok) {
      const error = await response.json();
      enqueueSnackbar(error.error.message, {
        variant: "error",
      });
      return;
    }

    const { tweetData, tweetPresignedUrl, overlayPresignedUrl } =
      await response.json();

    setTweetData(parseTweet(tweetData));
    setValue("showVerifiedIcon", tweetData.verified);

    setTweetPresignedUrl(tweetPresignedUrl);
    setOverlayPresignedUrl(overlayPresignedUrl);
    // setTweetData(data as ITweetData);
  }, [watchTweetLink, trigger, setValue, enqueueSnackbar]);

  const debouncedOnTweetEnterHandler = useMemo(() => {
    return debounce(onTweetEnterHandler, 500);
  }, [onTweetEnterHandler]);

  useEffect(() => {
    debouncedOnTweetEnterHandler();
  }, [watchTweetLink, debouncedOnTweetEnterHandler]);

  useEffect(() => {
    return () => {
      debouncedOnTweetEnterHandler.cancel();
    };
  });

  const onUpgradeCloseHandler = useCallback(() => {
    setOpenUpgradeModal(false);
  }, []);

  const onUpgradeClickHandler = useCallback(() => {
    setOpenUpgradeModal(false);
    router.push("/dashboard/subscription");
  }, [router]);

  const uploadToS3 = useCallback(
    async (signedUrl: string, file: any) => {
      if (file) {
        const response = await fetch(signedUrl, {
          method: "PUT",
          body: file,
        });

        if (!response.ok) {
          enqueueSnackbar("Upload failed!", {
            variant: "error",
          });
          return false;
        }

        return true;
        // setValue("backgroundURL", response.url);
      }
    },
    [enqueueSnackbar]
  );

  const canCreate = async () => {
    const res = await fetch("/api/videos/check-sub");
    return res.ok;
  };

  const onSubmit: SubmitHandler<ICreateVideoProps> = useCallback(
    async (data) => {
      if (!(await canCreate())) {
        setStatus(null);
        setCasting(false);
        setOpenUpgradeModal(true);

        return;
      }
      let step = 1;
      let totalSteps = 3;

      setCasting(true);
      const isDirectUpload =
        presignedUrl.length > 0 && watchPresignedKey.length > 0;

      if (watchBackgroundFootage && isDirectUpload) {
        totalSteps = 4;
        setStatus(
          prepStatus(step, totalSteps, `${STATUS.UPLOADING} your background`)
        );

        if (!(await uploadToS3(presignedUrl, watchBackgroundFootage))) {
          setCasting(false);
          return;
        }
        step += 1;
      }

      const tweetElement = document.getElementById("rendered-tweet-box");
      const bgOverlayElement = document.getElementById("bg-overlay");
      if (!tweetElement || !bgOverlayElement) {
        return;
      }

      setStatus(prepStatus(step, totalSteps, STATUS.PREPARING));
      step += 1;

      const overlayCanvas = await html2canvas(bgOverlayElement, {
        scale: 8,
        backgroundColor: "transparent",
        allowTaint: true,
      });

      overlayCanvas.toBlob(async (overlayBlob) => {
        html2canvas(tweetElement, {
          scale: 8,
          backgroundColor: "transparent",
          allowTaint: false,
          useCORS: true,
        }).then((canvas) => {
          canvas.toBlob(async (blob) => {
            setStatus(
              prepStatus(
                step,
                totalSteps,
                `${STATUS.UPLOADING} additional assets`
              )
            );
            step += 1;

            if (!(await uploadToS3(tweetPresignedUrl, blob))) {
              setCasting(false);
              return;
            }
            if (!(await uploadToS3(overlayPresignedUrl, overlayBlob))) {
              setCasting(false);
              return;
            }
            let formData = new FormData();

            const entries = Object.entries(data) as Array<
              [string, string | any]
            >;

            for (const [k, v] of entries) {
              if (k === "backgroundFootage") continue;
              formData.append(k, v);
            }

            if (isDirectUpload) {
              formData.delete("backgroundURL");
            }

            // formData.append("tweetImage", blob!, "tweet.png");
            // formData.append("bgOverlay", overlayBlob!, "bgOverlay.png");

            formData.append("title", tweetData.tweetText);
            formData.append(
              "offset",
              watermarkOverlayRef?.current?.style.top || ""
            );
            formData.append("type", bgType);
            formData.append("isDirectUpload", isDirectUpload.toString());

            const res = await fetch("/api/videos/create", {
              method: "POST",
              body: formData,
              headers: {
                enctype: "multipart/form-data",
              },
            });

            if (!res.ok) {
              setStatus(null);
              setCasting(false);
              // const errResponse = await res.json();
              if (res.status === 403) {
                setOpenUpgradeModal(true);
              } else {
                enqueueSnackbar("Something went wrong! Contact support", {
                  variant: "error",
                });
              }

              return;
            }

            setStatus(STATUS.PROCESSING);
            setStatus(prepStatus(step, totalSteps, STATUS.PROCESSING));

            const triggerData = await res.json();

            await fetch("/.netlify/functions/create-content-background", {
              method: "POST",
              body: JSON.stringify({
                fields: triggerData.fields,
                userId: triggerData.userId,
              }),
              headers: {
                "Content-type": "application/json",
              },
            });
          });
        });
      });
    },
    [
      watchBackgroundFootage,
      uploadToS3,
      presignedUrl,
      overlayPresignedUrl,
      tweetPresignedUrl,
      watchPresignedKey,
      enqueueSnackbar,
      tweetData.tweetText,
      bgType,
    ]
  );

  const fetchPresignedUrl = useCallback(
    async (file: any) => {
      const response = await fetch(
        "/api/videos/presigned-url?" +
          new URLSearchParams({
            fileName: file.name,
            type: file.type,
          })
      );
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setPresignedUrl(data.background.url);
      setValue("presignedKey", data.background.key);
    },
    [setValue]
  );

  const onDropHandler = useCallback(
    (event: any) => {
      const file = event?.target.files[0];

      if (!file) {
        resetCommons();
        return;
      }

      clearErrors("backgroundFootage");
      setValue("backgroundFootage", file);
      var url = URL.createObjectURL(file);
      setValue("backgroundURL", url);
      if (file.type.includes("video")) {
        setBgType(BackgroundType.Video);
      } else {
        setBgType(BackgroundType.Image);
      }
      fetchPresignedUrl(file);
    },
    [clearErrors, setValue, fetchPresignedUrl, resetCommons]
  );

  const resetUploadFileHandler = useCallback(() => {
    resetCommons();
    setValue("backgroundFootage", null);
  }, [setValue, resetCommons]);

  const tweetThemeClass = classNames({
    "bg-tc-primary": watchColorTheme === "dark",
    "bg-white": watchColorTheme === "light",
  });

  // const tweetOpacityClass = classNames({
  //   "bg-opacity-100": watchOpacity === "opaque",
  //   "bg-opacity-50": watchOpacity === "translucent",
  //   "bg-opacity-0": watchOpacity === "transparent",
  // });

  const switchTabHandler = useCallback((e: React.MouseEvent) => {
    setTab(parseInt(e.currentTarget.getAttribute("data-tab") || "0"));
  }, []);

  useEffect(() => {
    if (watchBackgroundFootage) {
      // console.log(watchBackgroundFootage);
      // const sizeMb = watchBackgroundFootage.size / 1024 / 1024;
      // if (sizeMb > 4) {
      //   enqueueSnackbar("File size is too large", {
      //     variant: "error",
      //   });
      //   setValue("backgroundFootage", null);
      //   trigger("backgroundFootage");
      //   return;
      // }
      setTimeout(() => {
        const video = videoElemRef.current;
        if (!video || video.readyState < 2) {
          return;
        }
        if (video.duration > 30.0) {
          enqueueSnackbar("Video file too long", {
            variant: "error",
          });
          setValue("backgroundFootage", null);
          resetCommons();
          trigger("backgroundFootage");
          return;
        }
      }, 1000);
    }
  }, [
    resetCommons,
    watchBackgroundFootage,
    enqueueSnackbar,
    setValue,
    trigger,
  ]);

  useEffect(() => {
    let color = "000000";
    let tweetColor = "FFFFFF";
    if (watchColorTheme === "dark") {
      color = "FFFFFF";
      tweetColor = "000000";
    }

    if (watchColorTheme === "light") {
      color = "000000";
      tweetColor = "FFFFFF";
    }
    setValue("textColor", color);
    setValue("usernameColor", color);
    setValue("tweetBGColor", tweetColor);
  }, [setValue, watchColorTheme]);

  useEffect(() => {
    setValue("textColor", pickerColor.hex.replace("#", ""));
  }, [pickerColor, setValue]);

  useEffect(() => {
    setValue("usernameColor", pickerUsernameColor.hex.replace("#", ""));
  }, [pickerUsernameColor, setValue]);

  useEffect(() => {
    setValue("tweetBGColor", pickerTweetBGColor.hex.replace("#", ""));
  }, [pickerTweetBGColor, setValue]);

  useEffect(() => {
    setValue("overlayColor", pickerOverlayColor.hex.replace("#", ""));
  }, [pickerOverlayColor, setValue]);

  useEffect(() => {
    if (watchBackgroundURL === DEFAULT_BG_URL) {
      setValue("overlayOpacity", 10);
    } else {
      setValue("overlayOpacity", 50);
    }
  }, [watchBackgroundURL, setValue]);

  useEffect(() => {
    const tweetOverlay = tweetOverlayRef.current;
    const watermarkOverlay = watermarkOverlayRef.current;

    const height = tweetOverlay?.offsetHeight ?? 0;
    const rect = tweetOverlay?.getBoundingClientRect();

    if (watermarkOverlay && rect) {
      watermarkOverlay.style.top = `${rect.bottom - 150}px`;
    }
  }, [tweetData, watchTextSize, watchShowDate, watchShowEngagement]);

  const footageSelectHandler = useCallback(
    (url: string, type: string) => {
      setValue("backgroundURL", url);
      setBgType(type);
      setValue("backgroundFootage", null);
    },
    [setValue]
  );

  return (
    <div className="flex h-full mob-max:flex-col">
      <div className="mob-max:w-full w-3/5 py-4 mob-max:py-1 mob-max:pt-4 flex justify-center place-items-center border-r shrink-0">
        <div className="relative w-[350px] h-[622px] mob-max:h-[600px] mob-max:w-[300px] overflow-hidden rounded-[24px]">
          {/* <div className="absolute branding-gradient top-0 left-0 h-full w-full -z-10"></div> */}
          {loadingTweet && (
            <div className="absolute top-2/4 -translate-x-2/4 left-2/4 -translate-y-2/4">
              {/* <Spinner /> */}
              <TweetLoader />
            </div>
          )}
          <div
            ref={bgOverlayRef}
            id="bg-overlay"
            style={{
              background: `#${watchOverlayColor}`,
              opacity: watchOverlayOpacity / 100,
            }}
            className="absolute top-0 left-0 w-full h-full"
          ></div>
          {!loadingTweet && tweetData.tweetText && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-30`}
            >
              <div
                ref={tweetOverlayRef}
                id="rendered-tweet-box"
                className={`relative transition ease-in-out duration-300 p-3 row-start-2 h-auto w-[250px] mob-max:w-[250px] rounded-lg place-self-center`}
              >
                <div
                  className={`absolute h-full w-full -z-10 top-0 left-0 rounded-lg ${tweetThemeClass}`}
                  style={{
                    backgroundColor: `#${watchTweetBGColor}`,
                    opacity: watchOpacity,
                  }}
                ></div>
                <div
                  className="opacity-100 h-full grid grid-row-4"
                  style={{
                    color: `#${watchTextColor}`,
                  }}
                >
                  {watchShowHeader && (
                    <div className="flex w-full place-items-center">
                      <picture>
                        <img
                          className="rounded-full"
                          src={tweetData.profileImageUrl}
                          alt="ProfilePicture"
                          width={30}
                          height={30}
                        />
                      </picture>
                      <div className="ml-2 flex flex-col">
                        <div className="flex align-middle">
                          <h1 className="text-tc-xs font-semibold">
                            {tweetData.name}
                          </h1>
                          {watchShowVerifiedIcon && (
                            <Image
                              className="ml-1"
                              src="/Verified.svg"
                              width={10}
                              height={0}
                              alt="Verified"
                            ></Image>
                          )}
                        </div>
                        <h2
                          className="text-tc-xs"
                          style={{
                            color: `#${watchUsernameColor}`,
                          }}
                        >
                          @{tweetData.username}
                        </h2>
                      </div>
                      {watchShowTwitterLogo && (
                        <Image
                          className="ml-auto"
                          src="/BlueTweet.svg"
                          width={25}
                          height={25}
                          alt="Twitter PP"
                          priority
                        />
                      )}
                    </div>
                  )}
                  <div
                    className={`text-tc-sm leading-5 ${
                      watchShowHeader ? "mt-4" : ""
                    }`}
                  >
                    <h1
                      className="whitespace-pre-line"
                      style={{
                        fontSize: `${watchTextSize}px`,
                      }}
                    >
                      {tweetData.tweetText}
                    </h1>
                  </div>

                  {watchShowDate && (
                    <div
                      className="flex items-center text-tc-xs font-light mt-3"
                      style={{
                        color: `#${watchTextColor}`,
                      }}
                    >
                      <span>{tweetData.createdAtTime}</span>
                      <DateTimeSeparator
                        className="mx-1"
                        fill={watchTextColor}
                      />
                      <span>{tweetData.createdAtDate}</span>
                    </div>
                  )}

                  {watchShowEngagement && (
                    <div className="grid grid-cols-4 mt-4 text-tc-xs font-extralight">
                      <div className="flex">
                        <TweetComment
                          className="my-auto"
                          fill={`#${watchTextColor}`}
                        />
                        <p>{tweetData.replyCount}</p>
                      </div>
                      <div className="flex">
                        <TweetRetweet
                          className="my-auto"
                          fill={`#${watchTextColor}`}
                        />
                        <p>{tweetData.retweetCount}</p>
                      </div>
                      <div className="flex">
                        <TweetLike
                          className="my-auto"
                          fill={`#${watchTextColor}`}
                        />
                        <p>{tweetData.likeCount}</p>
                      </div>
                      <div className="flex">
                        <TweetViews
                          className="my-auto"
                          fill={`#${watchTextColor}`}
                        />
                        <p>{tweetData.impressionCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="aspect-9/16 overflow-hidden">
            {bgType === BackgroundType.Video && (
              <video
                ref={videoElemRef}
                className="w-full h-full object-cover"
                src={watchBackgroundURL}
                autoPlay
                loop
              ></video>
            )}

            {(watchBackgroundFootage === null ||
              bgType === BackgroundType.Image) && (
              <picture>
                <img
                  className="w-full h-full object-cover"
                  src={watchBackgroundURL}
                  alt=""
                />
              </picture>
            )}
            {!isPro() && tweetData.tweetText && (
              <picture>
                <img
                  ref={watermarkOverlayRef}
                  className="absolute left-[50%] -translate-x-[50%] z-20 w-[150px] h-auto mob-max:w-[125px] opacity-50"
                  src="/ContentformWatermark.png"
                  alt="ContentForm Watermark"
                />
              </picture>
            )}
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        show={true}
        enter="transform transition duration-[400ms]"
        enterFrom={`mob-max:bottom-[270px]`}
        enterTo={`mob-max:bottom-[${dynamicBottom}px]`}
        leave="transform transition duration-[400ms] east-in-out"
        leaveFrom={`mob-max:bottom-[${dynamicBottom}px]`}
        leaveTo={`mob-max:bottom-[270px]`}

        // enterFrom="-translate-y-full"
        // enterTo="translate-y-0"
        // leave="transition-all duration-[400ms] east-in-out"
        // leaveFrom="translate-y-0"
        // leaveTo="-translate-y-full"
      >
        <div
          tabIndex={-1}
          className={`
          w-2/5 bg-white scrollbar-thin scrollbar-thumb-tc-primary scrollb
          transition-all duration-[400ms]
          mob-max:pb-20 mob-max:h-auto mob-max:w-full mob-max:border-gray-200 mob-max:rounded-t-3xl mob-max:fixed mob-max:overflow-y-auto 
          mob-max:border-t-2 mob-max:transition-transform mob-max:left-0 mob-max:right-0 mob-max:z-30 mob-max:translate-y-full
        `}
          style={{
            bottom: expandBottomDrawer ? `${dynamicBottom}px` : "270px",
          }}
        >
          <div
            className="hidden mob-max:block p-4 cursor-pointer"
            onClick={() => setExpandBottomDrawer(!expandBottomDrawer)}
          >
            <span className="absolute w-8 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
          </div>
          <div className="w-full px-2 py-0 gap-4 hidden mob-max:flex">
            <button
              data-tab={0}
              onClick={switchTabHandler}
              className={`w-full text-tc-base bg-gray-200 py-2 rounded-lg font-normal ${
                tab === 0 ? `bg-tc-primary text-white` : ``
              }`}
            >
              Content
            </button>
            <button
              data-tab={1}
              onClick={switchTabHandler}
              className={`w-full text-tc-base bg-gray-200 py-2 rounded-lg font-normal ${
                tab === 1 ? `bg-tc-primary text-white` : ``
              }`}
            >
              Design
            </button>
          </div>
          <div
            className={`mob-max:overflow-y-auto block pb-0`}
            style={{
              maxHeight: expandBottomDrawer
                ? `${dynamicBottom - 150}px`
                : "120px",
            }}
          >
            <form
              className="p-8 mob-max:p-4 mob-max:flex mob-max:w-full"
              // onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div
                className={`visible w-full ${
                  tab === 0 ? "mob-max:visible" : "mob-max:hidden"
                }`}
              >
                <h1 className="text-tc-2xl font-bold mb-6 mob-max:hidden">
                  Content
                </h1>
                {/* <TextInputComponent
                  control={control}
                  name="tweetLink"
                  label={VIDEO_FORM.TWEET_LINK}
                  placeholder="https://twitter.com/..."
                  id="tweetLink"
                  type="text"
                  className="mt-6"
                  onEnter={onTweetEnterHandler}
                /> */}
                <label
                  htmlFor="email"
                  className="block text-tc-primary mb-2 text-tc-base font-medium"
                >
                  {VIDEO_FORM.TWEET_LINK}
                </label>
                <input
                  id="tweetLink"
                  {...register("tweetLink")}
                  type="text"
                  placeholder="https://twitter.com/..."
                  className={`form-input bg-tc-input h-12 w-full rounded-lg appearance-none px-4 text-tc-primary leading-normal border-none focus:ring-tc-primary ${
                    errors.tweetLink
                      ? "outline outline-1 outline-red-600"
                      : "outline-none"
                  }`}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setValue("tweetLink", e.target.value)
                  }
                />
                {errors.tweetLink && (
                  <p className="text-red-500 text-sm">
                    {errors.tweetLink.message}
                  </p>
                )}

                <div className="whitespace-nowrap flex justify-between mb-4">
                  <VideoSubLabel>
                    {VIDEO_FORM.BACKGROUND_FOOTAGE_URL}
                  </VideoSubLabel>
                  <div className="">
                    <h1 className="whitespace-nowrap inline-block text-tc-primary mt-6 text-tc-base font-medium">
                      Show stock footage
                    </h1>
                    {/* <span className="mr-2">Show stock footage</span> */}
                    <Switch
                      checked={showStockFootage}
                      onChange={setShowStockFootage}
                      className={`${
                        showStockFootage ? "bg-blue-600" : "bg-gray-200"
                      } ml-1 relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          showStockFootage ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                </div>

                <div
                  className={`flex flex-col justify-center items-center h-36 p-3 w-full border border-dashed rounded-lg hover:border-tc-secondary focus:outline-none ${
                    errors.backgroundFootage
                      ? "border-red-500"
                      : "border-tc-ternary"
                  }`}
                >
                  {watchBackgroundFootage && (
                    <div className="flex flex-col items-center">
                      <div className="rounded-lg relative flex bg-tc-gray w-16 h-16 items-center justify-center">
                        <Image
                          src="/Vector.svg"
                          width={24}
                          height={21}
                          alt="Logo Placeholder"
                          priority
                        />
                        <button
                          type="button"
                          className="w-8 h-8 bg-tc-secondary rounded-full transition ease-out duration-300 absolute opacity-75 hover:opacity-100"
                          onClick={resetUploadFileHandler}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 mx-auto my-auto"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <h1 className="text-tc-base text-tc-primary">
                        {watchBackgroundFootage.name}
                      </h1>
                    </div>
                  )}
                  {!watchBackgroundFootage && (
                    <label
                      htmlFor="drop-zone"
                      className="relative flex flex-col justify-center items-center"
                    >
                      <div className="relative inline-flex items-center justify-center mr-2 w-12 h-12 overflow-hidden bg-[#F5F7F7] rounded-full">
                        <span className="font-medium text-gray-600 dark:text-gray-300">
                          <UploadIcon />
                        </span>
                      </div>
                      <div className="text-tc-base mt-3">
                        <h1
                          className={`inline font-bold ${
                            errors.backgroundFootage
                              ? "text-red-500"
                              : "text-tc-primary-alt"
                          }`}
                        >
                          Click to upload
                        </h1>{" "}
                        <h1 className="inline">or drag and drop</h1>
                      </div>
                      <h1 className="text-xs text-tc-secondary mt-2">
                        images and videos (max 1080x1920px)
                      </h1>
                      <h1 className="text-xs text-tc-secondary mt-1">
                        Max video duration: 30 seconds
                      </h1>
                      {/* <div className="bg-red-500 w-full">Test</div> */}
                      <input
                        id="drop-zone"
                        type="file"
                        accept="video/*,image/*"
                        className={`h-full w-full absolute top-0 left-0 block opacity-0 ${
                          loadingTweet ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                        onChange={onDropHandler}
                        disabled={loadingTweet}
                      />
                    </label>
                  )}
                </div>
                <StockAsset
                  onFootageSelect={footageSelectHandler}
                  show={showStockFootage}
                />
                <div className="mt-6">
                  <div className="flex gap-2 items-center">
                    <div className="">
                      <h2 className="block text-tc-primary ext-tc-base font-medium">
                        {VIDEO_FORM.BACKGROUND_OVERLAY}
                      </h2>
                    </div>
                    <div className="shrink-0 ml-auto relative">
                      <div
                        className="flex"
                        onClick={() => setOverlayPickerVisible(true)}
                      >
                        <button
                          onClick={(e) => e.preventDefault()}
                          style={{ backgroundColor: `#${watchOverlayColor}` }}
                          className={`border-tc-pallet-focused border-2 w-8 h-8 mr-1 rounded-md`}
                        ></button>
                        <VideoInput
                          control={control}
                          name="overlayColor"
                          id="overlayColor"
                          type="text"
                          disabled={true}
                        />
                      </div>
                      <Transition
                        show={overlayPickerVisible}
                        enter="transition transform duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition transform duration-0"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        ref={overlayColorRef}
                      >
                        <div className="absolute z-20 bottom-10 right-0 mob-max:left-0 mob-max:top-0">
                          <ColorPicker
                            width={300}
                            height={150}
                            color={pickerOverlayColor}
                            onChange={setPickerOverlayColor}
                            hideHSV
                            hideRGB
                            dark
                          />
                        </div>
                      </Transition>
                    </div>
                    <div className="shrink-0">
                      <VideoInput
                        control={control}
                        name="overlayOpacity"
                        id="overlayOpacity"
                        type="number"
                        suffix="%"
                        inputClassName="w-[50px]"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <Slider
                      id="video-overlay-opacity"
                      name="overlayOpacity"
                      control={control}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
                <VideoSubLabel>{VIDEO_FORM.COLOR_THEME}</VideoSubLabel>
                <select
                  {...register("colorTheme")}
                  id="colorTheme"
                  name="colorTheme"
                  className="px-4 form-select h-12 text-tc-primary text-tc-base rounded-lg bg-tc-input block w-full p-2.5 border-none focus:ring-tc-primary"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>

                <fieldset className="flex flex-wrap items-center gap-8 mob-max:gap-2 mt-6">
                  <div className="flex flex-col">
                    <Radio
                      id="opaque"
                      name="opacity"
                      value="1"
                      control={control}
                      label="Solid"
                      checked={watchOpacity === "1"}
                    />
                    <StyledThemeDiv onClick={() => setValue("opacity", "1")}>
                      <picture>
                        <img src="/Tweet/SolidTweet.png" alt="Opaque" />
                      </picture>
                    </StyledThemeDiv>
                  </div>

                  <div className="flex flex-col">
                    <Radio
                      id="transparent"
                      name="opacity"
                      value="0.5"
                      control={control}
                      label="Transparent"
                      checked={watchOpacity === "0.5"}
                    />
                    <StyledThemeDiv onClick={() => setValue("opacity", "0.5")}>
                      <picture>
                        <img
                          src="/Tweet/TransparentTweet.png"
                          alt="Translucent"
                        />
                      </picture>
                    </StyledThemeDiv>
                  </div>

                  <div className="flex flex-col">
                    <Radio
                      id="none"
                      name="opacity"
                      value="0"
                      control={control}
                      label="None"
                      checked={watchOpacity === "0"}
                    />
                    <StyledThemeDiv onClick={() => setValue("opacity", "0")}>
                      <picture>
                        <img src="/Tweet/NoneTweet.png" alt="Transparent" />
                      </picture>
                    </StyledThemeDiv>
                  </div>
                </fieldset>
              </div>

              <div
                className={`relative visible ${
                  tab === 1 ? "mob-max:visible" : "mob-max:hidden"
                }`}
              >
                <div>
                  <h1 className="mt-12 mob-max:mt-0 text-tc-2xl font-bold mob-max:hidden">
                    Custom look
                  </h1>
                  <h1 className="mt-6 mob-max:mt-0 text-tc-xl font-semibold">
                    Colors
                  </h1>
                  <div className="flex justify-start mob-max:flex-col flex-wrap gap-4">
                    <div>
                      <VideoSubLabel>Tweet background</VideoSubLabel>
                      <div className="flex flex-wrap gap-2 justify-between">
                        <div className="shrink-0 relative">
                          <div
                            className="flex"
                            onClick={() => setTweetBGVisible(true)}
                          >
                            <button
                              onClick={(e) => e.preventDefault()}
                              style={{
                                backgroundColor: `#${watchTweetBGColor}`,
                              }}
                              className={`border-tc-pallet-focused border-2 w-8 h-8 mr-1 rounded-md`}
                            ></button>
                            <VideoInput
                              control={control}
                              name="tweetBGColor"
                              id="tweetBGColor"
                              type="text"
                              disabled={true}
                            />
                          </div>
                          <Transition
                            show={tweetBGVisible}
                            enter="transition transform duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition transform duration-0"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            ref={tweetBGRef}
                          >
                            <div className="absolute z-20 bottom-10 left-0 mob-max:left-0 mob-max:top-0">
                              <ColorPicker
                                width={300}
                                height={150}
                                color={pickerTweetBGColor}
                                onChange={setTweetBGPickerColor}
                                hideHSV
                                hideRGB
                                dark
                              />
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </div>

                    <div>
                      <VideoSubLabel>Username</VideoSubLabel>
                      <div className="flex flex-wrap gap-2 justify-between">
                        <div className="shrink-0 relative">
                          <div
                            className="flex"
                            onClick={() => setUsernameColorIsVisible(true)}
                          >
                            <button
                              onClick={(e) => e.preventDefault()}
                              style={{
                                backgroundColor: `#${watchUsernameColor}`,
                              }}
                              className={`border-tc-pallet-focused border-2 w-8 h-8 mr-1 rounded-md`}
                            ></button>
                            <VideoInput
                              control={control}
                              name="usernameColor"
                              id="usernameColor"
                              type="text"
                              disabled={true}
                            />
                          </div>
                          <Transition
                            show={usernameColorIsVisible}
                            enter="transition transform duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition transform duration-0"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            ref={usernameColorRef}
                          >
                            <div className="absolute z-20 bottom-10 right-0 mob-max:left-0 mob-max:top-0">
                              <ColorPicker
                                width={300}
                                height={150}
                                color={pickerUsernameColor}
                                onChange={setUsernamePickerColor}
                                hideHSV
                                hideRGB
                                dark
                              />
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </div>

                    <div>
                      <VideoSubLabel>Text</VideoSubLabel>
                      <div className="flex flex-wrap gap-2 justify-between">
                        <div className="shrink-0 relative">
                          <div
                            className="flex"
                            onClick={() => setTextColorIsVisible(true)}
                          >
                            <button
                              onClick={(e) => e.preventDefault()}
                              style={{ backgroundColor: `#${watchTextColor}` }}
                              className={`border-tc-pallet-focused border-2 w-8 h-8 mr-1 rounded-md`}
                            ></button>
                            <VideoInput
                              control={control}
                              name="textColor"
                              id="textColor"
                              type="text"
                              disabled={true}
                            />
                          </div>
                          <Transition
                            show={textColorIsVisible}
                            enter="transition transform duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition transform duration-0"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            ref={textColorRef}
                          >
                            <div className="absolute z-20 bottom-10 right-0 mob-max:left-0 mob-max:top-0">
                              <ColorPicker
                                width={300}
                                height={150}
                                color={pickerColor}
                                onChange={setPickerColor}
                                hideHSV
                                hideRGB
                                dark
                              />
                            </div>
                          </Transition>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h1 className="mt-6 text-tc-xl font-semibold">Layout</h1>
                  <div className="flex flex-wrap gap-8 items-center mt-6">
                    <Checkbox
                      id="video-show-twitter-logo"
                      name="showTwitterLogo"
                      control={control}
                      label={VIDEO_FORM.SHOW_TWITTER_LOGO}
                    />
                    <Checkbox
                      id="video-show-username"
                      name="showHeader"
                      control={control}
                      label={VIDEO_FORM.SHOW_HEADER}
                    />
                    <Checkbox
                      id="video-show-date"
                      name="showDate"
                      control={control}
                      label={VIDEO_FORM.SHOW_DATE}
                    />
                    {watchShowHeader && (
                      <Checkbox
                        id="video-show-verified-icon"
                        name="showVerifiedIcon"
                        control={control}
                        label={VIDEO_FORM.SHOW_VERIFIED_ICON}
                      />
                    )}
                    {/* <Checkbox
                      id="video-show-engagement"
                      name="showEngagement"
                      control={control}
                      label={VIDEO_FORM.SHOW_ENGAGEMENT}
                    /> */}
                  </div>

                  <h1 className="mt-6 text-tc-xl font-semibold">Text</h1>

                  <div className="mt-6">
                    <div className="flex gap-2 justify-between items-center">
                      <div className="">
                        <h2 className="block text-tc-primary ext-tc-base font-medium">
                          {VIDEO_FORM.TEXT_SIZE}
                        </h2>
                      </div>
                      <div className="shrink-0">
                        <VideoInput
                          control={control}
                          name="textSize"
                          id="textSize"
                          type="number"
                          suffix="px"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <Slider
                        id="video-text-size"
                        name="textSize"
                        control={control}
                        min={12}
                        max={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="sticky bottom-0 mob-max:relative bg-white px-8 py-4 border-t mob-max:border-none border-tc-border shadow-[0_-1px_6px_rgba(13,16,19,0.1)] mob-max:shadow-none">
              <ButtonComponent
                disabled={casting}
                loading={casting}
                className="glow-primary-hover bg-tc-primary text-white text-center inline-flex items-center justify-center"
                onClick={handleSubmit(onSubmit)}
              >
                <svg
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                  className="mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.9464 9.31254H1"
                    stroke="white"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.97461 1.5V17.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {BUTTON.CREATE}
              </ButtonComponent>
            </div>
          </div>
        </div>
      </Transition>

      <UpgradeModal
        open={openUpgradeModal}
        closeHandler={onUpgradeCloseHandler}
        onActionHandler={onUpgradeClickHandler}
      />
      <CastingModal status={status} open={casting} closeHandler={() => null} />
      <VideoPlayer
        media={showMedia}
        resetUrlHandler={() => setShowMedia(undefined)}
      />
    </div>
  );
}

function prepStatus(currentStep: number, totalSteps: number, message: string) {
  return `(${currentStep}/${totalSteps}) ${message}`;
}
