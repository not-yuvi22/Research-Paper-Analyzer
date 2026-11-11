import React from "react";
import { motion } from "framer-motion";


interface Props {
    children?:React.ReactNode
    classname?:string

}

const LoadingPage: React.FC<Props> = ({children,classname}) => {
    return (
        <div className=" gap-6 h-screen flex flex-col items-center justify-center">

            {/* Document with scanning sweep */}
            <div className="relative w-20 h-24 bg-white border-[3px] border-black shadow-[6px_6px_0px_#000] overflow-hidden">
                <div className="absolute top-3 left-2 right-2 h-1.5 bg-black/10" />
                <div className="absolute top-6 left-2 right-2 h-1.5 bg-black/10" />
                <div className="absolute top-9 left-2 right-4 h-1.5 bg-black/10" />
                <div className="absolute top-12 left-2 right-2 h-1.5 bg-black/10" />

                <motion.div
                    className="absolute left-0 right-0 h-8 bg-gradient-to-b from-[#2BB4A0]/0 via-[#2BB4A0]/60 to-[#2BB4A0]/0"
                    animate={{ top: ["-20%", "120%"] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                />
            </div>

            {/* Pulsing label */}
            <motion.h3
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                className={`font-archivo uppercase text-lg tracking-[3px] ${classname}`}
            >
                {children}
            </motion.h3>

            {/* Smooth indeterminate progress bar */}
            <div className="w-48 h-3 border-[2px] border-black bg-white overflow-hidden relative">
                <motion.div
                    className="absolute h-full w-1/3 bg-[#F3AB0C]"
                    animate={{ left: ["-33%", "100%"] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                />
            </div>

        </div>
    );
};

export default LoadingPage;