// === Firebase ===
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCiNRouNsrh-XTAax4IappWwDRr6Z77n-A",
  authDomain: "web-berita-8aa1c.firebaseapp.com",
  databaseURL: "https://web-berita-8aa1c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "web-berita-8aa1c",
  storageBucket: "web-berita-8aa1c.firebasestorage.app",
  messagingSenderId: "1033366791238",
  appId: "1:1033366791238:web:12944b2c77009bce241647",
  measurementId: "G-2CZBB8QE0H"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const pesanContainer = document.getElementById("pesanContainer");
const loading = document.getElementById("loadingPesan");
const logoutBtn = document.getElementById("logoutBtn");

// Cek status login
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "auth.html";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// Utility: buat card pesan
function buatCardPesan(nama, email, pesan, waktu) {
  const tgl = waktu ? new Date(waktu) : new Date();
  return `
    <div class="pesan-item">
      <h3>${nama}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Pesan:</strong> ${pesan}</p>
      <small>${tgl.toLocaleString()}</small>
    </div>
    <hr>
  `;
}

// Ambil pesan dari Firebase
onValue(ref(db, "kontak/"), snapshot => {
  const data = snapshot.val();
  pesanContainer.innerHTML = "";

  if (data) {
    const arrPesan = Object.entries(data)
      .map(([id, val]) => ({ id, ...val }))
      .sort((a, b) => new Date(b.waktu || 0) - new Date(a.waktu || 0));

    arrPesan.forEach(item => {
      pesanContainer.innerHTML += buatCardPesan(
        item.nama || "Tanpa Nama",
        item.email || "-",
        item.pesan || "-",
        item.waktu || ""
      );
    });
  } else {
    pesanContainer.innerHTML = "<p style='color: gray;'>Belum ada pesan masuk.</p>";
  }

  loading.style.display = "none";
});