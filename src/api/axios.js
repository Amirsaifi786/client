import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
export const IMAGE_URL = "http://localhost:5000/uploads/";

export default API;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://room-dekho-backend-5.onrender.com/api",
// });
// export const IMAGE_URL = "https://room-dekho-backend-5.onrender.com/uploads";

// export default API;  