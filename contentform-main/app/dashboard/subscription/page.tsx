"use client";

import SubContent from "./SubContent";

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

export default function Subscription() {
  return <SubContent />;
}
