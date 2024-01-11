import Spinner from "@/app/components/Spinner";
import { Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { debounce } from "lodash";

import { BackgroundType } from "@/lib/constants";
import { KeyboardEvent, memo, useCallback, useEffect, useState } from "react";

// const KEY = "7oGDSWiAtlSgnd4kGgSvQHnIFOJkmqmQ8x03yTfK2hZfI9il5OoXqmnJ";
const KEY = process.env.NEXT_PUBLIC_PEXEL_API_KEY!;

interface IStockAsset {
  onFootageSelect: Function;
  show: boolean;
}

interface IVideoFile {
  id: number;
  link: string;
  width: number;
  height: number;
  quality: string;
}

interface IVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  video_files: IVideoFile[];
  user: {
    name: string;
  };
}

const PEXELS_BASE_URI = "https://api.pexels.com/videos";

interface IPexelsUrl {
  baseUrl: string;
  resource: string;
  pagination: string;
}

interface IFetchFootage {
  loadMore?: boolean;
  isClear?: boolean;
}

function StockAsset({ onFootageSelect, show }: IStockAsset) {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const fetchStockFootages = debounce(
    async ({ loadMore = false, isClear = false }: IFetchFootage) => {
      let localPage: number = page;
      let localSearchText: string = searchText;

      if (isClear) {
        localSearchText = "";
      }

      setIsLoading(true);
      if ((!loadMore && localSearchText.length > 0) || isClear) {
        setVideos([]);
        setPage(1);
        localPage = 1;
      }

      let url = `${PEXELS_BASE_URI}/popular?page=${localPage}&per_page=15`;

      if (localSearchText.length > 0) {
        url = `${PEXELS_BASE_URI}/search?query=${localSearchText}&page=${localPage}&per_page=15`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: KEY,
        },
      });
      setIsLoading(false);

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      let responseVideos: IVideo[] = data.videos.filter(
        (vid: any) => !videos.some((v) => v.id === vid.id) && vid.duration <= 30
      );

      responseVideos.forEach((rv) => {
        rv.video_files = rv.video_files.filter((f) => f.quality === "hd");
      });

      console.log(responseVideos.map((r) => r.video_files.length));

      responseVideos = responseVideos.filter((rv) => rv.video_files.length > 0);

      console.log({ responseVideos });
      setPage((prevPage) => prevPage + 1);
      setVideos((prevVideos) => [...prevVideos, ...responseVideos]);
    },
    500
  );

  const selectFootageHandler = useCallback(
    async (url: string, type: string) => {
      const response = await fetch(url);

      if (!response.ok) {
        return;
      }
      onFootageSelect(response.url, type);
    },
    [onFootageSelect]
  );

  const handleSearch = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchText.length > 0) {
        fetchStockFootages({});
      }
    },
    [fetchStockFootages, searchText]
  );

  const clearHandler = useCallback(() => {
    setSearchText("");
    fetchStockFootages({ isClear: true });
  }, [fetchStockFootages]);

  useEffect(() => {
    fetchStockFootages({});
  }, []);

  return (
    <div className="mt-4">
      <Transition show={show}>
        <Transition.Child
          enter="transition-transform ease-linear duration-100"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform ease-linear duration-100"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative ml-auto w-[225px] mob-max:w-full">
            <input
              type="text"
              placeholder="Search"
              className={`form-input bg-tc-input h-12 w-full rounded-lg appearance-none px-4 text-tc-primary leading-normal border-none focus:ring-tc-primary`}
              value={searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchText(e.target.value)
              }
              onKeyDown={handleSearch}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                fetchStockFootages({});
              }}
              disabled={searchText.length === 0}
              className="absolute top-1/2 -translate-y-1/2 right-[10px] text-tc-secondary hover:text-black disabled:hover:text-tc-secondary"
            >
              <MagnifyingGlassIcon className="my-auto" width={24} height={24} />
            </button>
            {searchText.length > 0 && (
              <button
                onClick={clearHandler}
                className="absolute top-1/2 -translate-y-1/2 right-[40px] text-tc-secondary hover:text-black disabled:hover:text-tc-secondary"
              >
                <XMarkIcon className="my-auto" width={24} height={24} />
              </button>
            )}
          </div>
        </Transition.Child>
        <Transition.Child
          enter="transition transform ease-linear duration-400"
          enterFrom="scale-0 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition transform ease-linear duration-400"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-0 opacity-0"
        >
          <div
            className={`grid pr-3 gap-2 h-96 overflow-auto mt-2 scrollbar-thin scrollbar-thumb-tc-primary scrollb ${
              videos.length > 0
                ? "grid-cols-3 mob-max:grid-cols-2"
                : "grid-cols-1"
            }`}
          >
            {isLoading && <Spinner />}
            {videos.map((video, i) => (
              <div
                className="relative mt-1 ml-1 hover:scale-105 duration-200"
                key={video.id}
              >
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-30 rounded-lg">
                  <p className="text-[12px] font-medium text-white">
                    by {video.user.name}
                  </p>
                </div>
                <picture
                  className="cursor-pointer"
                  onClick={() =>
                    selectFootageHandler(
                      video?.video_files[0]?.link,
                      BackgroundType.Video
                    )
                  }
                >
                  <img
                    className="h-[200px] w-full object-cover rounded-lg transition-all duration-200"
                    src={video.image}
                    alt=""
                  />
                </picture>
              </div>
            ))}
            {videos.length > 0 && (
              <div className="w-full mt-2 col-span-3 mob-max:col-span-2 mb-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    fetchStockFootages({ loadMore: true });
                  }}
                  className="text-tc-primary border border-tc-primary py-2 rounded-lg w-full glow-primary-hover hover:bg-tc-primary hover:text-white"
                >
                  Load more...
                </button>
                <div className="text-sm font-medium text-right mt-2 text-[#949494]">
                  <a href="https://www.pexels.com">
                    <picture>
                      <img
                        src="/PexelsLogo.svg"
                        alt="pexels"
                        className="h-[20px] mr-2"
                      />
                    </picture>
                    Powered by Pexels
                  </a>
                </div>
              </div>
            )}
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
}

export default memo(StockAsset);
