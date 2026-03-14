import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-3-vlsy.onrender.com/api",
});
export const IMAGE_URL = "https://backend-3-vlsy.onrender.com/uploads";

export default API;