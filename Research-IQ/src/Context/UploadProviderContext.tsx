import React, { createContext, useState } from "react";

interface UploadProviderContextType {
  pdfFile: File | null ;
  setPdfFile: React.Dispatch<React.SetStateAction<File | null>>;
}

export const UploadProviderContextData = createContext<UploadProviderContextType>(
  {} as UploadProviderContextType
);

export const UploadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <UploadProviderContextData.Provider value={{ pdfFile, setPdfFile }}>
      {children}
    </UploadProviderContextData.Provider>
  );
};