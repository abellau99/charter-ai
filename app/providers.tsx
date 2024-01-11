"use client";

import { ContentFormProvider } from "@/context/ContentformContext";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <ContentFormProvider>
        <SessionProvider>
          <SnackbarProvider autoHideDuration={5000}>
            {children}
          </SnackbarProvider>
        </SessionProvider>
      </ContentFormProvider>
    </GoogleReCaptchaProvider>
  );
}
