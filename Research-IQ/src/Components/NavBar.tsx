import React, { useContext, useState } from "react";
import { Menu, X } from "lucide-react";
import dark_logo from "../Images/Dark-Theme-logo.png";
import light_logo from "../Images/Light-Theme-logo.png";
import ThemeButton from "./Theme-Button/ThemeButton";
import { ThemeContextData } from "../Context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import { UploadProviderContextData } from "../Context/UploadProviderContext";
import {UploadContextData} from "../Context/UploadContext";


type Theme = "light" | "dark";

interface Props {
    mode?: Theme;
}

const NavBar: React.FC<Props> = () => {
    const navigate=useNavigate();
    const location = useLocation();
    const { setPdfFile } = useContext(UploadProviderContextData);
    const {  setIsUploaded } = useContext(UploadContextData);
    

    const goToHomeSection = (sectionId: string) => {
    if (location.pathname === "/home") {
        document.getElementById(sectionId)?.scrollIntoView({
            behavior: "smooth",
        });
    } else {
        navigate("/home", {
            state: { scrollTo: sectionId },
        });
    }
    setOpen(false);
};

    const HomeFunc = () => {
    setPdfFile(null);
    setIsUploaded(false);

    if (location.pathname !== "/home") {
        navigate("/home", {
            state: { scrollTo: "home" }
        });
    } else {
        document.getElementById("home")?.scrollIntoView({
            behavior: "smooth",
        });
    }
    setOpen(false);
};
    const UploadFunc = () => {
    setPdfFile(null);
    setIsUploaded(false);

    if (location.pathname !== "/upload") {
        navigate("/upload");
    } else {
        document.getElementById("upload")?.scrollIntoView({
            behavior: "smooth",
        });
    }
    setOpen(false);
};

    const { theme } = useContext(ThemeContextData);


    const [open, setOpen] = useState(false);

    return (
        <nav className={`relative mx-2 md:mx-4 
            rounded-b-[20px] md:rounded-b-[25px]
            px-4 md:px-8
            flex items-center justify-between
            transition-all duration-300
            ${theme === "light"
                ? "bg-[#faecd3]  shadow-black "
                : "bg-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            }`}>

            {/* Logo */}
            <div onClick={()=>{HomeFunc()}}
                className={`h-auto transition-all duration-500 ease-in-out cursor-pointer
                ${open
                        ? "w-[10rem] sm:w-[13rem]"
                        : "w-[12rem] sm:w-[15rem] md:w-[18rem]"
                    }`}
            >
                <img
                    src={theme === "light" ? light_logo : dark_logo}


                    alt="Logo"
                    className="w-full object-contain transition-all duration-1000"
                />
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center">
                <a onClick={()=>{HomeFunc()}} className={`font-montserrat font-[600] tracking-[1px] uppercase text-sm border-r border-[#C89A3C] px-6  cursor-pointer transition-all duration-300
                    ${theme === "light"
                        ? "text-black hover:text-[#707070] "
                        : "text-white hover:text-[#F2E6CF]"
                    }`
                }>
                    HOME
                </a>

                <a  onClick={()=>{UploadFunc()}} className={`font-montserrat font-[600] tracking-[1px] uppercase text-sm border-r border-[#C89A3C] px-6  cursor-pointer transition-all duration-300
                ${theme === "light"
                        ? "text-black hover:text-[#707070] "
                        : "text-white hover:text-[#F2E6CF]"
                    }
                `}>
                    Upload
                </a>

                <a onClick={() => { goToHomeSection("Testimonials") }} className={`font-montserrat font-[600] tracking-[1px] uppercase text-sm border-r border-[#C89A3C] px-6  cursor-pointer  transition-all duration-300
                ${theme === "light"
                        ? "text-black hover:text-[#707070] "
                        : "text-white hover:text-[#F2E6CF]"
                    }
                `}>
                    View Testimonials
                </a>

                <a onClick={()=>{goToHomeSection("ourServices")}} className={`font-montserrat font-[600] tracking-[1px] uppercase text-sm px-6  cursor-pointer transition-all duration-300
                ${theme === "light"
                        ? "text-black hover:text-[#707070] "
                        : "text-white hover:text-[#F2E6CF]"
                    }
                `}>
                    Features
                </a>

                <ThemeButton />
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center justify-center gap-4 lg:hidden h-full">
                <ThemeButton />

                <button
                    onClick={() => setOpen(!open)}
                    className="relative w-7 h-7 flex items-center justify-center"
                >
                    <Menu
                        size={28}
                        className={`absolute  transition-all duration-300
                        ${open
                                ? "rotate-90 opacity-0"
                                : "rotate-0 opacity-100"
                            }`}
                    />

                    <X
                        size={28}
                        className={`absolute  transition-all duration-300
                        ${open
                                ? "rotate-0 opacity-100"
                                : "-rotate-90 opacity-0"
                            }`}
                    />
                </button>
            </div>

            {/* Mobile Dropdown */}
            <div
                className={`absolute top-[100%] left-0 w-full mt-3 rounded-[20px]
                 border border-[#1f1f1f]
                overflow-hidden
                transition-all duration-500 ease-in-out
                lg:hidden z-50
                ${theme=='light'?
                "bg-[#faecd3]"
                :"bg-black"
            
            }

                ${open
                        ? "max-h-[320px] opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col py-3">

                    <a onClick={()=>{HomeFunc()}}
                        className={`px-6 py-4  uppercase font-montserrat font-semibold tracking-[1px] cursor-pointer
                    
                    transition-all duration-500 delay-75
                    ${open
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-10 opacity-0"
                        }`}>
                        Dashboard
                    </a>

                    <a  onClick={()=>{UploadFunc()}}
                        className={`px-6 py-4  uppercase font-montserrat font-semibold tracking-[1px]
                    
                    transition-all duration-500 delay-150
                    ${open
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-10 opacity-0"
                        }`}>
                        Upload
                    </a>

                    <a onClick={()=>{goToHomeSection("Testimonials")}} className={`px-6 py-4  uppercase font-montserrat font-semibold tracking-[1px]
                    
                    transition-all duration-500 delay-300
                    ${open
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-10 opacity-0"
                        }`}>
                        View Testimonials
                    </a>

                    <a onClick={()=>{goToHomeSection("ourServices")}} className={`px-6 py-4 uppercase font-montserrat font-semibold tracking-[1px]
                    
                    transition-all duration-500 delay-500
                    ${open
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-10 opacity-0"
                        }`}>
                        Features
                    </a>
                </div>
            </div>
        </nav >
    );
};

export default NavBar;