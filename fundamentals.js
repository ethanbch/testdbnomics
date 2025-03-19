document.addEventListener("DOMContentLoaded", () => {
  loadLearningPaths();
});

function loadLearningPaths() {
  const paths = [
    {
      title: "Les bases de la monnaie",
      level: "Débutant",
      duration: "2 heures",
      modules: [
        "Histoire de la monnaie",
        "Création monétaire",
        "Politique monétaire",
      ],
      icon: "coins",
    },
    {
      title: "Comprendre l'inflation",
      level: "Intermédiaire",
      duration: "3 heures",
      modules: [
        "Causes de l'inflation",
        "Mesure de l'inflation",
        "Impact économique",
      ],
      icon: "chart-line",
    },
    {
      title: "Marchés financiers",
      level: "Avancé",
      duration: "4 heures",
      modules: ["Actions", "Obligations", "Produits dérivés"],
      icon: "chart-bar",
    },
  ];

  const pathsContainer = document.querySelector(".path-cards");
  paths.forEach((path) => {
    pathsContainer.innerHTML += createPathCard(path);
  });
}

function createPathCard(path) {
  return `
    <div class="path-card">
      <div class="path-header">
        <i class="fas fa-${path.icon}"></i>
        <div class="path-info">
          <h3>${path.title}</h3>
          <span class="path-level">${path.level} • ${path.duration}</span>
        </div>
      </div>
      <ul class="path-modules">
        ${path.modules.map((module) => `<li>${module}</li>`).join("")}
      </ul>
      <button class="start-learning">Commencer</button>
    </div>
  `;
}
