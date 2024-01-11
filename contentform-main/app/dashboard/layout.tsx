"use client";

import { PATH_TITLE } from "@/lib/constants";
import { Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment, ReactNode, useEffect, useState } from "react";
import SideNav from "./components/SideNav";
import TopBar from "./components/TopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>(PATH_TITLE.CREATE);

  useEffect(() => {
    if (!session) {
    }
  }, [session]);

  return (
    <div className="h-screen">
      <TopBar title={title} />
      <Transition
        as={Fragment}
        show={true}
        enter="transform transition duration-[400ms]"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition duration-[400ms] east-in-out"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <SideNav onNavHandler={(label: string) => setTitle(label)} />
      </Transition>
      <div
        className={`pl-72 mob-max:pl-0 mob-max:pb-20 h-full pt-20 transition-all duration-[400ms]`}
      >
        <div className="h-full">{children}</div>
      </div>
      {/* {isMobile && <BottomNav />} */}
      {/* <section className="mob-max:visible">
        <BottomNav />
      </section> */}
    </div>
  );
}
