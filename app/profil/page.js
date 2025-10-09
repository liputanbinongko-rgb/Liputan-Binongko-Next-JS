import Header from "../components/Header";
import Footer from "../components/Footer";
import "../globals.css";

export const metadata = {
  title: "Profil | Liputan Binongko",
  description:
    "Profil Liputan Binongko — portal berita independen dari Pulau Binongko untuk masyarakat yang haus informasi positif.",
};

export default function Profil() {
  return (
    <div className="profil-page">
      <Header />

      <main className="profil-container">
        <section className="profil-content">
          <h2>Profil Liputan Binongko</h2>
          <p>
            <strong>Liputan Binongko</strong> adalah portal berita independen
            yang hadir untuk memberikan informasi terkini, akurat, dan terpercaya
            bagi masyarakat Pulau Binongko dan sekitarnya.
          </p>
          <p>
            Kami berkomitmen menghadirkan berita yang berimbang, mengutamakan fakta,
            dan menjunjung tinggi etika jurnalistik. Berawal dari semangat membangun
            dan menginformasikan potensi daerah, kami menjadi wadah berita, informasi,
            dan promosi positif untuk masyarakat.
          </p>
          <p>
            Dengan dukungan tim penulis dan kontributor yang berdedikasi, kami
            menghadirkan berita daerah, nasional, politik, hingga isu sosial yang
            relevan, agar pembaca lebih memahami perkembangan terbaru di sekitar mereka.
          </p>

          <h2>Visi</h2>
          <p>
            Menjadi media yang mampu membangun kesadaran, memperkuat persatuan, dan
            memajukan Pulau Binongko melalui penyebaran informasi yang positif dan bermanfaat.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
