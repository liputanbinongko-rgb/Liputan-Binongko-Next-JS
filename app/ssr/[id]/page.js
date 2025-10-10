import Image from "next/image";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

// ✅ Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHYqB77kPPJcoNfW8APKUQoh066eMGipA",
  authDomain: "portal-binongko-dad4d.firebaseapp.com",
  databaseURL:
    "https://portal-binongko-dad4d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portal-binongko-dad4d",
  storageBucket: "portal-binongko-dad4d.appspot.com",
  messagingSenderId: "582358308032",
  appId: "1:582358308032:web:9d36c636adec204ab24925",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Metadata otomatis untuk share (FB, WA, Twitter)
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `berita/${id}`));

  if (!snapshot.exists()) {
    return {
      title: "Berita tidak ditemukan | Portal Binongko",
      description: "Halaman berita ini tidak ditemukan di database.",
    };
  }

  const data = snapshot.val();
  const imageUrl = data.gambar || data.fileURL || "/fallback-image.jpg";

  return {
    title: data.judul,
    description: data.isi?.substring(0, 150) + "...",
    openGraph: {
      title: data.judul,
      description: data.isi?.substring(0, 150) + "...",
      images: [imageUrl],
      url: `https://portal-binongko.vercel.app/ssr/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.judul,
      description: data.isi?.substring(0, 150) + "...",
      images: [imageUrl],
    },
  };
}

// ✅ Halaman utama berita
export default async function Page({ params }) {
  const { id } = await params;
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `berita/${id}`));

  if (!snapshot.exists()) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Berita tidak ditemukan</h1>
        <p>Periksa kembali link atau ID berita yang kamu buka.</p>
      </div>
    );
  }

  const data = snapshot.val();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">{data.judul}</h1>

      {(data.gambar || data.fileURL) ? (
        <Image
          src={data.gambar || data.fileURL}
          alt={data.judul}
          width={800}
          height={400}
          className="rounded-lg mb-4"
          priority
        />
      ) : (
        <p className="text-gray-500 mb-4">Tidak ada gambar</p>
      )}

      <p className="leading-relaxed text-gray-800 whitespace-pre-line">
        {data.isi}
      </p>
    </div>
  );
}
