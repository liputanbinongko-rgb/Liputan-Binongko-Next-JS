"use client";

import React from "react";

export default function ShareButtons({ title }) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    const text = `Baca berita menarik ini: ${title}\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    const text = `Baca berita menarik ini: ${title}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`,
      "_blank"
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("✅ Link berhasil disalin!");
    } catch (err) {
      alert("❌ Gagal menyalin link.");
    }
  };

  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
      <button onClick={shareWhatsApp}>WhatsApp</button>
      <button onClick={shareFacebook}>Facebook</button>
      <button onClick={shareTwitter}>Twitter</button>
      <button onClick={copyLink}>Salin Link</button>
    </div>
  );
}
