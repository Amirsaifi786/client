import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  baseURL: "http://localhost:5000/api",
});
export const IMAGE_URL = "http://localhost:5000/uploads/";

export default API;