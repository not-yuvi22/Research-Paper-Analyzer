import  { useContext } from "react";
import { ThemeContextData } from "../../Context/ThemeContext";

const OurServices = () => {
  const { theme } = useContext(ThemeContextData)
  return (
    <section id="ourServices" className="relative  py-16 px-4 overflow-hidden">

      {/* Top Glow */}
      <div className="absolute top-0 left-0 w-full h-20 " />

      <div className="max-w-6xl mx-auto relative">

        {/* Heading */}
        <div className="mb-12">
          <h1 className="font-mono font-bold text-2xl md:text-4xl  uppercase tracking-wide">
            THE PRECISION TOOLKIT
          </h1>

          <p className="mt-3  font-mono text-xs md:text-sm max-w-xl leading-6">
            Advanced computational tools designed for systematic
            literature review and deep conceptual understanding.
          </p>

          <div className={`mt-5 h-[3px]  w-32 md:w-44
          ${theme == 'light' ?
              "bg-black"
              : "bg-[#F2E6CF]"


            }
            
            `} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-4 group bg-[#9DD1AF] border-4 border-black p-6 shadow-[7px_7px_0px_#000] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#fff]">


            <h2 className="mt-6 font-mono text-lg font-bold uppercase text-black">
              INSTANT SUMMARY
            </h2>

            <p className="mt-4 text-black/80 leading-6 font-mono text-sm">
              Generate concise summaries of complex research papers, highlighting key ideas, objectives, methods, and findings for quick understanding.
            </p>

          </div>

          {/* Main Card */}
          <div className="col-span-12 lg:col-span-8 group bg-[#F2E6CF] border-4 border-black p-6 shadow-[7px_7px_0px_#000] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#fff]">


            <h2 className="mt-4 font-mono text-xl md:text-3xl font-bold uppercase text-black">
              AI Chat with Paper
            </h2>

            <p className="mt-5 text-black/80 leading-7 font-mono text-xs md:text-sm">
              Interact directly with research papers using AI. Ask questions, extract insights, and get instant answers from complex academic content.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">

              <span className="border-2 text-black border-black px-2 py-1 font-mono text-[10px] hover:bg-black hover:text-white
              cursor-pointer uppercase
              
              ">
                Paper Mode
              </span>

              <span className="border-2 text-black border-black px-2 py-1 font-mono text-[10px] hover:bg-black hover:text-white
              cursor-pointer uppercase">
                Explain Mode

              </span>

              <span className="border-2 text-black border-black px-2 py-1 font-mono text-[10px] hover:bg-black hover:text-white
              cursor-pointer">
                Hybrid Mode
              </span>

            </div>

          </div>

          {/* Right Card */}


          {/* Bottom Left */}
          <div className="col-span-12 md:col-span-4 group bg-[#2BB4A0] border-4 border-black p-6 shadow-[7px_7px_0px_#000] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#fff]">

            <h2 className="mt-6 font-mono text-lg font-bold uppercase text-black">
              ZERO SETUP
            </h2>

            <p className="mt-4 font-mono text-xs leading-6 text-black">
             Upload one or multiple research papers and get instant results in seconds. No login required. Your files are processed securely, your data stays private, and your documents are never shared. Simple, fast, and built with your privacy in mind.
            </p>


          </div>

          {/* Bottom Center */}
          <div className="col-span-12 md:col-span-4 group bg-[#F2E6CF] border-4 border-black p-6 shadow-[7px_7px_0px_#000] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#fff]">

            <h2 className="mt-6 font-mono text-lg font-bold uppercase text-black">
              Mind Map Generator
            </h2>

            <p className="mt-4 font-mono text-xs leading-6 text-black">
              Automatically transform research papers into interactive mind maps that visualize key concepts, relationships, and insights. Understand complex topics faster and explore connections with ease.
            </p>

            

          </div>

          {/* Bottom Right */}
          <div className="col-span-12 md:col-span-4 group bg-[#E9440A] text-white border-4 border-black p-6 shadow-[7px_7px_0px_#000] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#fff]">


            <h2 className="mt-6 font-mono text-lg font-bold uppercase">
              Multi-Paper Comparison
            </h2>

            <p className="mt-4 font-mono text-xs leading-6 text-white/90">
              Compare multiple research papers side-by-side to identify similarities, differences, methodologies, and key findings. Gain deeper insights and make informed research decisions faster.
            </p>

            <button className="mt-8 font-bold text-sm font-mono text-black relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black after:transition-all group-hover:after:w-full">
              Coming Soon
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default OurServices;