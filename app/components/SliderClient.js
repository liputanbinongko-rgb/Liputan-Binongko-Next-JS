"use client";

import { useState, useEffect, useRef } from "react";

export default function SliderClient({ berita }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const beritaContainerRef = useRef(null);

  // Auto slide
  useEffect(() => {
    if (berita.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev < berita.length - 1 ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [berita]);

  // Scroll ke currentIndex
  useEffect(() => {
    if (!beritaContainerRef.current) return;
    const cards = beritaContainerRef.current.children;
    if (cards.length === 0) return;
    const card = cards[currentIndex];
    beritaContainerRef.current.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  }, [currentIndex]);

  const nextSlide = () => setCurrentIndex(prev => (prev < berita.length - 1 ? prev + 1 : 0));
  const prevSlide = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : berita.length - 1));

  return (
    <div className="berita-slider-wrapper">
      <button className="nav-btn prev" onClick={prevSlide}>&#10094;</button>
      <div className="berita-slider-container">
        <div id="berita-list" ref={beritaContainerRef}>
          {berita.map((b) => (
            <div key={b.id} className="berita-card">
              <a href={`/berita/${b.id}`}>
                <img src={b.fileURL || "/img/default.jpg"} alt={b.judul || "Gambar Berita"} />
              </a>
              <h3>
                <a href={`/berita/${b.id}`} className="berita-card-title">{b.judul || "Tanpa Judul"}</a>
              </h3>
              <p className="views-info">({b.views || 0}x dilihat)</p>
            </div>
          ))}
        </div>
      </div>
      <button className="nav-btn next" onClick={nextSlide}>&#10095;</button>
    </div>
  );
}
