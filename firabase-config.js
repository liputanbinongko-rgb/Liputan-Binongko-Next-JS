// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, updateMetaTags } from "./firebase-config.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHYqB77kPPJcoNfW8APKUQoh066eMGipA",
  authDomain: "portal-binongko-dad4d.firebaseapp.com",
  databaseURL: "https://portal-binongko-dad4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-binongko-dad4d",
  storageBucket: "portal-binongko-dad4d.appspot.com",
  messagingSenderId: "582358308032",
  appId: "1:582358308032:web:9d36c636adec204ab24925"
};

// Init Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 🔹 Fungsi untuk update meta OG & Twitter Card
export function updateMetaTags(data) {
  const url = window.location.href;

  document.querySelector('meta[property="og:title"]')
    ?.setAttribute("content", data.judul || "Liputan Binongko");

  document.querySelector('meta[property="og:description"]')
    ?.setAttribute("content", (data.isi || "").substring(0, 150) + "...");

  document.querySelector('meta[property="og:image"]')
    ?.setAttribute("content", data.fileURL || "img/default.jpg");

  document.querySelector('meta[property="og:url"]')
    ?.setAttribute("content", url);

  // Twitter Card
  document.querySelector('meta[name="twitter:title"]')
    ?.setAttribute("content", data.judul || "Liputan Binongko");

  document.querySelector('meta[name="twitter:description"]')
    ?.setAttribute("content", (data.isi || "").substring(0, 150) + "...");

  document.querySelector('meta[name="twitter:image"]')
    ?.setAttribute("content", data.fileURL || "img/default.jpg");
}
