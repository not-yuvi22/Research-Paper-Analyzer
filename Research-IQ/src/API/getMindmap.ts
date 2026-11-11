import axios from "axios";
import { BASE_URL } from "./BASE_URL";

export const getMindmap=async () => {
  const paper_id=localStorage.getItem("paper_id");
  const payload={
    "paper_id":paper_id
  }
  const url=BASE_URL+'/mindmap';
  

  const response= await axios.post(url,payload);



  return response.data;

  
}
