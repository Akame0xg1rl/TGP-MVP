import axios from "axios";

export const instance = axios.create({
  // baseURL: "https://bookztron-server.vercel.app/api",
  baseURL : "http://127.0.0.1:5000/api",
  headers: {
    "X-Access-Token": localStorage.getItem("access_token"),
  },
});
