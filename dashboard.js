import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getDatabase, ref as dbRef, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

// 🔹 Konfigurasi Firebase
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
const db = getDatabase(app);

// 🔹 Elemen HTML
const uploadForm = document.getElementById("uploadForm");
const statusLogin = document.getElementById("statusLogin");
const logoutBtn = document.getElementById("logoutBtn");
const beritaSayaDiv = document.getElementById("beritaSaya");

// 🔹 Elemen modal Edit
const editModal = document.getElementById("editModal");
const editJudul = document.getElementById("editJudul");
const editIsi = document.getElementById("editIsi");
const simpanEdit = document.getElementById("simpanEdit");
const batalEdit = document.getElementById("batalEdit");

let userAktif = null;
let beritaEditId = null;

// 🔹 Tombol Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// 🔹 Konfigurasi Cloudinary
const cloudName = "ddy15mvkg";
const uploadPreset = "portal_berita";

// 🔹 Cek Login
onAuthStateChanged(auth, (user) => {
  if (user) {
    userAktif = user;
    statusLogin.textContent = `Login sebagai: ${user.email}`;
    uploadForm.querySelectorAll("input, textarea, button").forEach(el => el.disabled = false);
    loadBeritaSaya(user.uid);
  } else {
    userAktif = null;
    statusLogin.textContent = "Anda belum login. Silakan login untuk mengunggah berita.";
    uploadForm.querySelectorAll("input, textarea, button").forEach(el => el.disabled = true);
  }
});

// 🔹 Upload Berita
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!userAktif) return alert("Anda harus login terlebih dahulu.");

  const judul = document.getElementById("judul").value;
  const isi = document.getElementById("isi").value;
  const file = document.getElementById("fileUpload").files[0];

  let fileURL = "";

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.secure_url) fileURL = data.secure_url;
    } catch (err) {
      console.error("Gagal upload:", err);
      alert("Upload gagal.");
      return;
    }
  }

  const newBeritaRef = push(dbRef(db, "berita"));
  await set(newBeritaRef, {
    judul,
    isi,
    fileURL,
    tanggal: new Date().toISOString(),
    kategori: "umum",
    penulisId: userAktif.uid,
    penulisEmail: userAktif.email,
    status: "pending" // ⬅️ berita baru masuk draf dulu
  });

  alert("Berita berhasil dikirim! Menunggu persetujuan admin.");
  uploadForm.reset();
});

// 🔹 Load Berita Saya
function loadBeritaSaya(uid) {
  const beritaRef = dbRef(db, "berita");
  onValue(beritaRef, (snapshot) => {
    beritaSayaDiv.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const id = child.key;

      if (data.penulisId === uid) {
        const beritaItem = document.createElement("div");
        beritaItem.classList.add("berita-item");

        beritaItem.innerHTML = `
          <h3>${data.judul}</h3>
          <p class="isi-berita">${data.isi}</p>
          ${data.fileURL ? `<img src="${data.fileURL}" style="max-width:200px;">` : ""}
          <p><small>${new Date(data.tanggal).toLocaleString()}</small></p>
          <p><b>Status:</b> ${data.status || "pending"}</p>
          <button class="editBtn" data-id="${id}">Edit</button>
          <button class="hapusBtn" data-id="${id}">Hapus</button>
        `;
        beritaSayaDiv.appendChild(beritaItem);
      }
    });

    // 🔹 Hapus berita
    document.querySelectorAll(".hapusBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (confirm("Yakin hapus berita ini?")) {
          remove(dbRef(db, "berita/" + id));
        }
      });
    });

    // 🔹 Edit berita (modal)
    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const judulAwal = e.target.closest(".berita-item").querySelector("h3").textContent;
        const isiAwal = e.target.closest(".berita-item").querySelector(".isi-berita").textContent;

        beritaEditId = id;
        editJudul.value = judulAwal;
        editIsi.value = isiAwal;
        editModal.style.display = "flex";
      });
    });
  });
}

// 🔹 Simpan edit berita
simpanEdit.addEventListener("click", () => {
  if (beritaEditId) {
    update(dbRef(db, "berita/" + beritaEditId), {
      judul: editJudul.value,
      isi: editIsi.value,
      status: "pending" // ⬅️ kalau diedit, balik ke pending lagi
    });
    editModal.style.display = "none";
    beritaEditId = null;
  }
});

// 🔹 Batal edit
batalEdit.addEventListener("click", () => {
  editModal.style.display = "none";
  beritaEditId = null;
});