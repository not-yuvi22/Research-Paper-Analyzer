import React, { useContext } from "react";
import ChattingComponent from "./ChattingComponent";
import { ModeContextData } from "../Context/ModeContext";
import InfoBox from "./InfoBox";

interface Props { }

const ChatSection: React.FC<Props> = () => {

    const { mode, setMode } = useContext(ModeContextData)


    // const [mode, setMode] = useState<
    //     "paper" | "explain" | "hybrid" | null
    // >(null);

    return (


        <>
            {mode != null ? (

                <ChattingComponent />

            ) :
                <div className=" flex flex-col justify-evenly ">
                    <h1 className="font-archivo  text-2xl text-center mt-5 tracking-wider uppercase">Select the Mode</h1>
                    <InfoBox
                        className="bg-[#2BB4A0] text-black "
                        title="Paper Mode"
                        description=
                        {`Analyze the research paper in a structured way,
                            providing summary, key points, methodology, results,
                            and important findings.`}
                        button_title="Set paper Mode"
                        onClick={() => { setMode("paper") }}
                    /> <InfoBox
                        className="bg-[#F2E6CF] text-black"
                        title="Hybrid Mode"
                        description={`Combines paper analysis with AI assistance to
                                        provide deeper insights, explanations, and
                                        connections between concepts.`}
                        button_title="Set Hybrid Mode"
                        onClick={() => { setMode('hybrid') }}
                    />
                    <InfoBox
                        className="bg-[#161B22] text-white"

                        title="Explain Mode"
                        description={`Simplifies complex research content and explains it
                                        in an easy-to-understand manner for better
                                        learning.`}
                        button_title="Set Explain Mode"
                        button_line_color="after:bg-white"
                        onClick={() => { setMode('explain') }}
                    />




                </div>


            }
        </>
    );
};

export default ChatSection;