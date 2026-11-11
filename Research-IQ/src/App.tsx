import React, { useContext } from "react";
import HomePage from "./Pages/HomePage/HomePage";
import NavBar from "./Components/NavBar";
import Footer from "./Pages/HomePage/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import Error404 from "./Pages/Error404";
import ResearchPage from "./Pages/UploadPage/ResearchPage";
import { ThemeContextData } from "./Context/ThemeContext";
interface Props {

}




const App: React.FC<Props> = () => {
  const { theme } = useContext(ThemeContextData);
  // const { mode, setMode } = useContext<ModeContextData>(ModeContext)
  return (
    <div className={`${theme === "light"
      ? "bg-[#E8DFC8] text-black "
      : "bg-[#0F1117] text-[#F2E6CF] "
      }`}>

        <NavBar />
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/upload" element={<ResearchPage />} />
          <Route path="/*" element={<Error404 />} />

        </Routes>
        <Footer />
      {/* <HomePage /> */}
    </div>
  );
};

export default App;