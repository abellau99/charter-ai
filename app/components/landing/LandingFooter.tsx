import Image from "next/image";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <div className="bg-tc-gray h-fit mt-40 mob-max:h-fit flex flex-col">
      <div className="mob-max:mt-16 mt-8 mx-auto flex mob-max:flex-col justify-between h-full w-[1250px] mob-max:w-full">
        <Link href="/" className="self-center mob-max:order-3 mob-max:mt-12">
          <picture>
            <img
              className="w-[180px]"
              src="/ContentForm.svg"
              alt="contentform logo"
            />
          </picture>
        </Link>
        <div className="flex mob-max:flex-col items-center gap-20 mob-max:gap-10 text-tc-base-24 font-light text-[#313131]">
          <Link href="/pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/tos">Terms of Service</Link>
        </div>
        <div className="flex gap-12 mob-max:gap-8 mob-max:order-3 mob-max:my-8 items-center mob-max:justify-center">
          <Link href="https://www.instagram.com/contentformapp" target="_blank">
            <Image
              src="/socials/Instagram.svg"
              alt="Instagram"
              width={34}
              height={34}
            />
          </Link>
          <Link href="https://www.youtube.com/@contentform" target="_blank">
            <Image
              src="/socials/Youtube.svg"
              alt="Instagram"
              width={34}
              height={34}
            />
          </Link>
          <Link
            href="https://www.linkedin.com/company/contentform"
            target="_blank"
          >
            <Image
              src="/socials/LinkedIn.svg"
              alt="Facebook"
              width={34}
              height={34}
            />
          </Link>
          <Link href="https://twitter.com/contentformapp" target="_blank">
            <Image
              src="/socials/Twitter.svg"
              alt="Facebook"
              width={34}
              height={34}
            />
          </Link>
        </div>
      </div>
      <div className="my-16 text-center text-tc-base-24 font-light text-[#313131]">
        ZCKMED LTD.
      </div>
    </div>
  );
}
