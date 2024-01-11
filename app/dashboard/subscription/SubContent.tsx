"use client";

import { SUBSCRIPTION } from "@/lib/constants";
import { Tab } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useState } from "react";
import { DiamondBullet } from "../components/Icons";
import { BILLINGS } from "./subscription-detail";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// interface IBillingTab {
//   key: string;
//   label: string;
// }

// interface IBillingTab {
//   key: string;
//   label: string;
// }

// const billings: IBillingTab[] = [
//   {
//     key: "monthly",
//     label: "Monthly",
//   },
//   {
//     key: "anually",
//     label: "Annually",
//   },
// ];

interface ISubscription {
  isPublic?: boolean;
}

function StyledList({ fill, children }: { fill: string; children: ReactNode }) {
  return (
    <li className="flex">
      <DiamondBullet className="flex-shrink-0 mt-1 align-top" fill={fill} />
      <p>{children}</p>
    </li>
  );
}

export default function SubContent(props: ISubscription) {
  const router = useRouter();
  const { data: session } = useSession();

  const [tabIndex, setTabIndex] = useState(0);
  const [currentInterval, setCurrentInterval] = useState<string>("month");

  const subscribeHandler = useCallback(
    async (plan: string, currentInterval: string) => {
      if (props.isPublic) {
        return;
      }
      const resp = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval: currentInterval }),
      });

      const data = await resp.json();
      router.push("/dashboard/checkout?cs=" + data.clientSecret);
      // if (data.alreadyPro) {
      //   window.open(data.url, "_blank");
      //   return;
      // }
      // const stripe = await loadStripe(
      //   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      // );
      // await stripe?.redirectToCheckout({ sessionId: data.id });
    },
    [props.isPublic, router]
  );

  const openPortalHandler = useCallback(async () => {
    if (props.isPublic) {
      return;
    }
    const resp = await fetch("/api/stripe/portal");

    const data = await resp.json();
    window.open(data.url, "_blank");
  }, [props.isPublic]);

  return (
    <div className="mt-10 flex flex-col h-screen mob-max:h-full items-center">
      <h1 className="text-tc-3xl font-bold">{SUBSCRIPTION.HEADER}</h1>
      <h1 className="text-tc-base font-normal mt-4">
        {SUBSCRIPTION.SUB_HEADER}
      </h1>
      <div className="mt-6 flex">
        <div className="relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full branding-gradient-only rounded-xl backdrop-blur-3xl opacity-20 -z-10"></div>
          <Tab.Group selectedIndex={tabIndex} onChange={setTabIndex}>
            <Tab.List className="flex space-x-2 rounded-xl p-1">
              {Object.keys(BILLINGS).map((key: string) => (
                <Tab
                  onClick={() => setCurrentInterval(key)}
                  key={key}
                  className={({ selected }) =>
                    classNames(
                      "transition duration-75 ease-in-out w-28 rounded-lg py-3 px-2 text-tc-base font-medium text-tc-primary focus:outline-none",
                      selected ? "bg-white shadow" : "hover:bg-white/[0.5]"
                    )
                  }
                >
                  {BILLINGS[key as keyof typeof BILLINGS]["label"]}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        <div className="text-tc-base font-semibold ml-3 flex self-center">
          Save 20%
        </div>
      </div>

      <div className="w-[820px] mob-max:w-auto mob-max:px-4 mob-max:pb-32 mt-12">
        <div className="h-auto grid grid-cols-2 mob-max:flex mob-max:flex-col gap-8 justify-items-center">
          <div className="w-full flex flex-col text-center p-8 bg-tc-gray rounded-3xl border border-tc-card-border">
            <div className="flex justify-between text-tc-48 font-bold">
              <h1 className="">Free</h1>
              <h2 className="mt-1">
                <span className="text-tc-2xl font-medium opacity-50 align-top mr-1">
                  $
                </span>
                <span className="">
                  {BILLINGS[currentInterval as keyof typeof BILLINGS].priceFree}
                </span>
                <span className="text-tc-base font-normal align-baseline opacity-50">
                  {BILLINGS[currentInterval as keyof typeof BILLINGS].suffix}
                </span>
              </h2>
            </div>
            <div className="mt-8 mb-8 border-t"></div>
            <div className="text-left text-tc-base font-medium text-[#42515E]">
              <ul className="space-y-[24px] pricing-list">
                <StyledList fill="#DCE2E2">
                  Create 1 piece of content per day
                </StyledList>
              </ul>
            </div>
            {!props.isPublic && !session?.user?.subscription?.isPro && (
              <div className="mt-auto w-full border bg-white border-tc-secondary rounded-lg py-4 text-tc-base font-bold">
                Current plan
              </div>
            )}
          </div>

          <div className="relative glow-primary flex flex-col w-full text-center p-8 rounded-3xl overflow-hidden">
            <div className="absolute top-0 -z-10 left-0 w-full h-full branding-gradient"></div>
            <div className="flex justify-between text-tc-48 font-bold text-black">
              <h1 className="">Pro</h1>
              <h2 className="mt-1">
                <span className="text-tc-2xl font-medium opacity-50 align-top mr-1">
                  $
                </span>
                <span className="">
                  {BILLINGS[currentInterval as keyof typeof BILLINGS].pricePro}
                </span>
                <span className="text-tc-base font-normal align-baseline opacity-50">
                  {BILLINGS[currentInterval as keyof typeof BILLINGS].suffix}
                </span>
              </h2>
            </div>
            <div className="mt-8 mb-8 border-t border-black border-opacity-40"></div>
            <div
              className={`text-left text-tc-base font-medium text-black ${
                props.isPublic ? "" : "mb-16"
              }`}
            >
              <ul className="space-y-[24px] pricing-list">
                <StyledList fill="#0D1013">Remove the watermark</StyledList>
                <StyledList fill="#0D1013">
                  Create an unlimited amount of content
                </StyledList>
                <StyledList fill="#0D1013">
                  Add stock footage to your video from our inventory
                </StyledList>
                <StyledList fill="#0D1013">
                  Upload or add audio footage to your video from our inventory
                  (soon)
                </StyledList>
                <StyledList fill="#0D1013">
                  Schedule Instagram posts, carousels, Stories, and Reels (soon)
                </StyledList>
              </ul>
            </div>
            {!props.isPublic && !session?.user?.subscription?.isPro && (
              <button
                type="submit"
                className="mt-auto bg-tc-primary w-full text-white rounded-lg py-4 text-tc-base font-bold glow-alt"
                onClick={() => subscribeHandler("pro", currentInterval)}
              >
                Upgrade to PRO
              </button>
            )}
            {!props.isPublic && session?.user?.subscription?.isPro && (
              <button
                type="submit"
                className="mt-auto bg-tc-primary w-full text-white rounded-lg py-4 text-tc-base font-bold glow-alt"
                onClick={openPortalHandler}
              >
                Manage subscription
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
