// ResponsePage.tsx

import React, { useContext, useState, useEffect } from "react";
import { ThemeContextData } from "../../Context/ThemeContext";
import SummerySection from "../../Components/SummerySection";
import ChatSection from "../../Components/ChatSection";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { UploadProviderContextData } from "../../Context/UploadProviderContext";
import { ModeContextData } from "../../Context/ModeContext";
import { useOption } from "../../Context/OptionsContext";



// import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;



const ResponsePage: React.FC = () => {
    const { mode } = useContext(ModeContextData)
    const { pdfFile } = useContext(UploadProviderContextData);
    const [tab, setTab] = useState<"chat" | "summary">("summary");
    const { theme } = useContext(ThemeContextData);
    const [numPages, setNumPages] = useState(0);
    const [scale, setScale] = useState(0.8);
    const [pageWidth, setPageWidth] = useState(300);
    const {  setSelectedOption } = useOption();

    useEffect(() => {
        const updateWidth = () => {
            if (window.innerWidth < 640) {
                setPageWidth(window.innerWidth - 30);
            } else if (window.innerWidth < 1024) {
                setPageWidth(550);
            } else {
                setPageWidth(700);
            }
        };

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
    }, []);


    return (
        <div className={`min-h-full lg:h-full flex-1 overflow-auto  m-2 rounded-t-[12px] 
             ${theme === "light"
                ? "bg-[#faecd3]  rounded-md shadow-[0px_0px_3px_#000]"
                : "bg-[#0B0B12]  shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            }
        
        `}>
            <div
                className={`
                    
                        rounded-md
                        shadow-[16px_16px_0px_#000]
                    min-h-[calc(100vh-24px)]
                    lg:h-[calc(100vh-24px)]
                    px-1
                    pt-0
                    flex-col
                    lg:flex-row
                    lg:overflow-hidden
                    w-full 
                    h-full 
                    flex 
                    justify-center

                   
                `}
            >
                {/* PDF SECTION */}
                <div className="flex flex-col

                        w-full
                        lg:w-[50%]

                        min-h-[400px]
                        max-h-[500px]

                        lg:h-full
                        lg:max-h-none

                        overflow-hidden">

                    {/* Toolbar */}
                    <div className={`sticky top-0 z-10 p-3 flex items-center justify-center gap-4
                         
                        `}>

                        <div className={`p-1 rounded-sm font-bold flex justify-around items-center
                            ${theme === "light"
                                ? "bg-[#E9D6B4] shadow-[0px_0px_5px_#AD84AD]"
                                : "bg-[#066E76] text-[#E9D6B4]  "
                            }`}>
                            <button
                                className="border px-3 py-1 text-sm mr-5 rounded-sm"
                                onClick={() =>
                                    setScale(prev => Math.max(0.5, prev - 0.1))
                                }
                            >
                                −
                            </button>

                            <span className="text-sm">{Math.round(scale * 100)}%</span>

                            <button
                                className="border px-3 py-1 text-sm ml-5 rounded-sm"
                                onClick={() =>
                                    setScale(prev => Math.min(3, prev + 0.1))
                                }
                            >
                                +
                            </button>
                        </div>
                        <div >

                            <button
                                onClick={()=>{setSelectedOption("null")}}
                                className={` flex text-sm px-5 py-2 rounded-sm font-bold    py-2 font-mono font-bold    hover:shadow-[6px_6px_0px_#000] transition rounded-none cursor-pointer
                                ${theme == 'light' ?
                                        " hover:shadow-[6px_6px_0px_#000] "
                                        : "hover:shadow-[6px_6px_0px_#fff] "

                                    } ,
                                 ${theme === "light"
                                        ? "bg-[#E9D6B4] shadow-[0px_0px_5px_#AD84AD]"
                                        : "bg-[#066E76] text-[#E9D6B4]  "
                                    }
                  
                  
                  
                  `}>
                                Switch Funtions


                            </button>
                        </div>

                    </div>

                    {/* PDF */}
                    <div className="flex flex-col items-center overflow-scroll scrollbar-none p-4
                        md:mr-1
                          flex-1
                          border-none
                          rounded-t-[12px] 
                          md:rounded-t-[12px]
                            
                            bg-[#696969]
                            [&_.textLayer]:hidden
                            [&_.react-pdf__Page__textContent]:hidden
                            [&_.annotationLayer]:hidden
                            [&_.react-pdf__Page__annotations]:hidden
                    ">

                        <Document
                            file={pdfFile}
                            onLoadSuccess={({ numPages }) =>
                                setNumPages(numPages)
                            }
                        >
                            {Array.from(
                                new Array(numPages),
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-center mb-5"
                                    >
                                        <Page
                                            pageNumber={index + 1}
                                            width={pageWidth}
                                            scale={scale}
                                            className="max-w-full shadow-2xl"
                                        />
                                    </div>
                                )
                            )}
                        </Document>

                    </div>
                </div>

                {/* TOGGLE BAR */}
                <div
                    className="
                        w-full
                        lg:w-10

                        h-12
                        lg:h-auto

                        flex
                        flex-row
                        lg:flex-col
                        sticky
                        top-0
                        z-20
                        shrink-0
                        mt-2
                        
                    "
                >
                    <button
                        onClick={() => setTab("chat")}
                        className={`
                            flex-1
                            text-[10px]
                            font-bold
                            tracking-[3px]

                            lg:[writing-mode:vertical-rl]
                            lg:rotate-180

                            transition-all
                            duration-300
                            cursor-pointer
                            text-[#E9D6B4]
                            
                            md:rounded-br-[12px]

                            ${tab === "chat"
                                ? "bg-[#066E76]"
                                : "bg-[#F1ECE2] text-black"
                            }
                        `}
                    >
                        CHAT
                    </button>

                    <button
                        onClick={() => setTab("summary")}
                        className={`
                            flex-1
                            text-[10px]
                            font-bold
                            tracking-[3px]

                            lg:[writing-mode:vertical-rl]
                            lg:rotate-180

                            transition-all
                            duration-300
                            cursor-pointer
                            text-black

                            ${tab === "summary"
                                ? "bg-[#F0C84A]"
                                : "bg-[#F1ECE2]"
                            }
                        `}
                    >
                        SUMMARY
                    </button>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 flex flex-col min-h-0 overflow-scroll scrollbar-none mt-2 md:mr-1  md:rounded-tr-[12px] ">
                    {/* Top Bar */}
                    <div
                        className={`
                            h-10
                            
                            flex items-center
                            px-4
                            text-xs
                            uppercase
                            font-bold
                            tracking-[2px]
                            transition-all
                            duration-300
                            ease-in-out
                            
                            shrink-0

                            ${tab === "chat"
                                ? "bg-[#066E76] text-[#E9D6B4]"
                                : "bg-[#F0C84A] text-black"
                            }
                        `}
                    >
                        {tab === "chat"
                            ? `Ask The Paper${mode ? `   (${mode} Mode Activated) ` : ""} `
                            : "Executive Summary"}
                    </div>

                    {/* CONTENT AREA */}
                    <div className="flex-1 min-h-0 h-[70vh] flex flex-col ">
                        <div className={tab === "summary" ? "" : "hidden"}>
                            <SummerySection />
                        </div>
                        <div
                            className={`${tab === "chat"
                                ? "flex-1 min-h-[90vh] flex flex-col overflow-visible scrollbar-none lg:h-[40vh]"
                                : "hidden"
                                }`}
                        >
                            <ChatSection />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsePage;