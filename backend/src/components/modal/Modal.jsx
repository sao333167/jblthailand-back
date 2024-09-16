import React from "react";
import {
    Button,
    Description,
    Dialog,
    DialogPanel,
    DialogTitle,
} from "@headlessui/react";
import { RiCloseCircleFill } from "react-icons/ri";

export default function Modal({ isOpen, setIsOpen, title, children }) {
    return (
        <>
            <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={() => setIsOpen(false)}
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white/30 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                        >
                            <div
                                className="flex justify-end -mt-6 -mr-6 cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                <RiCloseCircleFill size={20} />
                            </div>
                            <DialogTitle
                                as="h3"
                                className="text-base/7 font-medium text-black text-center uppercase"
                            >
                                {title}
                            </DialogTitle>
                            {children}
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
