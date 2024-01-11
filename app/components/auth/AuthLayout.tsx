"use client";
import { IResponseVideo } from "@/app/dashboard/my-videos/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";

interface IAuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: IAuthLayoutProps) => {
  const router = useRouter();
  const handleClick = useCallback(() => {
    // window.location.href = "/";
    router.push("/");
  }, [router]);

  const [authCurated, setAuthCuratedContents] = useState<IResponseVideo[]>([]);
  const fetchSamples = useCallback(async () => {
    const response = await fetch("/api/videos/auth-curated");
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setAuthCuratedContents(data);
  }, []);

  useEffect(() => {
    fetchSamples();
  }, [fetchSamples]);

  return (
    <div className="grid md:grid-cols-2 h-screen bg-white">
      <div className="mt-16 mx-8 md:mx-auto md:w-3/4 lg:w-96 2xl:w-2/4">
        <div className="cursor-pointer">
          <Image
            width={280}
            height={0}
            src="/ContentForm.svg"
            alt="contentform logo"
            onClick={handleClick}
          />
        </div>
        <div className="mt-20">{children}</div>
      </div>
      <div className="relative bg-tc-gray flex place-content-center invisible h-0 md:h-full md:visible overflow-hidden">
        <div className="absolute h-full w-full top-0 left-0 branding-gradient"></div>
        <div className="flex w-full my-auto mx-20 h-[600px] gap-8">
          <div className="relative h-[600px] w-[350px] mob-max:w-11/12 mx-auto place-self-end rounded-3xl justify-center overflow-hidden">
            <div className="absolute h-full w-full top-0 left-0 branding-gradient"></div>
            <video
              className="w-full h-full object-cover"
              src={authCurated[0]?.url}
              autoPlay
              loop
              muted
            ></video>
          </div>
          <div className="flex flex-col gap-8">
            <div className="relative h-2/3 w-[350px] mob-max:w-11/12 mx-auto place-content-center rounded-3xl overflow-hidden">
              <div className="absolute h-full w-full top-0 left-0 branding-gradient"></div>

              <video
                className="w-full h-full object-cover"
                src={authCurated[1]?.url}
                autoPlay
                loop
                muted
              ></video>
            </div>
            <div className="relative h-1/3 w-[350px] mob-max:w-11/12 mx-auto place-content-center rounded-3xl overflow-hidden">
              <div className="absolute h-full w-full top-0 left-0 branding-gradient"></div>

              <video
                className="w-full h-full object-cover"
                src={authCurated[2]?.url}
                autoPlay
                loop
                muted
              ></video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
