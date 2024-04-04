import axios from "axios";

const server = axios.create({
  baseURL: "https://localhost:3000",
  timeout: 6000000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default server;
