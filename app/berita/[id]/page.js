"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get, set, onValue } from "firebase/database";
import { getDB } from "../../../lib/firebase";

export default function BeritaDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [populer, setPopuler] = useState([]);
  const [lainnya, setLainnya] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const db = getDB();
    const beritaRef = ref(db, "berita/" + id);

    get(beritaRef).then((snapshot) => {
      if (!snapshot.exists()) {
        setNotFound(true);
        return;
      }

      const berita = snapshot.val();
      setData(berita);

      // Update views
      const currentViews = berita.views || 0;
      set(ref(db, "berita/" + id + "/views"), currentViews + 1);

      // Set judul tab
      document.title = `${berita.judul} - Liputan Binongko`;

      // Share buttons aktif
      setShareButtons(berita.judul);
    });

    // Ambil berita populer dan lainnya
    const semuaRef = ref(db, "berita");
    onValue(semuaRef, (snap) => {
      if (!snap.exists()) return;
      const semua = Object.entries(snap.val())
        .map(([key, val]) => ({ id: key, ...val }))
        .filter((b) => b.status === "approved");

      const populerList = [...semua].sort((a, b) => (b.views || 0) - (a.views || 0));
      setPopuler(populerList.slice(0, 5));

      const lainnyaList = semua
        .filter((b) => b.id !== id)
        .sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));
      setLainnya(lainnyaList.slice(0, 5));
    });
  }, [id]);

  function setShareButtons(judul) {
    const url = window.location.href;
    const text = encodeURIComponent(`${judul} - Baca selengkapnya di Liputan Binongko`);
    const encodedUrl = encodeURIComponent(url);

    const shareLinks = {
      wa: `https://wa.me/?text=${text}%20${encodedUrl}`,
      fb: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      tw: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`,
    };

    Object.entries(shareLinks).forEach(([id, href]) => {
      const el = document.getElementById(`share-${id}`);
      if (el) {
        el.href = href;
        el.target = "_blank";
      }
    });

    const copyBtn = document.getElementById("share-link");
    if (copyBtn) {
      copyBtn.onclick = (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(url).then(() => {
          alert("✅ Link berita berhasil disalin!");
        });
      };
    }
  }

  function formatParagraf(teks) {
    if (!teks) return "";
    return teks
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n/)
      .map((p, i) => <p key={i}>{p.trim()}</p>);
  }

  if (notFound) {
    return <main className="container"><h2>Berita tidak ditemukan</h2></main>;
  }

  if (!data) {
    return <main className="container"><p>Memuat berita...</p></main>;
  }

  return (
    <div>
      <header>
        <div className="header-top">
          <a href="/login" className="btn">Login</a>
          <a href="/register" className="btn">Daftar</a>
        </div>

        <h1>Liputan Binongko</h1>
        <div className="auth-buttons">
          <a href="/">Beranda</a>
          <a href="/profil">Profil</a>
          <a href="/kontak">Kontak</a>
          <a href="/kontak-dashboard" id="dashboardLink" style={{ display: "none" }}>
            Dashboard Kontak
          </a>
        </div>
      </header>

      <main className="container">
        <section id="detail-berita">
          <h2 id="judul">{data.judul}</h2>
          <div className="meta">
            <span id="tanggal">{data.tanggal && "Tanggal: " + data.tanggal}</span>{" "}
            <span id="penulis">{data.penulis && "Penulis: " + data.penulis}</span>
          </div>
          {data.fileURL && (
            <img id="gambar" src={data.fileURL} alt={data.judul} style={{ maxWidth: "100%" }} />
          )}
          <article id="isi" className="isi-berita">
            {formatParagraf(data.isi)}
          </article>
        </section>

        <div className="share-buttons">
          <p>Bagikan:</p>
          <a id="share-wa" href="#">WhatsApp</a>
          <a id="share-fb" href="#">Facebook</a>
          <a id="share-tw" href="#">Twitter</a>
          <a id="share-link" href="#">Salin Link</a>
        </div>

        <section id="berita-populer">
          <h2 className="Berita-Populer">Berita Populer</h2>
          <div id="berita-populer-list">
            {populer.map((b) => (
              <div key={b.id} className="berita-populer-item">
                <a href={`/berita/${b.id}`}>{b.judul}</a>
                <p className="views-info">({b.views || 0}x dilihat)</p>
              </div>
            ))}
          </div>
        </section>

        <section id="berita-lainnya">
          <h2 className="Berita-Lainnya">Berita Lainnya</h2>
          <div id="berita-lainnya-list">
            {lainnya.map((b) => (
              <div key={b.id} className="berita-lainnya-item">
                <a href={`/berita/${b.id}`}>{b.judul}</a>
                <p className="views-info">({b.views || 0}x dilihat)</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 - Liputan Binongko. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
}
