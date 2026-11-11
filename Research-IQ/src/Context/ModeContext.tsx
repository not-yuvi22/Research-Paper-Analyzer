import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
} from "react";

type Mode = "paper" | "hybrid" | "explain";

type ModeContextType = {
  mode: Mode | undefined;
  setMode: React.Dispatch<React.SetStateAction<Mode | undefined>>;
};

export const ModeContextData = createContext<ModeContextType>({
  mode: undefined,
  setMode: () => {},
});

export const useMode = () => useContext(ModeContextData);

interface Props {
  children: ReactNode;
}

const ModeProvider: React.FC<Props> = ({ children }) => {
  const [mode, setMode] = useState<Mode>();

  return (
    <ModeContextData.Provider value={{ mode, setMode }}>
      {children}
    </ModeContextData.Provider>
  );
};

export default ModeProvider;