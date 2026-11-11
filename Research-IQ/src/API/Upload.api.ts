import axios from "axios";
import { BASE_URL } from "./BASE_URL";

export const sendPdf = async (
    file: File,
    signal?: AbortSignal
) => {
    const URL = BASE_URL + "/upload-paper";

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
        URL,
        formData,
        {
            signal,
        }
    );

    localStorage.setItem("paper_id", response.data.paper_id);

    return response.data;
};