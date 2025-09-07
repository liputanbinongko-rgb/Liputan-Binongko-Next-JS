import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
const db = getDatabase(app);

const drafContainer = document.getElementById("drafBerita");

// 🔹 Ambil semua berita
const beritaRef = ref(db, "berita"); // ⚠️ pastikan path ini sesuai di Firebase
onValue(beritaRef, (snapshot) => {
  drafContainer.innerHTML = "";

  snapshot.forEach((child) => {
    const data = child.val();
    const id = child.key;

    // amanin status biar gak peduli huruf besar/kecil
    const status = (data.status || "").toLowerCase();

    if (status === "pending") {
      const card = document.createElement("div");
      card.classList.add("berita-card");

      card.innerHTML = `
        <h3>${data.judul || "Tanpa Judul"}</h3>
        <p>${data.isi || ""}</p>
        ${data.fileURL ? `<img src="${data.fileURL}" style="max-width:200px;">` : ""}
        <p><small>${data.tanggal || ""}</small></p>
        <p><b>Status:</b> ${data.status}</p>
        <button class="setujuiBtn" data-id="${id}">Setujui</button>
        <button class="tolakBtn" data-id="${id}">Tolak</button>
      `;

      drafContainer.appendChild(card);
    }
  });

  // 🔹 Tombol Setujui
  document.querySelectorAll(".setujuiBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      update(ref(db, "berita/" + id), { status: "approved" });
    });
  });

  // 🔹 Tombol Tolak
  document.querySelectorAll(".tolakBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      remove(ref(db, "berita/" + id));
    });
  });
});