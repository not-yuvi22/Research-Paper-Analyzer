import { useContext, useState, useRef, useEffect } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeContextData } from "../../Context/ThemeContext";
import { UploadContextData } from "../../Context/UploadContext";
import { UploadProviderContextData } from "../../Context/UploadProviderContext";
import { sendPdf } from "../../API/Upload.api"
import LoadingPage from "../../Components/LoadingPage";
import LoadingTicTacToe from "../../Components/tic_tac_toe.tsx/LoadingTicTacToe";


const UploadSec = () => {
    const [dragging, setDragging] = useState(false);
    // const [file, setFile] = useState<File | null>(null);
    const { setPdfFile } = useContext(UploadProviderContextData);

    // const [isUploaded, setIsUploaded] = useState(false)
    const { theme } = useContext(ThemeContextData);
    const { setIsUploaded } = useContext(UploadContextData);
    const [isUploading, setIsUploading] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);
    const timeoutRef = useRef<number | null>(null);
    const [showGame, setShowGame] = useState(false);


    const handleFiles = async (incomingFiles: FileList | null) => {
        if (!incomingFiles) return;

        const selectedFile = incomingFiles[0];

        if (selectedFile.type !== "application/pdf") {
            alert("Please upload a PDF file.");
            return;
        }

        // Cancel previous upload if one exists
        controllerRef.current?.abort();

        const controller = new AbortController();
        controllerRef.current = controller;

        setIsUploading(true);

        const gameTimer = setTimeout(() => {
            setShowGame(true);
        }, 5000);

        timeoutRef.current = window.setTimeout(() => {
            controller.abort();
        }, 300000); // 5 Minutes

        try {
            await sendPdf(selectedFile, controller.signal);

            setPdfFile(selectedFile);
            setIsUploaded(true);
        } catch (err: any) {
            console.error(err);

            if (
                err.name === "CanceledError" ||
                err.name === "AbortError" ||
                err.code === "ERR_CANCELED"
            ) {
                alert(
                    "Upload timed out after 2 minutes. Please try again."
                );
            } else {
                alert("Uploading Failed. Please try again!");
            }

            // Reset everything
            setPdfFile(null);
            setIsUploaded(false);

            localStorage.removeItem("paper_id");
        } finally {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            clearTimeout(gameTimer);
            setShowGame(false);
            setIsUploading(false);

            controllerRef.current = null;
            setIsUploading(false);
        }
    };

    useEffect(() => {
        return () => {
            controllerRef.current?.abort();

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);



    return (
        <div className="relative">
            {isUploading ? (
                <LoadingPage>

                    <div className="flex flex-col items-center">

                        <h2 className="text-xl font-bold tracking-widest">
                            ANALYZING PAPER
                        </h2>

                        <p className="mt-2 text-sm opacity-70">
                            Extracting text...
                        </p>

                        {showGame && (
                            <LoadingTicTacToe />
                        )}

                    </div>

                </LoadingPage>

            ) : (
                <section className={`min-h-auto flex items-center justify-center px-5 py-15 transition-all delay-300
           
        `}>

                    <div className="max-w-5xl w-full">

                        {/* Heading */}
                        <div className="mb-8">
                            <h1 className={`font-archivo text-3xl md:text-4xl uppercase tracking-[3px] mb-3
                        
                        `}>
                                INGEST RESEARCH
                            </h1>

                            <p className={`text-sm  leading-6 max-w-xl
                         ${theme === "light"
                                    ? " text-black "
                                    : "text-[#F2E6CF] "
                                }
                        `}>
                                Upload your PDF manuscripts for deep neural processing and
                                semantic analysis. Our AI extracts core insights and summary
                                instantly.
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">

                            {/* Upload Area */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.25 }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragging(false);
                                    if (isUploading) return;
                                    handleFiles(e.dataTransfer.files);
                                }}
                                className={`
              flex-1 min-h-[280px] h-[420px] 
              border-2 border-dashed
              relative overflow-hidden
              flex flex-col items-center justify-center
              p-5 transition-all duration-300
              ${dragging
                                        ? "border-[#2BB4A0] shadow-[0_0_35px_rgba(43,180,160,.35)]"
                                        : "border-[#666]"
                                    }
            `}
                            >
                                {/* Animated Glow */}
                                <motion.div
                                    animate={{ opacity: [0.1, 0.25, 0.1] }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 2,
                                    }}
                                    className="absolute inset-0 bg-[#2BB4A0]/10"
                                />

                                <div className="relative text-center">

                                    <motion.div
                                        whileHover={{
                                            rotate: [-8, 8, -8],
                                        }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1,
                                        }}
                                        className="
                  w-12 h-12
                  mx-auto mb-5
                  bg-[#F3AB0C]
                  border-[3px]
                  border-black
                  shadow-[5px_5px_0px_black]
                  flex items-center justify-center
                "
                                    >
                                        <UploadCloud size={24} className="text-black" />
                                    </motion.div>

                                    <h3 className="font-archivo uppercase text-lg tracking-[2px] mb-3">
                                        Drop Research Paper Here
                                    </h3>

                                    <p className="text-xs text-gray-400 mb-6">
                                        Drag & Drop PDF up to 50MB
                                    </p>

                                    <label
                                        className="
                cursor-pointer
                bg-[#CFA7E8]
                text-black
                text-sm
                px-5 py-2
                uppercase
                font-bold
                border-[3px]
                border-black
                
                hover:translate-x-[6px]
                hover:translate-y-[6px]
                hover:shadow-[5px_5px_0px_gray]
                duration-200
              "
                                    >
                                        Browse File

                                        <input
                                            type="file"
                                            accept=".pdf"
                                            hidden
                                            disabled={isUploading}

                                            onChange={(e) => handleFiles(e.target.files)}
                                        />
                                    </label>

                                    {/* Uploaded File */}
                                    {/* {pdfFile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`
                                                 mt-8
                                                    flex items-center justify-between
                                                    bg-[#111]
                                                    border-2 border-[#2BB4A0]
                                                    p-2
                                                    bg-black
                                                    `}

                                >
                                    <div className="flex items-center gap-2">

                                        <FileText
                                            size={18}
                                            className="text-[#F3AB0C]"
                                        />

                                        <div>
                                            <p className="text-xs text-[#F2E6CF] max-w-[150px] truncate">
                                                {pdfFile.name}
                                            </p>

                                            <p className="text-[10px] text-gray-500">
                                                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={removeFile}
                                        className="text-red-500 hover:text-red-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={(pdfFile) => {
                                            if (pdfFile) {
                                                // send pdfFile to backend
                                                handleFiles(pdfFile);
                                            }
                                        }}
                                        className="
                                                        cursor-pointer
                                                        bg-[#F3AB0C]
                                                        text-[black]
                                                        text-sm
                                                        px-5 py-2
                                                        uppercase
                                                        font-bold
                                                        border-[3px]
                                                        border-black
                                                        
                                                        hover:border-[#F2E6CF]
                                                        transition-all
                                                        ease-in-out
                                                        
                                                        duration-200
              "
                                    >
                                        Upload




                                    </button>
                                </motion.div>

                            )} */}

                                </div>
                            </motion.div>

                            {/* Right Cards */}
                            <div className="w-full lg:w-[220px] flex flex-col gap-4">

                                {/* Guide Card */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="
                bg-[#9FD3F8]
                text-black
                p-4
                border-[4px]
                border-black
                shadow-[7px_7px_0px_#444]
              "
                                >
                                    <h2 className="font-archivo uppercase text-base mb-4">
                                        Ingestion Guide
                                    </h2>

                                    <div className="space-y-3 text-xs leading-5">
                                        <p>
                                            <span className="font-bold">01.</span> Ensure PDFs contain selectable text.
                                        </p>

                                        <p>
                                            <span className="font-bold">02.</span> Multi-column layouts supported.
                                        </p>

                                        <p>
                                            <span className="font-bold">03.</span> Files are encrypted and removed.
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Model Card */}
                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    className="
                bg-[#D3A7E9]
                text-black
                p-4
                border-[4px]
                border-black
                shadow-[7px_7px_0px_#444]
              "
                                >
                                    <div className="flex items-center gap-3">

                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 10,
                                                ease: "linear",
                                            }}
                                        >
                                            ✦
                                        </motion.div>

                                        <div>
                                            <p className="text-[10px] uppercase tracking-[2px]">
                                                Active Model
                                            </p>

                                            <h3 className="font-archivo text-lg">
                                                MODEL V1.0
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* PDF Support Card */}
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="
                bg-[#9DD1AF]
                text-black
                p-4
                border-[4px]
                border-black
                shadow-[7px_7px_0px_#444]
              "
                                >
                                    <div className="flex items-center gap-3">

                                        <FileText size={20} />

                                        <div>
                                            <h3 className="font-archivo text-base">
                                                PDF Support
                                            </h3>

                                            <p className="text-xs mt-1">
                                                Single PDF upload enabled.
                                            </p>
                                        </div>

                                    </div>
                                </motion.div>

                            </div>

                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default UploadSec;