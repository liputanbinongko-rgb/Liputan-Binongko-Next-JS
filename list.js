import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

// Elemen UI
const beritaContainer = document.getElementById("beritaContainer");
const loading = document.getElementById("loading");

function createBeritaElement(key, berita) {
  const div = document.createElement("div");
  div.classList.add("berita-card");

  const tanggal = berita.tanggal
    ? new Date(berita.tanggal).toLocaleString("id-ID")
    : "Baru saja";

  const gambarHTML = berita.fileURL
    ? `<img src="${berita.fileURL}" alt="Gambar Berita" style="max-width: 100%; height: auto; margin-top: 10px;" />`
    : "";

  div.innerHTML = `
    <h2>${berita.judul || "Tanpa Judul"}</h2>
    ${gambarHTML}
    <p>${berita.isi || ""}</p>
    <small>Diposting: ${tanggal}</small>

    <div class="berita-actions" style="margin-top: 10px;">
      <button class="edit-btn">Edit</button>
      <button class="hapus-btn">Hapus</button>
    </div>
  `;

  // Hapus berita
  div.querySelector(".hapus-btn").addEventListener("click", () => {
    if (confirm(`Hapus berita "${berita.judul}"?`)) {
      remove(ref(db, `berita/${key}`))
        .then(() => alert("Berita berhasil dihapus"))
        .catch(err => alert("Gagal hapus: " + err));
    }
  });

  // Edit berita
  div.querySelector(".edit-btn").addEventListener("click", () => {
    showEditForm(div, key, berita);
  });

  return div;
}

function showEditForm(containerDiv, key, berita) {
  if (containerDiv.querySelector(".edit-form")) return;

  const form = document.createElement("form");
  form.classList.add("edit-form");
  form.innerHTML = `
    <input type="text" name="judul" value="${berita.judul || ""}" placeholder="Judul" required />
    <textarea name="isi" rows="5" placeholder="Isi berita" required>${berita.isi || ""}</textarea>
    <input type="file" name="gambar" accept="image/*" />
    <button type="submit">Simpan</button>
    <button type="button" class="cancel-btn">Batal</button>
  `;

  form.querySelector(".cancel-btn").addEventListener("click", (e) => {
    e.preventDefault();
    form.remove();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const judulBaru = form.judul.value.trim();
    const isiBaru = form.isi.value.trim();
    const file = form.gambar.files[0];

    if (!judulBaru || !isiBaru) {
      alert("Judul dan isi tidak boleh kosong!");
      return;
    }

    let fileURL = berita.fileURL || "";

    // Upload gambar baru ke Cloudinary jika ada
    if (file) {
      const cloudName = "ddy15mvkg";
      const uploadPreset = "portal_berita";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (data.secure_url) {
        fileURL = data.secure_url;
      } else {
        alert("Gagal upload gambar.");
        return;
      }
    }

    // Update ke Firebase
    update(ref(db, `berita/${key}`), {
      judul: judulBaru,
      isi: isiBaru,
      fileURL,
      updatedAt: Date.now()
    })
      .then(() => {
        alert("Berita berhasil diperbarui");
        loadBerita();
      })
      .catch((err) => {
        alert("Gagal update: " + err);
      });

    form.remove();
  });

  containerDiv.appendChild(form);
}

function loadBerita() {
  loading.style.display = "block";
  beritaContainer.innerHTML = "";

  const beritaRef = ref(db, "berita");
  onValue(beritaRef, (snapshot) => {
    beritaContainer.innerHTML = "";

    if (!snapshot.exists()) {
      beritaContainer.innerHTML = "<p>Belum ada berita.</p>";
      loading.style.display = "none";
      return;
    }

    const data = snapshot.val();

    const beritaList = Object.entries(data).sort((a, b) => {
      const aDate = a[1].tanggal || 0;
      const bDate = b[1].tanggal || 0;
      return bDate - aDate;
    }).reverse();

    beritaList.forEach(([key, berita]) => {
      const div = createBeritaElement(key, berita);
      beritaContainer.appendChild(div);
    });

    loading.style.display = "none";
  }, {
    onlyOnce: true
  });
}

// Jalankan awal
loadBerita();