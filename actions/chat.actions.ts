"use server";
import axios from "axios";

export const fetchChats = async (token: string) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/chat`,
      config
    );
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
