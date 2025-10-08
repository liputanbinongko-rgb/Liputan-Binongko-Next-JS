"use client";
import { useState, useEffect } from "react";

export default function LoadingPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <p>Loading berita...</p>;

  return <div>Isi berita tampil di sini</div>;
}
