"use client";

import { BUTTON } from "@/lib/constants";
import Link from "next/link";

export default function VideoCTA() {
  return (
    <>
      <div className="mob-max:w-full w-96 flex flex-col flex-none">
        <div className="p-4 w-full h-auto border border-tc-card-border rounded-2xl">
          <div className="flex justify-between">
            <div className="mr-1">
              <h1 className="text-tc-18 font-semibold">
                Create your first content
              </h1>
              <p className="text-[#99A1A8] text-xs mt-1 tracking-wide">
                All your content will appear on this page
              </p>
            </div>
          </div>

          <div className="mt-4 w-full h-80 flex justify-center bg-tc-gray rounded-2xl hover:cursor-pointer">
            <picture className="w-full">
              <img
                className={`h-full w-full mx-auto object-cover rounded-2xl`}
                src="/VideoCTABlock.png"
                alt=""
              />
            </picture>
          </div>

          <div className="flex mt-4 items-center justify-between ">
            <Link
              href="/dashboard/create"
              className="bg-tc-primary text-white text-center inline-flex items-center justify-center transition ease-linear duration-75 delay-75 
              w-full 
              rounded-lg 
              p-3.5 
              enabled:transition 
              disabled:cursor-not-allowed 
              disabled:opacity-75"
            >
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.9464 9.31254H1"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.97461 1.5V17.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {BUTTON.CREATE}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
