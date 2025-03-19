function addVersionToCSS() {
  const timestamp = new Date().getTime();
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (link.href.includes("style.css")) {
      const cleanHref = link.href.split("?")[0];
      link.href = `${cleanHref}?v=${timestamp}`;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  addVersionToCSS();

  // Force le rechargement du CSS
  const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
  styleSheets.forEach((styleSheet) => {
    if (styleSheet.href.includes("style.css")) {
      const newHref =
        styleSheet.href.split("?")[0] + "?v=" + new Date().getTime();
      styleSheet.href = newHref;
    }
  });

  // Gestion du formulaire newsletter
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit);
  }

  // Exemple de chargement dynamique d'articles
  const articlesGrid = document.querySelector(".articles-grid");
  if (articlesGrid) {
    loadArticles();
  }

  // Header scroll effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Animation des éléments au scroll
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".article-card, .section-title").forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  // Gestion des filtres d'articles
  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        // Ajouter la classe active au bouton cliqué
        button.classList.add("active");

        // Extraire la catégorie du texte du bouton (en ignorant l'icône)
        const categoryText = button.textContent.trim();
        filterArticles(categoryText);
      });
    });
  }

  // Gestion de la recherche d'articles
  const searchInput = document.querySelector(".search-bar input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      filterArticlesBySearch(searchTerm);
    });
  }
});

// Gestion du menu mobile
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");

  // Création du bouton hamburger
  const menuToggle = document.createElement("button");
  menuToggle.className = "menu-toggle";
  menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
  header.insertBefore(menuToggle, nav);

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.innerHTML = nav.classList.contains("active")
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Ferme le menu quand on clique sur un lien
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Ferme le menu quand on scroll
  window.addEventListener("scroll", () => {
    if (nav.classList.contains("active")) {
      nav.classList.remove("active");
      menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

const API_URL = "http://localhost:3000/api";

async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  const emailInput = form.querySelector("#email");
  const formContainer = form.parentElement;

  try {
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Inscription en cours...';

    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.querySelector("#name")?.value || "Abonné",
        email: emailInput.value,
      }),
    });

    if (!response.ok) throw new Error("Erreur réseau");

    // Remplacer tout le contenu du formulaire par le message de succès
    formContainer.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <h3>Merci pour votre inscription !</h3>
        <p>Un email de confirmation a été envoyé à ${emailInput.value}</p>
        <p class="success-details">Vous recevrez bientôt nos dernières analyses économiques.</p>
      </div>
    `;
  } catch (error) {
    console.error("Erreur:", error);
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> S\'abonner';

    // Afficher l'erreur de manière plus visible
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-circle"></i>
      <div>
        <strong>Erreur lors de l'inscription</strong>
        <p>Veuillez réessayer plus tard ou nous contacter directement.</p>
      </div>
    `;

    form.insertBefore(errorDiv, submitButton);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

function loadArticles() {
  const articles = [
    {
      title:
        "Éco en bref du 10/03/2025 - Défense Européenne, Tensions et Opportunités",
      date: "10 mars 2025",
      excerpt:
        "Une journée marquée par l'incertitude des marchés et les initiatives européennes en matière de défense, sur fond de tensions commerciales persistantes. Analyse des impacts sur les marchés financiers et perspectives économiques...",
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1600",
      category: "Éco en bref",
      url: "articles/actus-10032025.html",
    },
  ];

  const articlesGrid = document.querySelector(".articles-grid");
  articlesGrid.innerHTML = ""; // Nettoyage des articles existants

  articles.forEach((article) => {
    const articleCard = createArticleCard(article);
    articleCard.addEventListener(
      "click",
      () => (window.location.href = article.url)
    );
    articlesGrid.appendChild(articleCard);
  });
}

function createArticleCard(article) {
  const card = document.createElement("div");
  card.className = "article-card";
  card.style.cursor = "pointer";
  card.innerHTML = `
    <div class="article-image">
      <img src="${article.image}" alt="${article.title}" loading="lazy">
      <span class="category-tag">${article.category}</span>
      <button class="brief-button" data-title="${article.title}">
        <i class="fas fa-lightbulb"></i> En bref !
      </button>
    </div>
    <div class="article-content">
      <h3>${article.title}</h3>
      <p class="date"><i class="far fa-calendar-alt"></i> ${article.date}</p>
      <p class="excerpt">${article.excerpt}</p>
      <span class="read-more">Lire la suite <i class="fas fa-arrow-right"></i></span>
    </div>
  `;

  // Empêcher le clic sur le bouton "En bref" de rediriger vers l'article
  const briefButton = card.querySelector(".brief-button");
  briefButton.addEventListener("click", (e) => {
    e.stopPropagation();
    showBrief(article);
  });

  return card;
}

function showBrief(article) {
  // Création du modal
  const modal = document.createElement("div");
  modal.className = "brief-modal";
  modal.innerHTML = `
    <div class="brief-content">
      <div class="brief-header">
        <h3>${article.title}</h3>
        <button class="close-brief">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <ul class="brief-points">
        ${generateBriefPoints(article)}
      </ul>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("show-modal"), 10);

  // Gestion de la fermeture
  const closeBtn = modal.querySelector(".close-brief");
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show-modal");
    setTimeout(() => modal.remove(), 300);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show-modal");
      setTimeout(() => modal.remove(), 300);
    }
  });
}

function generateBriefPoints(article) {
  if (article.url === "articles/actus-10032025.html") {
    // Points spécifiques pour l'article d'actualité du 10/03/2025
    return [
      "Marchés en baisse : Dow Jones -2,08%, Nasdaq -4,00%, S&P 500 -2,70%",
      "Relations USA-Mexique : Suspension des taxes douanières de 25% sur les exportations mexicaines",
      "Secteur tech fortement impacté : Tesla -15,43%, Meta -4,42%, Apple -4,85%",
      "Goldman Sachs révise ses prévisions : PIB à 1,7% (vs 2,2%), risque de récession à 20%",
      "Europe : Initiative d'augmentation des dépenses de défense, notamment en Allemagne",
      "À suivre : Données d'inflation US, indicateurs chinois, réunion Eurogroupe",
    ]
      .map((point) => `<li>${point}</li>`)
      .join("");
  }

  // Pour les autres articles, utiliser les points génériques
  return [
    "Point clé 1 de l'article",
    "Point clé 2 avec plus de détails",
    "Point clé 3 sur les implications",
    "Conclusion principale",
  ]
    .map((point) => `<li>${point}</li>`)
    .join("");
}

function filterArticlesBySearch(searchTerm) {
  const articles = document.querySelectorAll(".article-card");

  articles.forEach((article) => {
    const title = article.querySelector("h3").textContent.toLowerCase();
    const excerpt = article.querySelector(".excerpt").textContent.toLowerCase();
    const category = article
      .querySelector(".category-tag")
      .textContent.toLowerCase();

    if (
      title.includes(searchTerm) ||
      excerpt.includes(searchTerm) ||
      category.includes(searchTerm)
    ) {
      article.style.display = "flex";
    } else {
      article.style.display = "none";
    }
  });
}

// Mise à jour de la fonction filterArticles pour combiner avec la recherche
function filterArticles(category) {
  const searchTerm =
    document.querySelector(".search-bar input")?.value.toLowerCase() || "";
  const articles = document.querySelectorAll(".article-card");

  articles.forEach((article) => {
    const articleCategory = article.querySelector(".category-tag").textContent;
    const title = article.querySelector("h3").textContent.toLowerCase();
    const excerpt = article.querySelector(".excerpt").textContent.toLowerCase();

    const matchesCategory =
      category.includes("Tous") || category.includes(articleCategory);
    const matchesSearch =
      title.includes(searchTerm) ||
      excerpt.includes(searchTerm) ||
      articleCategory.toLowerCase().includes(searchTerm);

    if (matchesCategory && matchesSearch) {
      article.style.display = "flex";
    } else {
      article.style.display = "none";
    }
  });
}
