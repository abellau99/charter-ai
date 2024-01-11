import Image from "next/image";
import { PrimaryButtonLink } from "../StyledLink";
import { GradientBorderLB, Star } from "./ComplexBorder";

export default function Section2() {
  return (
    <div className="mx-auto mt-[200px] mob-max:mt-[300px] relative p-4">
      <div className="h-full w-full relative overflow-hidden rounded-[32px]">
        <div className="absolute top-0 -z-10 left-0 w-full h-full branding-gradient"></div>
        <div className="h-fit mob-max:h-fit z-30 px-12 py-8">
          <div className="flex flex-col w-[700px] mob-max:w-full mob-max:p-2">
            <h1 className="text-tc-landing-h1 mob-max:text-tc-32-38 font-bold">
              Supercharge your socials!
            </h1>
            <span className="text-tc-18 mob-max:tc-18-26 font-normal mt-6">
              Your content should live everywhere, on every platform. Use{" "}
              <span className="font-bold">contentform </span>
              to supercharge your Instagram, TikTok, YouTube and other socials
              by turning your contents into videos.
            </span>
            <PrimaryButtonLink
              href="/auth/signup"
              className="glow-primary-hover w-fit mob-max:w-full mt-10 z-10 text-tc-16"
            >
              Get started
            </PrimaryButtonLink>
          </div>
        </div>
        <div className="mob-max:hidden">
          <Image
            className=" absolute right-[420px] bottom-[15px]"
            src="/Landing/HeroInsta.svg"
            width={108}
            height={0}
            alt="Preview"
          />
          <Image
            className=" absolute right-[280px] bottom-[100px]"
            src="/Landing/HeroTikTok.svg"
            width={126}
            height={0}
            alt="Preview"
          />
          <Image
            className=" absolute right-[120px] bottom-[225px]"
            src="/Landing/HeroYT.svg"
            width={108}
            height={0}
            alt="Preview"
          />
          <Image
            className=" absolute right-[20px] bottom-[30px]"
            src="/Landing/HeroFB.svg"
            width={105}
            height={0}
            alt="Preview"
          />
        </div>
      </div>
      <GradientBorderLB className="absolute left-0 -bottom-[9px] w-[250px] h-[250px] mob-max:left-[5px] mob-max:-bottom-[5px]" />
      <Star className="absolute -bottom-[9px] mob-max:-bottom-[5px] left-[120px]" />
    </div>
  );
}
