document.addEventListener("DOMContentLoaded", () => {
  const items = [
    {
      image: "lp-colinha.png",
      alt: "Projeto Alpha"
    },
    {
      image: "imagem2.png",
      alt: "Projeto Beta"
    },
    {
      image: "imagem3.png",
      alt: "Projeto Gama"
    }
  ];

  let currentIndex = 0;

  const imgEl = document.getElementById("portfolio-image");
  const slides = document.querySelectorAll(".card-portfolio .slide");
  const breadcrumbsEl = document.getElementById("breadcrumbs");

  function updateContent() {
    // Atualiza a imagem e alt
    imgEl.src = items[currentIndex].image;
    imgEl.alt = items[currentIndex].alt;

    // Atualiza o slide ativo da descrição
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx === currentIndex);
    });

    // Atualiza breadcrumbs
    document.querySelectorAll("#breadcrumbs a").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function createBreadcrumbs() {
    breadcrumbsEl.innerHTML = "";
    items.forEach((_, index) => {
      const a = document.createElement("a");
      a.href = "#";
      a.setAttribute("aria-label", `Ir para o slide ${index + 1}`);
      a.addEventListener("click", (e) => {
        e.preventDefault();
        currentIndex = index;
        updateContent();
      });
      breadcrumbsEl.appendChild(a);
    });
  }

  document.getElementById("next-link").addEventListener("click", (e) => {
    e.preventDefault();
    currentIndex = (currentIndex + 1) % items.length;
    updateContent();
  });

  document.getElementById("prev-link").addEventListener("click", (e) => {
    e.preventDefault();
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateContent();
  });

  createBreadcrumbs();
  updateContent();

  // --------------------------------
  // FAQ - ABRE E FECHA
  // --------------------------------
  const faqHeaders = document.querySelectorAll(".faq-items h3");

  faqHeaders.forEach(header => {
    header.addEventListener("click", () => {
      const paragraph = header.nextElementSibling;
      const isOpen = paragraph.style.display === "block";

      // Fecha todos os parágrafos
      document.querySelectorAll(".faq-items p").forEach(p => {
        p.style.display = "none";
      });

      // Abre o clicado, se não estava aberto
      if (!isOpen) {
        paragraph.style.display = "block";
      }
    });
  });
});
