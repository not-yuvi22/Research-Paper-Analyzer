import { FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#222] px-19 py-14 text-[#F2E6CF]">

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

        {/* Left */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black tracking-wide">
              Research-IQ
            </h2>

            <p className="mt-3 text-[10px] uppercase tracking-[1px] text-gray-500 leading-4">
              © 2026 RESEARCH-IQ LABS. BUILT FOR
              <br />
              THE MODERN RESEARCHER.
            </p>
          </div>

          <div className="flex gap-3">
            <a href="https://github.com/satyam071/Research-IQ" target="_blank" className="w-10 h-10 border-[3px] border-[#F2E6CF] bg-[#111] flex items-center justify-center shadow-[3px_3px_0px_#F2E6CF] hover:bg-[#2BB4A0] hover:text-black transition-all duration-300">
              <FaGithub size={16} />
            </a>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=ysatyam0071@gmail.com&su=Research-IQ%20Feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border-[3px] border-[#F2E6CF] bg-[#111] flex items-center justify-center shadow-[3px_3px_0px_#F2E6CF] hover:bg-[#F3AB0C] hover:text-black transition-all duration-300"
              aria-label="Send Feedback"
            >
              <FaEnvelope size={16} />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[2px] mb-4">
            Features
          </h3>

          <div className="space-y-2 text-[11px] uppercase text-gray-400">
            <p className="hover:text-[#F3AB0C] cursor-pointer">Text Summarizer</p>
            <p className="hover:text-[#F3AB0C] cursor-pointer">Interactive Chat</p>
            <p className="hover:text-[#F3AB0C] cursor-pointer">Visual Mind Maps</p>

          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[2px] mb-4">
            FOUNDING TEAM
          </h3>

          <div className="space-y-2 text-[11px] uppercase text-gray-400">
            <p className="hover:text-[#2BB4A0] cursor-pointer">
              Pushkar Pandey
            </p>
            <p className="hover:text-[#2BB4A0] cursor-pointer">
              Yuvaraj Mishra
            </p>
            <p className="hover:text-[#2BB4A0] cursor-pointer">
              Satyam Yadav
            </p>
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[2px] mb-4">
            Legal
          </h3>

          <div className="space-y-2 text-[11px] uppercase text-gray-400">
            <p className="hover:text-[#97002E] cursor-pointer">
              Privacy Policy
            </p>
            <p className="hover:text-[#97002E] cursor-pointer">
              Terms of Service
            </p>
            <p className="hover:text-[#97002E] cursor-pointer">
              Cookie Policy
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}