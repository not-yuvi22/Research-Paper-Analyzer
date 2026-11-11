import React, { useContext, useEffect } from "react";
import UploadSec from "./UploadSec";
import { UploadContextData } from "../../Context/UploadContext";
// import ResponsePage from "./ResponsePage";
import  OptionsMiddleware from "../../Middleware/Options.middleware";


interface Props {

}

const ResearchPage: React.FC<Props> = () => {

    useEffect(() => {
        localStorage.removeItem("paper_id");
    }, []);
    const { isUploaded } = useContext(UploadContextData);

    

    return (

        <div>
            {isUploaded ?
                <OptionsMiddleware/>




                : <UploadSec />}


        </div>
    );
};

export default ResearchPage;