import { ContentFormContext } from "@/context/ContentformContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useContext } from "react";

interface IVerifyProps {
  open: boolean;
  closeHandler: Function;
  onActionHandler?: Function | null;
}

export default function Modal({
  open,
  closeHandler,
  onActionHandler = null,
}: IVerifyProps) {
  const { globalDeadline } = useContext(ContentFormContext);
  function closeModal() {
    closeHandler();
  }

  const actionHandler = useCallback(() => {
    if (onActionHandler) onActionHandler();
  }, [onActionHandler]);

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
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-xl px-16 py-12 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-8 text-[30px] font-bold leading-6 text-tc-primary text-center"
                  >
                    You reached your daily limit
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-base text-gray-500 text-center">
                      Please wait{" "}
                      <span className="font-bold">{globalDeadline}</span> before
                      creating a new content, or upgrade to{" "}
                      <span className="font-bold">contentform PRO</span> to
                      create unlimited content and unlock more features.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center">
                    {onActionHandler && (
                      <button
                        type="button"
                        className="glow-primary-hover inline-flex justify-center rounded-md border border-transparent bg-tc-primary text-white px-32 py-4 text-sm font-medium"
                        onClick={actionHandler}
                      >
                        Upgrade
                      </button>
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
