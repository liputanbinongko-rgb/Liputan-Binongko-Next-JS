// app/berita/[id]/page.js
import { notFound } from "next/navigation";
import { ref, get, set } from "firebase/database";
import { getDB } from "../../../lib/firebase";
import ShareButtons from "../../../components/ShareButtons";

// Format paragraf biar rapi
function formatParagraf(teks) {
  if (!teks) return "";
  return teks
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p, i) => <p key={i}>{p.trim()}</p>);
}

// Metadata dinamis untuk SEO & preview sosial
export async function generateMetadata({ params }) {
  const id = await params.id; // ← wajib pakai await sesuai Next.js 14+
  const db = getDB();
  const beritaRef = ref(db, "berita/" + id);
  const snapshot = await get(beritaRef);

  if (!snapshot.exists()) {
    return { title: "Berita Tidak Ditemukan - Liputan Binongko" };
  }

  const berita = snapshot.val();
  const fullUrl = `https://liputan-binongko-wo1e.vercel.app/berita/${id}`;
  const imageUrl = berita.fileURL || "/default.jpg";
  const deskripsi = berita.isi?.slice(0, 150) || "Berita terkini dari Binongko, Wakatobi";

  return {
    metadataBase: new URL("https://liputan-binongko-wo1e.vercel.app"),
    title: `${berita.judul} - Liputan Binongko`,
    description: deskripsi,
    openGraph: {
      title: berita.judul,
      description: deskripsi,
      url: fullUrl,
      siteName: "Liputan Binongko",
      type: "article",
      locale: "id_ID",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: berita.judul,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: berita.judul,
      description: deskripsi,
      images: [imageUrl],
      site: "@LiputanBinongko",
      creator: "@LiputanBinongko",
    },
  };
}

// Halaman detail berita
export default async function BeritaDetailPage({ params }) {
  const id = await params.id;
  const db = getDB();
  const beritaRef = ref(db, "berita/" + id);
  const snapshot = await get(beritaRef);

  if (!snapshot.exists()) {
    notFound();
  }

  const data = snapshot.val();

  // Update jumlah views
  const currentViews = data.views || 0;
  await set(ref(db, "berita/" + id + "/views"), currentViews + 1);

  // Ambil semua berita untuk populer & lainnya
  const semuaRef = ref(db, "berita");
  const semuaSnap = await get(semuaRef);
  const semua = semuaSnap.exists()
    ? Object.entries(semuaSnap.val()).map(([key, val]) => ({ id: key, ...val }))
    : [];

  const populer = semua
    .filter((b) => b.status === "approved")
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const lainnya = semua
    .filter((b) => b.id !== id && b.status === "approved")
    .sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0))
    .slice(0, 5);

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

        <ShareButtons judul={data.judul} />

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
