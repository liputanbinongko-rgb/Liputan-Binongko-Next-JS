"use client";
import React from "react";
import "../app/globals.css"; // ✅ pakai CSS global kamu sendiri

export default function ShareButtons({ judul }) {
  const handleShare = (platform) => {
    // 🔒 Lindungi agar tidak error waktu SSR
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const text = encodeURIComponent(`${judul} - Baca selengkapnya di Liputan Binongko`);
    const encodedUrl = encodeURIComponent(url);

    let shareUrl = "";

    switch (platform) {
      case "wa":
        shareUrl = `https://wa.me/?text=${text}%20${encodedUrl}`;
        break;
      case "fb":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "tw":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`;
        break;
      case "link":
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url)
            .then(() => alert("✅ Link berita berhasil disalin!"))
            .catch(() => alert("⚠️ Gagal menyalin link, salin manual ya bosku!"));
        }
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="share-buttons">
      <p><b>Bagikan:</b></p>
      <a onClick={() => handleShare("wa")} id="share-wa">WhatsApp</a>
      <a onClick={() => handleShare("fb")} id="share-fb">Facebook</a>
      <a onClick={() => handleShare("tw")} id="share-tw">Twitter</a>
      <a onClick={() => handleShare("link")} id="share-link">Salin Link</a>
    </div>
  );
}
