"use client"; // wajib kalau ada event, state, Firebase
import  "../../styles/auth.css";   // ✅ import css global
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

// === Firebase Config ===
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("✅ Login berhasil! Selamat datang " + userCredential.user.email);
        router.push("/dashboard"); // redirect ke dashboard
      })
      .catch((error) => {
        alert("❌ Error: " + error.message);
      });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Login Wartawan</h2>
      <form onSubmit={handleLogin} id="loginForm">
        <label>Email</label><br />
        <input 
          type="email" 
          id="emailLogin"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <label>Password</label><br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <input 
            type={showPassword ? "text" : "password"} 
            id="passwordLogin"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span 
            style={{ marginLeft: "10px", cursor: "pointer" }}
            id="togglePassword"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <br />

        <button type="submit" id="loginBtn">Login</button>
      </form>

      <p>Belum punya akun? <a href="/register">Daftar di sini</a></p>
    </div>
  );
}
