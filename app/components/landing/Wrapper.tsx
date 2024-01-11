"use client";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment, ReactNode, useState } from "react";
import { PrimaryButtonLink } from "../StyledLink";
import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";

export default function Wrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [sideToggle, setSideToggle] = useState<boolean>(false);
  return (
    <div
      className={`h-full w-full mt-0 flex flex-col text-tc-primary mx-auto ${className}`}
    >
      <LandingHeader onSideBarToggle={setSideToggle} />

      <section className={`duration-300 ${sideToggle ? "hidden" : ""}`}>
        <div className="mx-auto mob-max:px-4 w-[1250px] min-w-[1250px] max-w-[1250px] mob-max:w-full mob-max:max-w-0 mob-max:min-w-full mb-20">
          {children}
        </div>
        <LandingFooter />
      </section>
      <Transition
        as={Fragment}
        show={sideToggle}
        enter="transition ease-out duration-[350ms] transform"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-out duration-[350ms] transform"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="hidden p-4 top-0 left-0 bottom-0 mob-max:flex flex-col gap-1 mob-max:mt-16 filter backdrop-blur-xl bg-opacity-60 fixed z-50 bg-white w-full h-full">
          <div className="flex flex-col gap-1">
            <Link
              className={`bg-transparent text-tc-xl font-normal py-2`}
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className={`bg-transparent text-tc-xl font-normal py-2`}
              href="/help"
            >
              FAQ
            </Link>
            <Link
              className={`bg-transparent text-tc-xl font-normal py-2`}
              href="/blog"
            >
              Blog
            </Link>
          </div>
          <Link
            className="w-full text-center glow-alt text-tc-xl font-bold py-4 px-14 mob-max:p-4 rounded-lg bg-[#ECF0F1] text-tc-primary"
            href="/auth/login"
          >
            Login
          </Link>
          <PrimaryButtonLink className="glow-primary mt-4" href="/auth/signup">
            Get started
          </PrimaryButtonLink>
        </div>
      </Transition>
    </div>
  );
}
