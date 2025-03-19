document.addEventListener("DOMContentLoaded", () => {
  const studiesGrid = document.querySelector("#studies-container");
  if (studiesGrid) {
    loadStudies();
  }

  // Gestion des filtres
  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        const category = button.textContent.trim();
        filterStudies(category);
      });
    });
  }

  // Gestion de la recherche d'études
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterStudiesBySearch(searchTerm);
    });
  }
});

function loadStudies() {
  const studies = [
    {
      title: "Impact de l'IA sur l'Économie Mondiale 2024-2030",
      date: "Février 2024",
      excerpt:
        "Une analyse approfondie de l'impact transformationnel de l'IA sur les différents secteurs économiques. Quels seront les secteurs les plus touchés ? Quelles opportunités et quels risques pour l'emploi ?",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      category: "Analyses Sectorielles",
    },
    {
      title: "Politique Monétaire BCE : Bilan et Perspectives",
      date: "Janvier 2024",
      excerpt:
        "Étude détaillée des décisions de la BCE et de leurs implications pour la zone euro. Analyse des taux directeurs, des programmes de rachat d'actifs et des perspectives pour 2024-2025.",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800",
      category: "Pol. Éco",
    },
    {
      title: "Le Marché Immobilier Européen en 2024",
      date: "Janvier 2024",
      excerpt:
        "Analyse complète du marché immobilier européen : tendances des prix, impact des taux d'intérêt, nouvelles réglementations et prévisions par pays et segments de marché.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      category: "Études de Marché",
    },
    {
      title: "Transition Énergétique : Impacts Économiques",
      date: "Décembre 2023",
      excerpt:
        "Évaluation des coûts et opportunités liés à la transition énergétique pour les entreprises et les États. Focus sur les investissements nécessaires et les secteurs en transformation.",
      image:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
      category: "Analyses Sectorielles",
    },
    {
      title: "Commerce International : Nouvelles Routes de la Soie",
      date: "Décembre 2023",
      excerpt:
        "Décryptage des enjeux économiques et géopolitiques des nouvelles routes de la soie. Impact sur les échanges commerciaux et les relations internationales.",
      image:
        "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=800",
      category: "Pol. Eco",
    },
    {
      title: "L'Industrie du Luxe : Perspectives 2024-2025",
      date: "Novembre 2023",
      excerpt:
        "Analyse approfondie du marché du luxe : tendances de consommation, stratégies des grands groupes, nouveaux marchés et défis du digital.",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      category: "Études de Marché",
    },
  ];

  const studiesGrid = document.querySelector("#studies-container");
  studiesGrid.innerHTML = "";

  studies.forEach((study) => {
    const studyElement = document.createElement("div");
    studyElement.innerHTML = createStudyCard(study);
    studiesGrid.appendChild(studyElement.firstElementChild);
  });
}

function createStudyCard(study) {
  return `
    <div class="studies-card">
      <div class="article-image">
        <img src="${study.image}" alt="${study.title}" loading="lazy">
        <span class="category-tag">${study.category}</span>
        <button class="brief-button" data-title="${study.title}">
          <i class="fas fa-lightbulb"></i> En bref !
        </button>
      </div>
      <div class="article-content">
        <h3>${study.title}</h3>
        <p class="date"><i class="far fa-calendar-alt"></i> ${study.date}</p>
        <p class="excerpt">${study.excerpt}</p>
        <span class="read-more">Lire l'étude complète <i class="fas fa-arrow-right"></i></span>
      </div>
    </div>
  `;
}

function filterStudiesBySearch(searchTerm) {
  const studies = document.querySelectorAll(".studies-card");

  studies.forEach((study) => {
    const title = study.querySelector("h3").textContent.toLowerCase();
    const excerpt = study.querySelector(".excerpt").textContent.toLowerCase();
    const category = study
      .querySelector(".category-tag")
      .textContent.toLowerCase();

    if (
      title.includes(searchTerm) ||
      excerpt.includes(searchTerm) ||
      category.includes(searchTerm)
    ) {
      study.style.display = "flex";
    } else {
      study.style.display = "none";
    }
  });
}

function filterStudies(category) {
  const searchTerm =
    document.querySelector(".search-bar input")?.value.toLowerCase() || "";
  const studies = document.querySelectorAll(".studies-card");

  studies.forEach((study) => {
    const studyCategory = study.querySelector(".category-tag").textContent;
    const title = study.querySelector("h3").textContent.toLowerCase();
    const excerpt = study.querySelector(".excerpt").textContent.toLowerCase();

    const matchesCategory =
      category.includes("Toutes") || category.includes(studyCategory);
    const matchesSearch =
      title.includes(searchTerm) ||
      excerpt.includes(searchTerm) ||
      studyCategory.toLowerCase().includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      study.style.display = "flex";
    } else {
      study.style.display = "none";
    }
  });
}
