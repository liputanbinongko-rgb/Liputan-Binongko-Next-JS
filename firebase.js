import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCHYqB77kPPJcoNfW8APKUQoh066eMGipA",
  authDomain: "portal-binongko-dad4d.firebaseapp.com",
  databaseURL: "https://portal-binongko-dad4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-binongko-dad4d",
  storageBucket: "portal-binongko-dad4d.appspot.com",
  messagingSenderId: "582358308032",
  appId: "1:582358308032:web:9d36c636adec204ab24925"
};

// 🔥 Hindari duplikasi inisialisasi Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Panggil database hanya saat dibutuhkan
export const getDB = () => getDatabase(app);
