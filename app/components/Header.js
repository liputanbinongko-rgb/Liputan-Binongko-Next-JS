"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <Link href="/login" className="btn">Login</Link>
        <Link href="/register" className="btn">Daftar</Link>
      </div>

      <h1>Liputan Binongko</h1>

      <nav className="auth-buttons">
        <Link href="/" className="active">Beranda</Link>
        <Link href="/profil">Profil</Link>
        <Link href="/kontak">Kontak</Link>
        <Link href="/tentang">Tentang</Link>
      </nav>
    </header>
  );
}
