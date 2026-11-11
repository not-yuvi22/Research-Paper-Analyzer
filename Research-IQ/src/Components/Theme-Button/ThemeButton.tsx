import React, {  useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { ThemeContextData } from "../../Context/ThemeContext";

// type Theme = "light" | "dark";


// interface Props {
//     mode?: useContext(ThemeContextData);

// }

const ThemeButton: React.FC = () => {
    const { theme, setTheme } = useContext(ThemeContextData);

    // const [theme, setTheme] = useState(mode)
    return (
        <div
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
            className={` cursor-pointer relative w-[72px] h-[30px] rounded-full border-[1.8px] border-[#C89A3C]  flex items-center justify-between px-2 shadow-[0_0_25px_rgba(212,175,55,.25)] ${theme=='light'?"bg-[#E9D6B4]":"bg-black"} `}>

            <FontAwesomeIcon
                icon={faMoon}
                className={`text-[12px] ${theme === "light"
                    ? "text-gray-500 transition delay-300 ease-in-out"
                    : " text-[#D4AF37] transition delay-300 ease-in-out"
                    }`}
            />

            <div
                onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                }
                className={` w-[17px] h-[17px] rounded-full border-[1.5px]
                border-[#D4AF37] bg-[#15181F] flex items-center justify-center
                `}
            >
                <div className="w-[9px] h-[9px] rounded-full bg-[#F2E6CF]" />
            </div>

            <FontAwesomeIcon
                icon={faSun}
                className={`text-[12px] ${theme === "light"
                    ? "text-[#D4AF37] transition delay-300 ease-in-out"
                    : "text-gray-500 transition delay-300 ease-in-out"
                    }`}
            />

        </div>
    );
};

export default ThemeButton;