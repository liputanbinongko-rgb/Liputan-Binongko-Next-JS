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

// ✅ Inisialisasi Firebase hanya sekali
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ✅ Halaman SSR untuk berita berdasarkan ID
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

  // ✅ Debug log (akan tampil di terminal, bisa dihapus nanti)
  console.log(`[SSR] berita id=${id} gambar=${data.gambar || data.fileURL}`);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-3">{data.judul}</h1>

      {(data.gambar || data.fileURL) ? (
        <>
          {/* ✅ Debug URL sementara di layar */}
          <p className="text-sm text-gray-500 mb-2">
            🔗 {data.gambar || data.fileURL}
          </p>

          <Image
            src={data.gambar || data.fileURL}
            alt={data.judul}
            width={800}
            height={400}
            className="rounded-lg mb-4"
            priority
          />
        </>
      ) : (
        <p className="text-gray-500 mb-4">Tidak ada gambar</p>
      )}

      <p className="leading-relaxed text-gray-800 whitespace-pre-line">
        {data.isi}
      </p>
    </div>
  );
}
