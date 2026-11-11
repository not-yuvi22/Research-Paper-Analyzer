import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6">

      {/* Rainbow stripe */}
      <div className="absolute top-0 left-0 w-full h-3 flex">
        <div className="flex-1 bg-[#97002E]" />
        <div className="flex-1 bg-[#E9440A]" />
        <div className="flex-1 bg-[#F3AB0C]" />
        <div className="flex-1 bg-[#F2E6CF]" />
        <div className="flex-1 bg-[#9DD1AF]" />
        <div className="flex-1 bg-[#2BB4A0]" />
      </div>

      {/* Background glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute w-[600px] h-[600px] rounded-full bg-[#2BB4A0]/10 blur-[120px]"
      />

      <div className="relative flex flex-col items-center">

        {/* Floating 404 */}
        <motion.h1
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="
          text-[7rem]
          md:text-[10rem]
          font-black
          tracking-[10px]
          text-[#F2E6CF]
          font-archivo
          "
        >
          404
        </motion.h1>

        {/* Retro card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="
          relative
          mt-4
          bg-[#111]
          border-[4px]
          border-[#F2E6CF]
          shadow-[10px_10px_0px_black]
          px-8
          py-8
          max-w-xl
          text-center
          "
        >
          {/* Scanning line */}
          <motion.div
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
            absolute
            top-0
            h-full
            w-12
            bg-[#2BB4A0]/10
            blur-xl
            "
          />

          <h2 className="font-archivo text-3xl text-[#F3AB0C] uppercase">
            Page Not Found
          </h2>

          <p className="mt-6 text-[#F2E6CF] font-montserrat leading-7">
            The research paper you're looking for seems to have vanished into
            another dimension.
          </p>

          <p className="mt-2 text-gray-400 text-sm">
            Error Code: RESEARCH-404
          </p>

          <Link to="/">
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
              mt-8
              bg-[#F3AB0C]
              text-black
              px-8
              py-3
              border-[3px]
              border-black
              shadow-[5px_5px_0px_#F2E6CF]
              font-bold
              uppercase
              tracking-wider
              "
            >
              Return Home
            </motion.button>
          </Link>
        </motion.div>

        {/* Bottom rainbow */}
        <div className="mt-10 flex h-2 w-[300px] rounded-full overflow-hidden">
          <div className="flex-1 bg-[#97002E]" />
          <div className="flex-1 bg-[#E9440A]" />
          <div className="flex-1 bg-[#F3AB0C]" />
          <div className="flex-1 bg-[#F2E6CF]" />
          <div className="flex-1 bg-[#9DD1AF]" />
          <div className="flex-1 bg-[#2BB4A0]" />
        </div>

      </div>
    </div>
  );
}