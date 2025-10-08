import "./globals.css";

export const metadata = {
  title: "Liputan Binongko",
  description:
    "Liputan Binongko, Pulau Binongko, Desa Oihu, Desa Waloindi, Kelurahan Popalia, Desa Jaya Makmur, Kelurahan Wali, Desa Onelaro, SMAN 2 Binongko, SMAN 1 Binongko - menyajikan berita terbaru seputar Binongko.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
