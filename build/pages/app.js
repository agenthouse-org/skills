const state = {
  skills: [],
  categories: [],
  query: "",
  category: "all",
  releaseTag: "",
};

const els = {
  search: document.getElementById("search"),
  stats: document.getElementById("stats"),
  filters: document.getElementById("category-filters"),
  directory: document.getElementById("directory"),
};

function titleCaseCategory(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function matches(skill) {
  if (state.category !== "all" && skill.category !== state.category) {
    return false;
  }
  const q = state.query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  const haystack = [
    skill.name,
    skill.title,
    skill.description,
    skill.category,
    skill.author,
  ]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((token) => haystack.includes(token));
}

function renderFilters() {
  const buttons = [
    { id: "all", label: "All" },
    ...state.categories.map((id) => ({ id, label: titleCaseCategory(id) })),
  ];
  els.filters.innerHTML = buttons
    .map(
      (button) => `
      <button
        type="button"
        class="filter"
        data-category="${button.id}"
        aria-pressed="${state.category === button.id}"
      >${button.label}</button>`
    )
    .join("");
}

function renderDirectory() {
  const visible = state.skills.filter(matches);
  els.stats.textContent = `${visible.length} of ${state.skills.length} skills · release ${state.releaseTag || "—"}`;

  if (!visible.length) {
    els.directory.innerHTML = `<div class="empty">No skills match that search. Try another keyword or category.</div>`;
    return;
  }

  const byCategory = new Map();
  for (const skill of visible) {
    if (!byCategory.has(skill.category)) {
      byCategory.set(skill.category, []);
    }
    byCategory.get(skill.category).push(skill);
  }

  const categoryOrder =
    state.category === "all"
      ? state.categories.filter((category) => byCategory.has(category))
      : [state.category].filter((category) => byCategory.has(category));

  els.directory.innerHTML = categoryOrder
    .map((category) => {
      const skills = byCategory.get(category);
      const cards = skills
        .map(
          (skill) => `
        <article class="skill">
          <div class="skill-top">
            <h3>${escapeHtml(skill.title)}</h3>
            <span class="version">v${escapeHtml(skill.version)}</span>
          </div>
          <p>${escapeHtml(skill.description)}</p>
          ${renderDemos(skill)}
          <div class="actions">
            <a class="button primary" href="${escapeAttr(skill.downloadUrl)}">Download ZIP</a>
            <a class="button secondary" href="${escapeAttr(skill.skillUrl)}">View files</a>
            <a class="button secondary" href="${escapeAttr(skill.releaseUrl)}">Release</a>
          </div>
        </article>`
        )
        .join("");

      return `
        <section class="category" id="category-${escapeAttr(category)}">
          <div class="category-head">
            <h2>${escapeHtml(titleCaseCategory(category))}</h2>
            <span>${skills.length} skill${skills.length === 1 ? "" : "s"}</span>
          </div>
          <div class="grid">${cards}</div>
        </section>`;
    })
    .join("");
}

function renderDemos(skill) {
  const demos = skill.demos || [];
  if (!demos.length) {
    return "";
  }
  const links = demos
    .map((demo) => {
      const label = demo.lang ? demo.lang.toUpperCase() : "Open";
      return `<a class="demo-link" href="${escapeAttr(demo.url)}" title="${escapeAttr(demo.title)}" hreflang="${escapeAttr(demo.lang)}">${escapeHtml(label)}</a>`;
    })
    .join("");
  return `<div class="demos"><span class="demos-label">Live demo</span>${links}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function bindEvents() {
  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderDirectory();
  });

  els.filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) {
      return;
    }
    state.category = button.dataset.category;
    renderFilters();
    renderDirectory();
  });
}

async function boot() {
  bindEvents();
  try {
    const response = await fetch("./skills.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    state.skills = data.skills || [];
    state.categories = data.categories || [];
    state.releaseTag = data.releaseTag || "";
    renderFilters();
    renderDirectory();
  } catch (error) {
    els.stats.textContent = "Could not load skills catalogue.";
    els.directory.innerHTML = `<div class="empty">Failed to load <code>skills.json</code>. ${escapeHtml(error.message)}</div>`;
  }
}

boot();
