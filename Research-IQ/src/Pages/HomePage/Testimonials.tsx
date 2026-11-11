import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
    {
        quote:
            "The Executive Summary helped me understand research papers in minutes, and Explain Mode made difficult concepts incredibly easy to grasp.",
        author: "Sneha Singh",
        role: "M.Sc.Student, Savitribai Phule Pune University",
    },
    {
        quote:
            "Paper Mode gave me precise answers from the research paper, while Explain Mode simplified technical concepts I struggled with. It made studying research papers far less intimidating.",
        author: "Rishabh Singh",
        role: "B.Tech EEE Student, IIT Roorkee",
    },
    {
        quote:
            "PaperMind AI became my go-to tool for assignments and research. The summaries alone saved me several hours every week.",
        author: "PRIYANSHU DAS",
        role: "B.Tech IT Student, KIIT University",
    },
    {
        quote:
            "The Executive Summary gave me the core ideas before I read the paper. It made finding relevant research much faster.",
        author: "MEGHNA JOSHI",
        role: "M.Tech CSE Student, PES University, Bengaluru",
    },
   
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);

    const previous = () => {
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const next = () => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const leftIndex =
        (current - 1 + testimonials.length) % testimonials.length;

    const rightIndex =
        (current + 1) % testimonials.length;

    const cards = [
        {
            ...testimonials[leftIndex],
            position: "left",
        },
        {
            ...testimonials[current],
            position: "center",
        },
        {
            ...testimonials[rightIndex],
            position: "right",
        },
    ];

    const variants = {
        left: {
            x: "-90%",
            scale: 0.85,
            opacity: 0.3,
            zIndex: 1,
        },
        center: {
            x: 0,
            scale: 1,
            opacity: 1,
            zIndex: 5,
        },
        right: {
            x: "90%",
            scale: 0.85,
            opacity: 0.3,
            zIndex: 1,
        },
    };

    return (
        <section id="Testimonials" className="min-h-full  flex flex-col justify-center items-center py-7 overflow-hidden">

            {/* Heading */}
            <div className="text-center mb-1 md:mb-3">
                <h1 className="uppercase font-black tracking-[3px] 
          text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                    Voices Of The Vanguard
                </h1>

                <p className="mt-3  text-xs sm:text-sm">
                    Used by thousands of researchers across the globe.
                </p>
            </div>

            {/* Cards */}
            <div className="relative mt-5 w-full max-w-[950px] h-[180px] sm:h-[210px] md:h-[240px] lg:h-[260px] flex justify-center items-center">

                {cards.map((card) => (
                    <motion.div
                        key={card.author}
                        layout
                        variants={variants}
                        animate={card.position}
                        transition={{
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`
              absolute p-4 md:p-6
              ${card.position === "center"
                                ? "w-[80vw] sm:w-[420px] md:w-[480px] bg-[#E9E1D1] border-4 border-black"
                                : "w-[42vw] sm:w-[210px] md:w-[250px] bg-[#F5EFE3] border-[3px] border-[#B5B0A8]"
                            }
              shadow-[6px_6px_0px_#777777]
            `}
                    >
                        <p
                            className={`${card.position === "center"
                                ? "text-[#1A1A1A] font-bold leading-6 md:leading-8 text-sm md:text-xl"
                                : "text-[#B6B0A7] leading-4 md:leading-6 text-[10px] md:text-xs"
                                }`}
                        >
                            "{card.quote}"
                        </p>

                        <div className="mt-4 md:mt-8">
                            <h3
                                className={`uppercase font-bold ${card.position === "center"
                                    ? "text-black text-sm md:text-base"
                                    : "text-[#B0AAA0] text-[10px]"
                                    }`}
                            >
                                {card.author}
                            </h3>

                            <p className="text-[8px] md:text-[10px] uppercase tracking-[1px] text-[#8A847B]">
                                {card.role}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 md:gap-5 mt-10 md:mt-16">

                <button
                    onClick={previous}
                    className="
          w-10 h-10 md:w-12 md:h-12
          bg-[#F2EBD9]
          border-[3px]
          border-black
          text-black
          flex justify-center items-center
          shadow-[4px_4px_0px_#ffff]
          hover:bg-[#F3AB0C]
          transition-all duration-300"
                >
                    <ArrowLeft size={16} />
                </button>

                <button
                    onClick={next}
                    className="
          w-10 h-10 md:w-12 md:h-12
          bg-[#F2EBD9]
          border-[3px]
          border-black
          text-black
          flex justify-center items-center
          shadow-[4px_4px_0px_#ffff]
          hover:bg-[#9DD1AF]
          transition-all duration-300"
                >
                    <ArrowRight size={16} />
                </button>

            </div>
        </section>
    );
}