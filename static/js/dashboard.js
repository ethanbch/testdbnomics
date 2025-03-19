document.addEventListener("DOMContentLoaded", function () {
  // Menu mobile
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navbar.classList.toggle("mobile-active");
      menuToggle.setAttribute(
        "aria-expanded",
        menuToggle.getAttribute("aria-expanded") === "false" ? "true" : "false"
      );
    });
  }

  // Fermer le menu mobile lors d'un clic à l'extérieur
  document.addEventListener("click", (e) => {
    if (!navLinks?.contains(e.target) && !menuToggle?.contains(e.target)) {
      navLinks?.classList.remove("active");
      navbar?.classList.remove("mobile-active");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  // Fermer le menu mobile lors d'un clic sur un lien
  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      navbar.classList.remove("mobile-active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

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

  document.querySelectorAll(".chart-container").forEach((el) => {
    el.classList.add("fade-in");
    observer.observe(el);
  });

  const modernTheme = {
    paper_bgcolor: "#1e293b",
    plot_bgcolor: "#1e293b",
    font: {
      family: "Inter, sans-serif",
      color: "#f8fafc",
      size: 12,
    },
    title: {
      font: {
        family: "Inter, sans-serif",
        size: 18,
        weight: 600,
        color: "#f8fafc",
      },
    },
    xaxis: {
      gridcolor: "#334155",
      linecolor: "#334155",
      tickfont: {
        family: "Inter, sans-serif",
        color: "#f8fafc",
      },
      showgrid: true,
      title: {
        font: {
          color: "#f8fafc",
        },
      },
    },
    yaxis: {
      gridcolor: "#334155",
      linecolor: "#334155",
      tickfont: {
        family: "Inter, sans-serif",
        color: "#f8fafc",
      },
      showgrid: true,
      title: {
        font: {
          color: "#f8fafc",
        },
      },
    },
    legend: {
      bgcolor: "transparent",
      font: {
        family: "Inter, sans-serif",
        color: "#f8fafc",
      },
    },
    colorway: ["#60a5fa", "#f59e0b", "#3b82f6", "#34d399", "#ec4899"], // Nouvelles couleurs
    autosize: true,
    height: 500,
    margin: {
      l: 50,
      r: 50,
      t: 50,
      b: 50,
      pad: 4,
    },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ["sendDataToCloud", "select2d", "lasso2d"],
    toImageButtonOptions: {
      format: "png",
      filename: "graph",
      height: 500,
      width: 900,
      scale: 2,
    },
  };

  function showLoading() {
    document.querySelectorAll(".chart-container").forEach((container) => {
      if (!container.querySelector(".loading-content")) {
        const loadingContent = document.createElement("div");
        loadingContent.className = "loading-content";
        loadingContent.innerHTML = `
          <div class="loader"></div>
          <p class="loading-text">Loading data...</p>
        `;
        container.appendChild(loadingContent);
      }
      container.classList.add("loading");
    });
  }

  function hideLoading() {
    document.querySelectorAll(".chart-container").forEach((container) => {
      container.classList.remove("loading");
      const loadingContent = container.querySelector(".loading-content");
      if (loadingContent) {
        loadingContent.remove();
      }
    });
  }

  function updateChartsWithData(country) {
    showLoading();

    // Charger le fichier JSON statique
    fetch("api/data.json")
      .then((response) => response.json())
      .then((allData) => {
        const data = allData[country];
        // Graphique d'inflation
        const inflationTrace = {
          x: data.inflation.map((d) => d.Years),
          y: data.inflation.map((d) => d["Inflation rate (HICP)"]),
          type: "scatter",
          mode: "lines+markers",
          name: "Inflation",
          line: {
            shape: "spline",
            smoothing: 1.3,
            width: 3,
            color: "#60a5fa",
          },
          marker: {
            size: 8,
            color: "#60a5fa",
          },
        };

        Plotly.newPlot(
          "inflationChart",
          [inflationTrace],
          {
            ...modernTheme,
            title: `Inflation Rate - ${country}`,
            height: 500,
            autosize: true,
          },
          config
        );

        // Graphique de contribution
        const contributionData = data.contribution;
        const energyTypes = [...new Set(contributionData.map((d) => d.Energy))];
        const colors = ["#3b82f6", "#f59e0b", "#34d399", "#ec4899", "#8b5cf6"];
        const traces = energyTypes.map((energy, index) => ({
          x: contributionData
            .filter((d) => d.Energy === energy)
            .map((d) => d.Years),
          y: contributionData
            .filter((d) => d.Energy === energy)
            .map((d) => d["Total Contribution of energy to inflation rate"]),
          name: energy,
          type: "bar",
          marker: { color: colors[index % colors.length] },
        }));

        Plotly.newPlot(
          "contributionChart",
          traces,
          {
            ...modernTheme,
            title: `Energy Contribution - ${country}`,
            barmode: "stack",
          },
          config
        );

        // Graphique électricité
        const elecTraces = Object.values(
          data.electricity.reduce((acc, d) => {
            if (!acc[d.Sector]) {
              acc[d.Sector] = {
                x: [],
                y: [],
                name: d.Sector,
                type: "scatter",
                mode: "lines+markers",
                line: {
                  shape: "spline",
                  width: 3,
                  color: d.Sector === "Households" ? "#60a5fa" : "#f59e0b",
                },
                marker: {
                  size: 8,
                  color: d.Sector === "Households" ? "#60a5fa" : "#f59e0b",
                },
              };
            }
            acc[d.Sector].x.push(d.Years);
            acc[d.Sector].y.push(d["Euro per kWh"]);
            return acc;
          }, {})
        );

        Plotly.newPlot(
          "electricityChart",
          elecTraces,
          {
            ...modernTheme,
            title: `Electricity Prices - ${country}`,
            yaxis: {
              ...modernTheme.yaxis,
              title: "Euro par kWh",
            },
          },
          config
        );

        // Graphique gaz
        const gasTraces = Object.values(
          data.gas.reduce((acc, d) => {
            if (!acc[d.Sector]) {
              acc[d.Sector] = {
                x: [],
                y: [],
                name: d.Sector,
                type: "scatter",
                mode: "lines+markers",
                line: {
                  shape: "spline",
                  width: 3,
                  color: d.Sector === "Households" ? "#3b82f6" : "#34d399",
                },
                marker: {
                  size: 8,
                  color: d.Sector === "Households" ? "#3b82f6" : "#34d399",
                },
              };
            }
            acc[d.Sector].x.push(d.Years);
            acc[d.Sector].y.push(d["Euro per GJ"]);
            return acc;
          }, {})
        );

        Plotly.newPlot(
          "gasChart",
          gasTraces,
          {
            ...modernTheme,
            title: `Gas Prices - ${country}`,
            yaxis: {
              ...modernTheme.yaxis,
              title: "Euro par GJ",
            },
          },
          config
        );

        hideLoading();
      })
      .catch((error) => {
        console.error("Error:", error);
        hideLoading();
      });
  }

  // Initialisation : chargement des pays et sélection du premier
  fetch("/api/countries")
    .then((response) => response.json())
    .then((countries) => {
      const selector = document.getElementById("countrySelector");
      countries.sort().forEach((country) => {
        const option = document.createElement("option");
        option.value = country;
        option.textContent = country;
        selector.appendChild(option);
      });

      if (countries.length > 0) {
        selector.value = countries[0];
        updateChartsWithData(countries[0]);
      }
    });

  // Event listener pour le changement de pays
  document
    .getElementById("countrySelector")
    .addEventListener("change", function (e) {
      const country = e.target.value;
      if (country) {
        updateChartsWithData(country);
      }
    });
});
