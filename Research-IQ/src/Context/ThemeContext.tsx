import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

export const ThemeContextData = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContextData);

interface Props {
  children: ReactNode;
}

const ThemeContext: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  return (
    <ThemeContextData.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContextData.Provider>
  );
};

export default ThemeContext;