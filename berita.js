import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ambil ID berita dari URL
const params = new URLSearchParams(location.search);
const id = params.get("id");

// Elemen detail berita
const elJudul = document.getElementById("judul");
const elTanggal = document.getElementById("tanggal");
const elPenulis = document.getElementById("penulis");
const elGambar = document.getElementById("gambar");
const elIsi = document.getElementById("isi");
const elNotFound = document.getElementById("not-found");

// Elemen daftar populer & lainnya
const elPopuler = document.getElementById("berita-populer-list");
const elLainnya = document.getElementById("berita-lainnya-list");

// === Fungsi Detail Berita ===
async function loadDetail() {
  if (!id) {
    elNotFound.style.display = "block";
    elJudul.textContent = "ID tidak ditemukan";
    return;
  }

  try {
    const beritaRef = ref(db, "berita/" + id);
    const snapshot = await get(beritaRef);

    if (!snapshot.exists()) {
      elNotFound.style.display = "block";
      elJudul.textContent = "Berita tidak ditemukan";
      return;
    }

    const data = snapshot.val();

    elJudul.textContent = data.judul || "(Tanpa Judul)";
    elTanggal.textContent = data.tanggal ? "Tanggal: " + data.tanggal : "";
    elPenulis.textContent = data.penulis ? "Penulis: " + data.penulis : "";

    if (data.fileURL) {
      elGambar.src = data.fileURL;
      elGambar.style.display = "block";
    }

    // Isi berita
    if (data.isi && /<\/?[a-z][\s\S]*>/i.test(data.isi)) {
      elIsi.innerHTML = data.isi;
    } else {
      elIsi.textContent = data.isi || "";
    }

    // Aktifkan tombol share
    setShareButtons(data.judul);

    // Ubah title tab browser
    document.title = data.judul + " - Liputan Binongko";

    // Update views
    const currentViews = data.views || 0;
    const viewsRef = ref(db, "berita/" + id + "/views");
    set(viewsRef, currentViews + 1);

  } catch (err) {
    console.error(err);
    elNotFound.style.display = "block";
    elJudul.textContent = "Gagal memuat berita";
  }
}

// === Fungsi Share Buttons ===
function setShareButtons(judul) {
  const url = window.location.href;
  const text = encodeURIComponent(judul + " - Baca selengkapnya di Liputan Binongko");
  const encodedUrl = encodeURIComponent(url);

  const shareWa   = document.getElementById("share-wa");
  const shareFb   = document.getElementById("share-fb");
  const shareTw   = document.getElementById("share-tw");
  const shareLink = document.getElementById("share-link");

  // ✅ WhatsApp pakai https://wa.me agar aman di semua browser
  if (shareWa) {
    shareWa.setAttribute("href", `https://wa.me/?text=${text}%20${encodedUrl}`);
    shareWa.setAttribute("target", "_blank");
  }

  // ✅ Facebook
  if (shareFb) {
    shareFb.setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);
    shareFb.setAttribute("target", "_blank");
  }

  // ✅ Twitter / X
  if (shareTw) {
    shareTw.setAttribute("href", `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`);
    shareTw.setAttribute("target", "_blank");
  }

  // ✅ Salin Link
  if (shareLink) {
    shareLink.onclick = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(url).then(() => {
        alert("✅ Link berita berhasil disalin!");
      });
    };
  }
}

// === Fungsi Daftar Populer & Lainnya ===
async function loadLists() {
  try {
    const beritaRef = ref(db, "berita");
    const snapshot = await get(beritaRef);

    if (!snapshot.exists()) return;

    const data = snapshot.val();
    const allBerita = Object.entries(data)
      .map(([key, value]) => ({ id: key, ...value }))
      .filter((b) => b.status === "approved");

    // === Berita Populer (urut views) ===
    const populer = [...allBerita].sort((a, b) => (b.views || 0) - (a.views || 0));
    elPopuler.innerHTML = "";
    populer.slice(0, 5).forEach((b) => {
      const div = document.createElement("div");
      div.classList.add("berita-populer-item");
      div.innerHTML = `
        <a href="berita.html?id=${b.id}">${b.judul || "Tanpa Judul"}</a>
        <p class="views-info">(${b.views || 0}x dilihat)</p>
      `;
      elPopuler.appendChild(div);
    });

    // === Berita Lainnya (urut tanggal, kecuali berita aktif) ===
    const lainnya = allBerita
      .filter((b) => b.id !== id)
      .sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));

    elLainnya.innerHTML = "";
    lainnya.slice(0, 5).forEach((b) => {
      const div = document.createElement("div");
      div.classList.add("berita-lainnya-item");
      div.innerHTML = `
        <a href="berita.html?id=${b.id}">${b.judul || "Tanpa Judul"}</a>
        <p class="views-info">(${b.views || 0}x dilihat)</p>
      `;
      elLainnya.appendChild(div);
    });

  } catch (err) {
    console.error("Gagal load list berita:", err);
  }
}

// Jalankan
loadDetail();
loadLists();