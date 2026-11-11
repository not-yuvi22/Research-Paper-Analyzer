import axios from "axios";
import { BASE_URL } from "./BASE_URL";

export const getAnswers = async (
  chats: string,
  mode?: string
) => {
  const url = BASE_URL + "/chat";
  const id=localStorage.getItem("paper_id");

  const payload = {

    mode,
    question: chats,
    paper_id: id
  };

  

  const response = await axios.post(url, payload);

  

  return response.data;
};