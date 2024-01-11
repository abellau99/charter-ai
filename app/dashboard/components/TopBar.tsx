"use client";
import { PATHS } from "@/lib/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { memo, ReactNode } from "react";
import Deadline from "./Deadline";

interface ITopBarProps {
  title: string;
}

function TopBar({ title }: ITopBarProps) {
  const { data: session } = useSession();
  let topBarButton: ReactNode = null;

  if (session && !session?.user?.subscription?.isPro) {
    topBarButton = (
      <div className="flex gap-4 place-items-center">
        <Deadline />
        <Link
          href={PATHS.SUBSCRIPTION}
          className="mob-max:hidden glow-primary-hover w-[220px] border text-tc-base font-bold border-tc-border-dark py-3 rounded-lg text-center"
        >
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  return (
    <nav
      className={`fixed z-40 w-full h-20 bg-white text-tc-primary p-0 border-b border-[#DEE3E9] transition-all duration-[400px] pl-72 px-9 mob-max:px-2`}
    >
      <div
        className={`flex h-full place-items-center justify-between mob-max:justify-center pl-4`}
      >
        <h1 className="text-3xl font-bold text-center">{title}</h1>
        {topBarButton}
      </div>
    </nav>
  );
}

export default memo(TopBar);
