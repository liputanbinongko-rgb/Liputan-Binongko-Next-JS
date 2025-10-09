import Header from "../components/Header";
import Footer from "../components/Footer";
import "../globals.css";

export const metadata = {
  title: "Tentang | Liputan Binongko",
  description:
    "Tentang Liputan Binongko — media informasi independen dari Binongko untuk seluruh Indonesia.",
};

export default function Tentang() {
  return (
    <div className="tentang-page">
      <Header />

      <main className="tentang-container">
        <section className="tentang-content">
          <h2>Tentang Liputan Binongko</h2>
          <p>
            Liputan Binongko lahir dari kesadaran akan keterbatasan jangkauan media
            di wilayah kepulauan. Selama ini, masyarakat Binongko sering berada di
            pinggir arus informasi — suara mereka jarang sampai keluar.
          </p>
          <p>
            Dari latar belakang itu, <strong>Liputan Binongko</strong> hadir sebagai
            media online yang dekat dengan rakyat. Kami berkomitmen untuk menyajikan
            informasi jujur, terkini, dan membumi agar setiap denyut kehidupan di
            Binongko dapat tersampaikan tanpa sekat.
          </p>

          <h2>Visi</h2>
          <p>Menjadi portal berita terpercaya dan independen bagi masyarakat Binongko.</p>

          <h2>Misi</h2>
          <ul>
            <li>Menyajikan informasi akurat dan aktual.</li>
            <li>Mendorong literasi masyarakat.</li>
            <li>Menjadi jembatan aspirasi masyarakat.</li>
          </ul>

          <h2>Redaksi</h2>
          <p>
            Portal ini dikelola secara independen oleh masyarakat Binongko tanpa
            bantuan biaya dari pemerintah. Semua dikelola dengan biaya dan waktu
            pribadi demi kemajuan daerah.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
