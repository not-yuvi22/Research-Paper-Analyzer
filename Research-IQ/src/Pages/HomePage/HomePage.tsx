import React, { useEffect } from "react";
// import Button from "../Components/Button/Button.tsx";
// import book from "../Images/rainbow.png";
import HeroSection from "./HeroSection.tsx";
import OurServices from "./OurServices.tsx";
import Testimonials from "./Testimonials.tsx";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {

}

const HomePage: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
   useEffect(() => {
    if (!sessionStorage.getItem("homeReloaded")) {
      sessionStorage.setItem("homeReloaded", "true");
      window.location.reload();
    } else {
      sessionStorage.removeItem("homeReloaded");
    }
  }, []);

  useEffect(() => {
    const sectionId = location.state?.scrollTo;

    if (sectionId) {
      const element = document.getElementById(sectionId);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Clear state so refresh/back doesn't scroll again
          navigate(location.pathname, {
            replace: true,
            state: {},
          });
        }, 100);
      }
    }
  }, [location, navigate]);
  return (
    <div id="home">
      <HeroSection />
      <OurServices />
      <Testimonials />
    </div>

  );
};

export default HomePage;