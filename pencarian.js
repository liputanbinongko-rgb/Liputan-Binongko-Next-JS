const inputCari = document.getElementById("cariInput");

inputCari?.addEventListener("input", () => {
  const keyword = inputCari.value.toLowerCase();
  const cards = document.querySelectorAll(".berita-card");

  cards.forEach(card => {
    const judul = card.querySelector("h2").textContent.toLowerCase();
    const isi = card.querySelector("p").textContent.toLowerCase();

    if (judul.includes(keyword) || isi.includes(keyword)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
});