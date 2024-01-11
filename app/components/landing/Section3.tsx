"use client";

import { IResponseVideo } from "@/app/dashboard/my-videos/page";
import { Fragment, useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

function Block({ url, type }: { url: string; type: string }) {
  return (
    <div className="relative h-[400px] w-[300px] mob-max:w-11/12 mx-auto place-self-end rounded-lg justify-center overflow-hidden">
      <div className="absolute h-full w-full top-0 left-0 branding-gradient"></div>

      {type === "video/mp4" ? (
        <video
          className="w-full h-full object-cover"
          src={url}
          autoPlay
          loop
          muted
        ></video>
      ) : (
        <picture>
          <img className="w-full h-full object-cover" src={url} alt="" />
        </picture>
      )}
    </div>
  );
}

export default function Section3() {
  const [landingCuratedContents, setLandingCuratedContents] = useState<IResponseVideo[]>([]);
  const fetchSamples = useCallback(async () => {
    const response = await fetch("/api/videos/landing-curated");
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setLandingCuratedContents(data);
  }, []);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);
  const settings = {
    infinite: true,
    speed: 200,
    slidesToScroll: 1,
    slidesToShow: landingCuratedContents.length < 4 ? landingCuratedContents.length : 4,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
        },
      },
      // {
      //   breakpoint: 1000,
      //   settings: {
      //     slidesToShow: 2,
      //   },
      // },
      // {
      //   breakpoint: 500,
      //   settings: {
      //     slidesToShow: 1,
      //   },
      // },
    ],
    // dotsClass: "",
    // appendDots: (dots: JSX.Element[]) => (
    //   <div>
    //     <ul className="mt-4 flex justify-center place-items-center">
    //       {dots.map((dot) => (
    //         <li
    //           key={dot.props["data-index"]}
    //           className={`text-transparent inline-block my-0 mx-1 cursor-pointer rounded-full ${
    //             dot.props.className.includes("slick-active")
    //               ? "bg-tc-primary-alt w-[8px] h-[8px]"
    //               : "bg-tc-gray w-[4px] h-[4px]"
    //           }`}
    //         >
    //           {dot}
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // ),
  };
  return (
    <Fragment>
      <div className="mt-32 mx-auto">
        <Slider {...settings}>
          {landingCuratedContents.length > 0 &&
            landingCuratedContents.map((sample) => (
              <Block key={sample.id} url={sample.url} type={sample.mimeType} />
            ))}
        </Slider>
      </div>
    </Fragment>
  );
}
