(function () {
  "use strict";

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function closestSection(element) {
    return element.closest("section") || element;
  }

  function sectionTitle(section) {
    const heading = section.querySelector("h2, h3");
    return heading ? heading.textContent.trim() : "Resultado";
  }

  window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("local-search");
    const results = document.getElementById("search-results");
    if (!input || !results) return;

    const searchable = Array.from(document.querySelectorAll("main section")).map((section) => ({
      section,
      title: sectionTitle(section),
      text: normalize(section.textContent || "")
    }));

    function render() {
      const query = normalize(input.value.trim());
      if (query.length < 2) {
        results.textContent = "Digite pelo menos 2 caracteres para buscar no material offline.";
        return;
      }

      const terms = query.split(/\s+/).filter(Boolean);
      const matches = searchable
        .map((item) => ({
          item,
          score: terms.reduce((count, term) => count + (item.text.includes(term) ? 1 : 0), 0)
        }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);

      if (!matches.length) {
        results.textContent = "Nenhum resultado encontrado neste HTML.";
        return;
      }

      results.innerHTML = matches
        .map(({ item }) => {
          const id = closestSection(item.section).id;
          return `<a href="#${id}">${item.title}</a>`;
        })
        .join("");
    }

    input.addEventListener("input", render);
    render();
  });
})();
