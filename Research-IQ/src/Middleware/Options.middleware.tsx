import React, { type JSX } from "react";
import { motion } from "framer-motion";
import { BookOpen, Share2 } from "lucide-react";
import { useOption } from "../Context/OptionsContext";

import ResponsePage from "../Pages/Features Page/Summary_Chat";
import MindMap from "../Pages/Features Page/MindMap";

const OptionsMiddleware = () => {
  const { selectedOption, setSelectedOption } = useOption();

  const pages: Record<string, JSX.Element> = {
    "Summary & Chat AI": <ResponsePage />,
    "Mind Map": <MindMap />,
  };

  if (selectedOption && selectedOption !== "null") {
    return (
      <motion.div
        key={selectedOption}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.3 }}
      >
        {pages[selectedOption]}
      </motion.div>
    );
  }

  return (
    <motion.div
      key="options"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="min-h-[70vh]  overflow-hidden"
    >
      <div className=" flex flex-wrap flex-col md:flex-row justify-evenly items-center">

        {/* SUMMARY */}

        <Card
          icon={<BookOpen size={34} strokeWidth={2.5} />}
          title="SUMMARY & CHAT AI"
          description="Instant technical distillation for busy researchers. Get the core insights in seconds with interactive interrogation of complex data. Ask anything. Find everything."
          buttonText="ENTER SUMMARY & CHAT AI MODE"
          buttonColor="bg-yellow-400 hover:bg-yellow-300"
          chips={[]}
          decoration="left"
          onClick={() => setSelectedOption("Summary & Chat AI")}
        />

        {/* CHAT */}

        {/* <Card
          icon={<MessageSquare size={34} strokeWidth={2.5} />}
          title="CHAT AI"
          description="Interactive interrogation of complex data. Ask anything. Find everything."
          buttonText="LAUNCH ASSISTANT"
          buttonColor="bg-purple-300 hover:bg-purple-200"
          chips={["Paper Mode", "Hybrid Mode", "Explain Mode"]}
          decoration="center"
          onClick={() => setSelectedOption("Summary & Chat AI")}
        /> */}

        {/* MINDMAP */}

        <Card
          icon={<Share2 size={34} strokeWidth={2.5} />}
          title="MINDMAP"
          description="Visual node-based architecture of your research tree. Map the unknown."
          buttonText="GENERATE MAP"
          buttonColor="bg-sky-700  hover:bg-sky-600"
          chips={[]}
          decoration="right"
          onClick={() => setSelectedOption("Mind Map")}
        />
      </div>
    </motion.div>
  );
};

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  chips?: string[];
  decoration: "left" | "center" | "right";
  onClick: () => void;
}

const Card = ({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  chips,
  decoration,
  onClick,
}: CardProps) => {
  return (
    <div className="relative flex flex-col  md:w-1/2 my-10 items-center justify-center px-8 py-10  hover:bg-[] border-box">

      {/* Background Decoration */}

      {decoration === "left" && (
        <div className="absolute left-0 top-12 w-64 h-64 rotate-45 opacity-20">
          <div className="w-full h-full bg-[linear-gradient(to_right,#D62828,#F4A261,#E9C46A,#0B7285)]"></div>
        </div>
      )}

      {decoration === "center" && (
        <div className="absolute bottom-0 left-0 w-64 h-64 rotate-45 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-purple-300 via-cyan-300 to-orange-300"></div>
        </div>
      )}

      {decoration === "right" && (
        <div className="absolute right-0 bottom-0 w-64 h-64 rotate-45 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-[#E63946] via-[#F4A261] to-[#0B7285]"></div>
        </div>
      )}

      {/* Icon */}

      <div className="relative z-10 w-15 h-15 border-[3px]  flex items-center justify-center shadow-[8px_8px_0px_0px]">
        {icon}
      </div>

      {/* Heading */}

      <h1
        className="relative z-10 mt-8 text-4xl font-black tracking-tight"
        style={{
          fontFamily: "monospace",
        }}
      >
        {title}
      </h1>

      {/* Description */}

      <p
        className="relative z-10 text-center mt-4 max-w-xs text-[12px] leading-7"
        style={{
          fontFamily: "monospace",
        }}
      >
        {description}
      </p>

      {/* Button */}

      <button
        onClick={onClick}
        className={`cursor-pointer relative z-10 mt-8 text-black w-full max-w-xs py-4 border-[3px] border-black shadow-[6px_6px_0px_0px] font-bold tracking-widest transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${buttonColor}`}
        style={{
          fontFamily: "monospace",
        }}
      >
        {buttonText}
      </button>

      {/* Chips */}

      <div className="relative z-10 flex gap-2 mt-5 flex-wrap justify-center">
        {chips?.map((chip) => (
          <span
            key={chip}
            className="border-2 border-black  px-2 py-1 text-[10px] tracking-widest"
            style={{
              fontFamily: "monospace",
            }}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OptionsMiddleware;