import React, { createContext, useState, type ReactNode } from "react";

type isUploaded = boolean;

type UploadContextType = {
    isUploaded: isUploaded;
    setIsUploaded: React.Dispatch<React.SetStateAction<isUploaded>>;

};

export const UploadContextData = createContext<UploadContextType>({
    isUploaded: false,
    setIsUploaded: () => { }
})

interface Props {
    children: ReactNode
}


const UploadContext: React.FC<Props> = ({ children }) => {
    const [isUploaded, setIsUploaded] = useState(false)
    return (
        <UploadContextData.Provider value={{ isUploaded, setIsUploaded }}>
            {children}
        </UploadContextData.Provider>



    );
};

export default UploadContext;