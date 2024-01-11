"use client";

import { GoogleColor } from "@/app/dashboard/components/Icons";
import { signIn } from "next-auth/react";
import { ReactNode } from "react";
import ButtonComponent from "../ButtonComponent";

interface ISvgWrapperProps {
  provider: "google" | "twitter";
  children: ReactNode;
}

const SvgWrapper = ({ provider, children }: ISvgWrapperProps) => {
  return (
    <ButtonComponent
      onClick={() =>
        signIn(provider, {
          redirect: true,
          callbackUrl: "/dashboard/create",
        })
      }
      variation="outlined"
      className="text-tc-primary"
    >
      <div className="flex gap-x-4 justify-center items-center">{children}</div>
    </ButtonComponent>
  );
};

const GoogleTwitterContainer = () => {
  return (
    <div className="flex flex-col gap-3 font-bold">
      <SvgWrapper provider="google">
        <GoogleColor />
        <div>Continue with Google</div>
      </SvgWrapper>
      {/* <SvgWrapper provider="twitter">
        <TwitterBlue />
        <div>Continue with Twitter</div>
      </SvgWrapper> */}
    </div>
  );
};

export default GoogleTwitterContainer;
