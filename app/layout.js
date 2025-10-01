export const metadata = {
  title: "Liputan Binongko",
  description: "Portal berita sederhana dengan Next.js di Termux",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head />
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <header className="w-full bg-blue-700 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">Liputan Binongko</h1>
        </header>

        <main className="container mx-auto p-4">
          {children}
        </main>

        <footer className="w-full bg-gray-800 text-gray-200 p-4 text-center">
          <p>© {new Date().getFullYear()} Liputan Binongko. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
