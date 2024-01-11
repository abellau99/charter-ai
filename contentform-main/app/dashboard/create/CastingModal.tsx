import Spinner from "@/app/components/Spinner";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

interface IVerifyProps {
  open: boolean;
  status: string | null;
  closeHandler: Function;
  onActionHandler?: Function | null;
}

export default function CastingModal({
  status,
  open,
  closeHandler,
}: IVerifyProps) {
  function closeModal() {
    closeHandler();
  }

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="text-2xl font-medium leading-6 text-tc-primary"
                  >
                    Magic is happening!
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-md text-gray-500">
                      Your{" "}
                      <Image
                        className="ml-auto animate-bounce"
                        src="/ContentForm.svg"
                        width={80}
                        height={0}
                        alt="contentform Loader"
                        priority
                      />{" "}
                      will be ready soon. Please do not refresh the page.
                    </p>
                    <Spinner />
                    {status && (
                      <div className="font-medium text-tc-sm text-tc-secondary">
                        {status}...
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
