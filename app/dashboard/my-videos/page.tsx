"use client";

import VideoCTA from "@/app/components/VideoCTA";
import VideoPlayer from "@/app/components/VideoPlayer";
import { useCallback, useEffect, useState } from "react";
import Video, { IMedia } from "../../components/Video";

export interface IResponseVideo {
  id: string;
  tweetLink: string;
  title: string;
  url: string;
  mimeType: string;
  createdAt: string;
  landingCurated: boolean;
  authCurated: boolean;
}

export default function MyVideos() {
  const [videos, setVideos] = useState<IResponseVideo[]>([]);
  const [showMedia, setShowMedia] = useState<IMedia | undefined>(undefined);
  const fetchVidoes = useCallback(async () => {
    const res = await fetch("/api/videos/my-videos", {
      next: { revalidate: 5 },
    });
    if (!res.ok) {
      const errResponse = await res.json();
      return;
    }

    const videos: IResponseVideo[] = await res.json();
    setVideos(videos);
  }, [setVideos]);

  useEffect(() => {
    fetchVidoes();
  }, [fetchVidoes]);

  const playerHandler = useCallback(
    (media: IMedia) => {
      setShowMedia(media);
    },
    [setShowMedia]
  );

  const resetUrlHandler = useCallback(() => {
    setShowMedia(undefined);
  }, [setShowMedia]);

  return (
    <>
      <div className="h-full p-8 mob-max:px-4 flex flex-wrap gap-4 justify-items-center">
        {videos.length === 0 && <VideoCTA />}
        {videos.length > 0 &&
          videos.map((video, i) => (
            <Video key={video.id} video={video} playHandler={playerHandler} />
          ))}
      </div>
      <VideoPlayer media={showMedia} resetUrlHandler={resetUrlHandler} />
    </>
  );
}
