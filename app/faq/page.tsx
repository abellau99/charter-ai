"use client";

import { Disclosure, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import Wrapper from "../components/landing/Wrapper";
import faqs from "./content";

export default function Help() {
  return (
    <Wrapper>
      <div className="py-12 flex flex-col mx-auto h-full w-3/4 lg:w-3/5 items-center">
        <h1 className="text-tc-3xl font-bold">FAQ</h1>
        <h1 className="mt-4 text-center text-tc-base-24 font-normal w-3/4">
          Got a question? We&apos;re here to answer! In case your question is
          not addressed here, please feel free to reach out to
          support@contentform.com.
        </h1>
        <div className="w-full mt-16">
          <div className="w-full rounded-2xl bg-white p-2 text-tc-primary">
            {faqs.map((faq, i) => (
              <Disclosure key={faq.title}>
                {({ open }) => (
                  <div
                    className={`pb-6 ${
                      i === faqs.length - 1
                        ? ""
                        : "border-b border-tc-secondary border-opacity-10"
                    } ${i !== 0 ? "mt-6" : ""}`}
                  >
                    <Disclosure.Button className="flex w-full justify-between rounded-lg py-2 text-left text-tc-base font-medium ">
                      <span>{faq.title}</span>
                      <PlusIcon
                        className={`${
                          open
                            ? "transition-all rotate-45 transform"
                            : "transition-all"
                        } h-6 w-6`}
                      />
                    </Disclosure.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel className="pt-2 text-tc-base-24 text-[#6B6E70]">
                        {faq.body}
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
