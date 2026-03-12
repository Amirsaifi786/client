import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANoFJ7ipxj7UuFWpbNd56MQNpzgh5Gh88",
  authDomain: "roomrent-app.firebaseapp.com",
  projectId: "roomrent-app",
  storageBucket: "roomrent-app.firebasestorage.app",
  messagingSenderId: "279053952443",
  appId: "1:279053952443:web:8556bb6f77553e1e52109e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);