import { useState, useEffect, useRef, useContext } from "react";
import { SendHorizontal } from "lucide-react";
import { getAnswers } from "../API/Chat.api";
import { ModeContextData } from "../Context/ModeContext";
import ReactMarkdown from "react-markdown"

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
}

export default function ChattingComponent() {
    const [question, setQuestion] = useState("");
    const { mode, setMode } = useContext(ModeContextData)
    const [Disabled, setDisabled] = useState(false)



    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            content: "Hello! How can I help you?",
        },
    ]);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!question.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: question,
        };

        const thinkingMessage: Message = {
            id: Date.now() + 1,
            role: "assistant",
            content: "Thinking...",
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
            thinkingMessage,
        ]);

        const currentQuestion = question;
        setQuestion("");
        setDisabled(true)
        try {
            const response = await getAnswers(currentQuestion,mode);

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === thinkingMessage.id
                        ? {
                            ...msg,
                            content:
                                response?.response?.response ??
                                "Oops! Looks like an error, please try again.",
                        }
                        : msg
                )
            );
        } catch (error) {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === thinkingMessage.id
                        ? {
                            ...msg,
                            content: "Failed to get response.",
                        }
                        : msg
                )
            );
        } finally{
            setDisabled(false)

        }
    };

    return (
        <div className={`flex flex-col flex-1 min-h-0 h-full  overflow-hidden
            ${{
                paper: "bg-[#B8DDBE] text-black",
                explain: "bg-[#000000] text-black",
                hybrid: "bg-[#E9D6B4] text-black",
            }[mode!] || "bg-gray-400"
            }
        
        `}>
            {/* Header */}
            <div className={`shrink-0  text-black px-5 py-1 flex justify-between items-center
                     ${{
                    paper: "bg-[#9BC9A5] text-black",
                    explain: "bg-[#1A1A1A] text-white",
                    hybrid: "bg-[#D4C19F] text-black ",
                }[mode!] || "bg-gray-400"
                }
            
                  
                
                
                
                `}>
                <h1 className={`text-lg font-archivo tracking-wider uppercase ml-2


                
                    
                    `}>Chat</h1>
                <button onClick={() => setMode(undefined)} className="bg-bg-[var(--btn-bg)]
                    text-[var(--btn-text)]
                    

                    border-[3px]
                    rounded-xl
                    px-4 py-2.5
                    border-[#066E76]
                    

                    font-mono
                    text-sm
                    font-bold
                    tracking-[0.03em]

                    inline-flex
                    items-center
                    justify-center

                    shadow-[4px_4px_0_var(--btn-shadow)]

                    transition-all
                    duration-200

                    hover:-translate-x-[1px]
                    hover:-translate-y-[1px]
                    hover:shadow-[6px_6px_0_white]

                    active:translate-x-[2px]
                    active:translate-y-[2px]
                    active:shadow-[2px_2px_0_var(--btn-shadow)] uppercase cursor-pointer
                    m-2
                    hover:bg-[#1E9BA4]
                    hover:text-white
                    
                    ">Switch Modes</button>

            </div>

            {/* Messages */}
            <div
                ref={chatContainerRef}
                
                className="flex-1 max-h-[70vh]  h-[70vh]
        md:h-full overflow-y-auto p-4 space-y-4 scrollbar-none"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl break-words whitespace-pre-wrap font-mono tracking-wide  text-sm ${message.role === "user"
                                ? "bg-[#F4F0E6] text-black rounded-br-md"
                                : "bg-zinc-800 text-white rounded-bl-md"
                                }`}
                        ><ReactMarkdown>
                            {message.content}
                        </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className={`shrink-0  p-4 text-mono 
                    ${{
                            paper: "bg-[#9BC9A5] text-black",
                            explain: "bg-[#1A1A1A] text-white",
                            hybrid: "bg-[#D4C19F] ",
                        }[mode!] || "bg-gray-400"
                        }
                
                `} >
                <div className="flex gap-3">
                    <input
                        {...(Disabled ? { disabled: true } : {})}
                        type="text"
                        placeholder="Type a message..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        className={`flex-1 rounded-xl border-3 px-4 py-3 outline-none font-mono ${Disabled? "border-gray-600":""}`}
                    />

                    <button
                        onClick={sendMessage}
                        className="rounded-xl text-white bg-[#000000]  px-4 hover:bg-[#2BB4A0] hover:text-black transition"
                    >
                        <SendHorizontal size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}