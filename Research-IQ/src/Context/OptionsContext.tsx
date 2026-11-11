import { createContext, useContext, useState } from "react";

export const OptionsContext = createContext<any>(null);

type Options= "Mind Map" |"Summary & Chat Ai" | "Citiations Exatract" | "null"




export const OptionsProvider = ({ children }: any) => {
  const [selectedOption, setSelectedOption] = useState<Options>();

  return (
    <OptionsContext.Provider
      value={{ selectedOption, setSelectedOption }}
    >
      {children}
    </OptionsContext.Provider>
  );
};

export const useOption = () => useContext(OptionsContext);
// export default OptionProvider;