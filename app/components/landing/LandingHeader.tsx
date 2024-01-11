"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PrimaryButtonLink } from "../StyledLink";

export default function LandingHeader({
  onSideBarToggle,
}: {
  onSideBarToggle: Function;
}) {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    onSideBarToggle(openSidebar);
  }, [openSidebar, onSideBarToggle]);

  return (
    <div className="z-50 sticky top-0 bg-white bg-opacity-70 backdrop-blur-lg mob-max:px-4">
      <div className="w-[1250px] mob-max:w-full flex container mx-auto justify-between pt-6 pb-4">
        <div className="flex justify-between mob-max:w-full">
          <Link href="/">
            <picture>
              <img
                className="w-[280px] mob-max:w-[220px]"
                src="/ContentForm-Beta.png"
                alt="contentform logo"
              />
            </picture>
          </Link>
          <div className="hidden mob-max:block">
            {openSidebar ? (
              <XMarkIcon
                width={30}
                height={30}
                onClick={() => setOpenSidebar(false)}
              />
            ) : (
              <Bars3Icon
                width={30}
                height={30}
                onClick={() => setOpenSidebar(true)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-3 mob-max:hidden">
          <Link
            className={`bg-transparent text-tc-16 font-normal py-4 px-4 mob-max:p-4 rounded-lg text-tc-primary hover:text-tc-primary-alt ${
              pathname === "/pricing" ? "text-tc-primary-alt" : ""
            }`}
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="ml-auto glow-alt text-tc-16 font-bold py-4 px-14 mob-max:p-4 rounded-lg bg-[#ECF0F1] text-tc-primary"
            href="/auth/login"
          >
            Login
          </Link>
          <PrimaryButtonLink
            className="glow-primary-hover text-tc-16"
            href="/auth/signup"
          >
            Get started
          </PrimaryButtonLink>
        </div>
      </div>
    </div>
  );
}
