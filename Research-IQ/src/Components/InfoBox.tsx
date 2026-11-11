import React, { useContext } from "react";
import { ThemeContextData } from "../Context/ThemeContext";

interface Props {
    description: React.ReactNode
    title: React.ReactNode
    button_title: React.ReactNode
    className?: string
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    button_line_color?: string;


}


const InfoBox: React.FC<Props> = ({  description, title, button_title, button_line_color = "after:bg-black", onClick, className }) => {

    const { theme } = useContext(ThemeContextData)
    return (
        <button onClick={onClick} className={`m-3 col-span-12 lg:col-span-4 group  border-4 border-black p-6  transition-all duration-300 cursor-pointer ${className}  ${theme == 'light' ? "shadow-[7px_7px_0px_#000]" : "shadow-[7px_7px_0px_#fff]"}`}>


            <h2 className=" font-mono text-lg  tracking-wide font-bold uppercase  text-center items-center">
                {title}
            </h2>


            <p className="mt-2 text-[0.8rem] leading-5 font-mono text-xs  ">
                {description}
            </p>

            <span
                className={`mt-3 inline-block uppercase relative font-mono text-sm font-bold
                    after:absolute after:left-0 after:-bottom-1 
                    after:w-0 after:transition-all group-hover:after:w-full
                    ${button_line_color}`}
                                >
                {button_title}
            </span>

        </button>
    );
};

export default InfoBox;