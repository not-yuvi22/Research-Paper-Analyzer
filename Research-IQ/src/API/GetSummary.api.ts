import axios from "axios";
import { BASE_URL } from "./BASE_URL";






export const getSummary = async (signal?: AbortSignal) => {
    
    
    const paperId = localStorage.getItem("paper_id");
    
    if (!paperId) {
        throw new Error("paper_id not found");
    }
    
    const URL = `${BASE_URL}/paper/${paperId}/summary/`;
   

    try {
        const response = await axios.get(URL, {
            signal,
        });

        return response.data;
    } catch (error) {
        console.error(URL);
        throw error;
    }
};