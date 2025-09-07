import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

// Elemen DOM
const beritaContainer = document.getElementById("berita-list");
const cariInput = document.getElementById("cariInput");
const cariBtn = document.getElementById("cariBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let allBerita = [];
let currentIndex = 0;
let autoSlideInterval;
let slideTimeout;

// === Fungsi Tampilkan Berita Terbaru (5) ===
function tampilkanBerita(beritaList) {
  beritaContainer.innerHTML = "";

  if (beritaList.length === 0) {
    beritaContainer.innerHTML = "<p>Tidak ada berita ditemukan.</p>";
    return;
  }

  beritaList.slice(0, 5).forEach((berita, index) => {
    const div = document.createElement("div");
    div.classList.add("berita-card");

    const url = `berita.html?id=${berita.id || index}`;
    const gambarHTML = berita.fileURL
      ? `<a href="${url}"><img src="${berita.fileURL}" alt="Gambar Berita" /></a>`
      : `<a href="${url}"><img src="img/default.jpg" alt="Gambar Default" /></a>`;

    div.innerHTML = `
      ${gambarHTML}
      <h3>
        <a href="${url}" class="berita-card-title">
          ${berita.judul || "Tanpa Judul"}
        </a>
      </h3>
      <p class="views-info">(${berita.views || 0}x dilihat)</p>
    `;

    beritaContainer.appendChild(div);
  });

  startAutoSlide();
}

// === Fungsi Tampilkan Berita Lainnya (mulai dari ke-6 dst) ===
function tampilkanBeritaLainnya(beritaList) {
  let sectionLainnya = document.getElementById("berita-lainnya");
  if (!sectionLainnya) {
    sectionLainnya = document.createElement("section");
    sectionLainnya.id = "berita-lainnya";
    sectionLainnya.innerHTML = `
      <h2 class="Berita-Lainnya">Berita Lainnya</h2>
      <div id="berita-lainnya-list"></div>
    `;
    const sectionBerita = document.getElementById("berita");
    sectionBerita.insertAdjacentElement("afterend", sectionLainnya);
  }

  const lainnyaContainer = document.getElementById("berita-lainnya-list");
  lainnyaContainer.innerHTML = "";

  beritaList.slice(5).forEach((berita, index) => {
    const div = document.createElement("div");
    div.classList.add("berita-lainnya-card");

    const url = `berita.html?id=${berita.id || index}`;
    div.innerHTML = `
      <a href="${url}" class="berita-card-title">${berita.judul || "Tanpa Judul"}</a>
      <p class="views-info">(${berita.views || 0}x dilihat)</p>
    `;

    lainnyaContainer.appendChild(div);
  });
}

// === Fungsi Tampilkan Berita Populer (berdasarkan views) ===
function tampilkanBeritaPopuler(beritaList) {
  let populerSection = document.getElementById("berita-populer");
  if (!populerSection) {
    populerSection = document.createElement("section");
    populerSection.id = "berita-populer";
    populerSection.innerHTML = `
      <h2 class="Berita-Populer">Berita Populer</h2>
      <div id="berita-populer-list"></div>
    `;
    const sectionLainnya = document.getElementById("berita-lainnya") || document.getElementById("berita");
    sectionLainnya.insertAdjacentElement("afterend", populerSection);
  }

  const populerContainer = document.getElementById("berita-populer-list");
  populerContainer.innerHTML = "";

  const populer = [...beritaList].sort((a, b) => (b.views || 0) - (a.views || 0));

  populer.slice(0, 5).forEach((berita, index) => {
    const div = document.createElement("div");
    div.classList.add("berita-populer-item");

    const url = `berita.html?id=${berita.id || index}`;
    div.innerHTML = `
      <a href="${url}" class="berita-card-title">
        ${berita.judul || "Tanpa Judul"}
      </a>
      <p class="views-info">(${berita.views || 0}x dilihat)</p>
    `;

    populerContainer.appendChild(div);
  });
}

// === Load Berita dari Firebase ===
function loadBerita() {
  beritaContainer.innerHTML = "<p>Memuat berita...</p>";

  const beritaRef = ref(db, "berita");
  onValue(beritaRef, (snapshot) => {
    if (!snapshot.exists()) {
      beritaContainer.innerHTML = "<p>Belum ada berita.</p>";
      return;
    }

    const data = snapshot.val();

    allBerita = Object.entries(data)
      .map(([key, value]) => ({
        id: key,
        ...value,
      }))
      // 🔹 Filter hanya berita yang sudah disetujui admin
      .filter((berita) => berita.status === "approved")
      .sort((a, b) => {
        const aDate = new Date(a.tanggal || 0);
        const bDate = new Date(b.tanggal || 0);
        return bDate - aDate;
      });

    tampilkanBerita(allBerita);        // 5 terbaru
    tampilkanBeritaLainnya(allBerita); // berita lainnya
    tampilkanBeritaPopuler(allBerita); // berita populer
  });
}

// === Fungsi Slider Otomatis ===
function goToSlide(index) {
  const container = beritaContainer;
  const cards = document.querySelectorAll(".berita-card");
  if (cards.length === 0) return;

  if (index >= cards.length) index = 0;
  if (index < 0) index = cards.length - 1;
  currentIndex = index;

  const card = cards[currentIndex];
  container.scrollTo({
    left: card.offsetLeft,
    behavior: "smooth"
  });
}

function nextSlide() {
  goToSlide(currentIndex + 1);
}

function prevSlide() {
  goToSlide(currentIndex - 1);
}

function startAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 2000);
}

// Tombol manual
nextBtn.addEventListener("click", () => {
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  prevSlide();
  startAutoSlide();
});

// Fungsi pencarian
cariBtn.addEventListener("click", () => {
  const keyword = cariInput.value.trim().toLowerCase();
  if (!keyword) {
    tampilkanBerita(allBerita);
    tampilkanBeritaLainnya(allBerita);
    tampilkanBeritaPopuler(allBerita);
    return;
  }

  const hasil = allBerita.filter((berita) =>
    berita.judul?.toLowerCase().includes(keyword)
  );

  tampilkanBerita(hasil);
  tampilkanBeritaLainnya(hasil);
  tampilkanBeritaPopuler(hasil);
});

// Tekan Enter juga memicu pencarian
cariInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    cariBtn.click();
  }
});

// Jalankan saat halaman dimuat
loadBerita();