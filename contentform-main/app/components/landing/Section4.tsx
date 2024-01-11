import Image from "next/image";
import { PrimaryButtonLink } from "../StyledLink";
import { GradientBorderLB, GradientBorderTL, Star } from "./ComplexBorder";

export default function Section4() {
  return (
    <div className="container mx-auto mt-32 mb-20">
      <div className="relative h-[750px] mob-max:h-[200px] mob-max:mx-4">
        <GradientBorderLB className="absolute right-0 top-[535px] mob-max:-top-[5px] mob-max:right-[5px] z-20 -m-4 rotate-180" />
        <Star className="absolute top-[525px] mob-max:-top-[5px] right-[250px] mob-max:right-[80px] z-20 -m-4" />
        <GradientBorderTL className="absolute right-0 top-[505px] mob-max:top-[85px] mob-max:right-[5px] z-20 -m-4 rotate-180" />
        <Star className="absolute top-[750px] mob-max:top-[298px] -right-[25px] mob-max:right-[50px] z-20" />
        <div className="w-full h-[525px] mob-max:h-[300px] rounded-[32px] z-10 absolute top-[300px] mob-max:top-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full branding-gradient"></div>
        </div>

        <div className="flex flex-col w-full mob-max:w-full z-30 absolute mx-auto">
          <div className="relative mob-max:hidden mx-auto">
            <Image
              className=""
              src="/Landing/WebsitePreview.png"
              alt="create"
              width={900}
              height={0}
            />
            <div className="absolute top-20 left-[260px] w-[200px] h-full">
              <div className="relative h-full">
                <picture>
                  <img
                    className="absolute z-20"
                    src="https://tweetcast-assets.s3.eu-west-2.amazonaws.com/images/IPhone13Frame.png"
                    alt="Iphone13Frame"
                  />
                </picture>
                <Image
                  className="absolute left-1/2 -translate-x-1/2 transition-all duration-100 mx-auto z-10 h-[400px] rounded-[30px] object-cover"
                  src="https://media.tenor.com/QWZAInP_zn4AAAAC/the-breakfast-club-brian-johnson.webp"
                  alt="Preview"
                  width={190}
                  height={0}
                ></Image>
                <Image
                  className=" absolute bottom-1/2 left-1/2 -translate-x-1/2 z-30"
                  src="/Landing/SampleTweet2.png"
                  width={160}
                  height={0}
                  alt="Preview"
                />
              </div>
            </div>

            <GradientBorderLB className="absolute left-0 bottom-0 z-20 -m-4" />
            <Star className="absolute bottom-[85px] -left-[9px] -m-4" />
          </div>

          <div className="w-[850px] mob-max:w-full mx-auto mt-12 mob-max:px-4">
            <h1 className="text-tc-landing-h1 mob-max:w-full mob-max:text-tc-32-48 font-bold text-center">
              Watch your{" "}
              <span className="py-2 px-4 bg-black text-white rounded-[32px] mob-max:rounded-lg">
                posts
              </span>{" "}
              turn into videos in seconds
            </h1>
          </div>
          <PrimaryButtonLink
            href="/auth/signup"
            className="glow-primary-hover w-fit mt-7 mx-auto text-tc-16"
          >
            Get started
          </PrimaryButtonLink>
        </div>
      </div>
    </div>
  );
}
