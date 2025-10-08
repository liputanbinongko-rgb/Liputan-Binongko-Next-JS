"use client";
import "../../styles/auth.css";
import { useState } from "react";
import Link from "next/link";

// Import Firebase SDK (versi modular, cocok untuk Next.js client component)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCHYqB77kPPJcoNfW8APKUQoh066eMGipA",
  authDomain: "portal-binongko-dad4d.firebaseapp.com",
  databaseURL: "https://portal-binongko-dad4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-binongko-dad4d",
  storageBucket: "portal-binongko-dad4d.appspot.com",
  messagingSenderId: "582358308032",
  appId: "1:582358308032:web:9d36c636adec204ab24925"
};

// Inisialisasi Firebase (hindari duplikat initialize)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      alert("✅ Berhasil daftar! Silahkan login.");
      window.location.href = "/login"; // arahkan ke halaman login
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Daftar Wartawan</h2>

      <form id="registerForm" onSubmit={handleSubmit}>
        <label htmlFor="fullname">Nama Lengkap</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="emailRegister"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Masukkan email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="passwordRegister"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Masukkan password"
          required
        />

        <button type="submit" id="registerBtn">
          Daftar
        </button>
      </form>

      <p>
        Sudah punya akun? <Link href="/login">Login di sini</Link>
      </p>
    </div>
  );
}
