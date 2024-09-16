import React from "react";

export default function Loading() {
    return (
        <div className="absolute flex -mt-4 items-center justify-center w-full h-screen z-50  bg-white/5 backdrop-blur-xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black "></div>
        </div>
    );
}
