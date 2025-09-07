// upload.js
import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { ref as dbRef, push, onValue, serverTimestamp, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { ref as stRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

const titleEl = document.getElementById("title");
const contentEl = document.getElementById("content");
const imageEl = document.getElementById("imageFile");
const videoEl = document.getElementById("videoFile");
const submitBtn = document.getElementById("btnSubmitPost");
const statusEl = document.getElementById("uploadStatus");
const postsList = document.getElementById("postsList");

let currentUser = null;

// Cek login dulu, simpan user
onAuthStateChanged(auth, (user) => {
  currentUser = user || null;
});

// Upload helper
async function uploadFileIfAny(file, folder, uid) {
  if (!file) return null;
  const path = `${folder}/${uid}/${Date.now()}_${file.name}`;
  const fileRef = stRef(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return url;
}

async function handleSubmit() {
  if (!currentUser) {
    alert("Anda harus login untuk mengunggah.");
    return;
  }

  const title = titleEl.value.trim();
  const content = contentEl.value.trim();
  const imageFile = imageEl.files[0] || null;
  const videoFile = videoEl.files[0] || null;

  if (!title || !content) {
    alert("Judul dan isi berita wajib diisi.");
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = "Mengunggah...";

  try {
    // Upload file (opsional)
    const [imageUrl, videoUrl] = await Promise.all([
      uploadFileIfAny(imageFile, "images", currentUser.uid),
      uploadFileIfAny(videoFile, "videos", currentUser.uid),
    ]);

    // Simpan metadata ke Realtime Database
    const postsRef = dbRef(db, "posts");
    const newPostRef = push(postsRef);
    await set(newPostRef, {
      id: newPostRef.key,
      uid: currentUser.uid,
      author: currentUser.email,
      title,
      content,
      imageUrl: imageUrl || "",
      videoUrl: videoUrl || "",
      createdAt: serverTimestamp()
    });

    statusEl.textContent = "Berhasil mengunggah berita!";
    titleEl.value = "";
    contentEl.value = "";
    if (imageEl) imageEl.value = "";
    if (videoEl) videoEl.value = "";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Gagal mengunggah: " + err.message;
  } finally {
    submitBtn.disabled = false;
  }
}

if (submitBtn) {
  submitBtn.addEventListener("click", handleSubmit);
}

// Preview list post terbaru (Realtime)
function renderPosts(posts) {
  postsList.innerHTML = "";
  // Urut kasar: serverTimestamp butuh transform, untuk sederhana tampilkan urutan push
  posts.reverse().forEach(p => {
    const item = document.createElement("div");
    item.className = "post-item";
    item.innerHTML = `
      <h3>${p.title}</h3>
      <small>oleh ${p.author || p.uid}</small>
      <p>${p.content}</p>
      ${p.imageUrl ? `<img src="${p.imageUrl}" alt="foto" style="max-width:100%;border-radius:8px;">` : ""}
      ${p.videoUrl ? `<video src="${p.videoUrl}" controls style="width:100%;border-radius:8px;"></video>` : ""}
      <hr/>
    `;
    postsList.appendChild(item);
  });
}

const postsRef = dbRef(db, "posts");
onValue(postsRef, (snapshot) => {
  const data = snapshot.val() || {};
  const arr = Object.values(data);
  renderPosts(arr);
});