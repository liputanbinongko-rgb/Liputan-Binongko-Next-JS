import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHYqB77kPPJcoNfW8APKUQoh066eMGipA",
  authDomain: "portal-binongko-dad4d.firebaseapp.com",
  databaseURL: "https://portal-binongko-dad4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-binongko-dad4d",
  storageBucket: "portal-binongko-dad4d.appspot.com",
  messagingSenderId: "582358308032",
  appId: "1:582358308032:web:9d36c636adec204ab24925"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ambil form
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault(); // cegah reload

  const email = document.getElementById("emailRegister").value;
  const password = document.getElementById("passwordRegister").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Berhasil daftar! Silahkan login.");
      window.location.href = "login.html";
    })
    .catch(err => {
      alert("❌ Error: " + err.message);
    });
});