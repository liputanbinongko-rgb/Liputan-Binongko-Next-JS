import Header from "../components/Header";
import Footer from "../components/Footer";
import "../globals.css";

export const metadata = {
  title: "Kontak | Liputan Binongko",
  description:
    "Hubungi tim Liputan Binongko untuk kerjasama, kritik, saran, atau pembuatan website profesional.",
};

export default function Kontak() {
  return (
    <div className="kontak-page">
      <Header active="kontak" />

      <main className="kontak-container">
        {/* Info Section */}
        <section className="kontak-info">
          <h2>Hubungi Kami</h2>
          <p>
            Silakan hubungi <strong>Liputan Binongko</strong> untuk menyampaikan
            kritik dan saran melalui formulir di bawah ini atau lewat media
            sosial berikut:
          </p>

          <p>
            Kami juga melayani pembuatan{" "}
            <strong>website sekolah</strong>, <strong>website desa</strong>,{" "}
            <strong>website tokoh</strong>, dan{" "}
            <strong>website berita profesional</strong>. Hubungi saya untuk
            pembuatan website cepat dan sesuai kebutuhan Anda.
          </p>

          <div className="socialButtons">
            <a
              href="https://wa.me/6282320520288?text=Halo%20Arfan%2C%20saya%20tertarik%20buat%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="btnWhatsapp"
            >
              💬 WhatsApp
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61580110220140"
              target="_blank"
              rel="noopener noreferrer"
              className="btnFacebook"
            >
              📘 Facebook
            </a>
            <a
              href="mailto:liputanbinongko@gmail.com"
              className="btnGmail"
              target="_blank"
              rel="noopener noreferrer"
            >
              📧 Gmail
            </a>
          </div>
        </section>

        {/* Form Section */}
        <section className="kontak-form">
          <h2>Kirim Pesan</h2>
          <form
            action="https://formspree.io/f/meolvoqr"
            method="POST"
            className="form"
          >
            <input type="text" name="name" placeholder="Nama Anda" required />
            <input type="email" name="email" placeholder="Email Anda" required />
            <textarea
              name="message"
              placeholder="Pesan Anda"
              rows={5}
              required
            ></textarea>
            <button type="submit" className="btnSubmit">
              Kirim Pesan
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
