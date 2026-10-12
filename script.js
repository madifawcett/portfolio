// Loads everything from data.json so you only edit that file to update the site.
const $ = (id) => document.getElementById(id);
const el = (tag, props = {}, kids = []) => {
  const n = Object.assign(document.createElement(tag), props);
  kids.forEach((k) => n.append(k));
  return n;
};

let projects = [];
let activeTag = "All";

function renderProjects() {
  const list = $("project-list");
  list.replaceChildren();
  const shown = projects.filter((p) => activeTag === "All" || (p.tags || []).includes(activeTag));
  if (!shown.length) {
    list.append(el("li", { className: "empty", textContent: "No projects match this tag." }));
    return;
  }
  shown.forEach((p) => {
    const li = el("li", { className: "project" });
    if (p.image) li.append(el("img", { src: p.image, alt: p.imageAlt || `Screenshot of ${p.title}`, loading: "lazy" }));
    li.append(el("h3", { textContent: p.title }));
    li.append(el("p", { textContent: p.description }));
    if (p.tags?.length) li.append(el("ul", { className: "tags" }, p.tags.map((t) => el("li", { textContent: t }))));
    const links = el("div", { className: "links" });
    if (p.demo) links.append(el("a", { href: p.demo, textContent: "Live demo", target: "_blank", rel: "noopener" }));
    if (p.repo) links.append(el("a", { href: p.repo, textContent: "Source code", target: "_blank", rel: "noopener" }));
    if (links.children.length) li.append(links);
    list.append(li);
  });
}

function renderFilters() {
  const tags = ["All", ...new Set(projects.flatMap((p) => p.tags || []))];
  const box = $("filters");
  box.replaceChildren();
  if (tags.length < 3) return;
  tags.forEach((t) => {
    const b = el("button", { type: "button", textContent: t });
    b.setAttribute("aria-pressed", String(t === activeTag));
    b.addEventListener("click", () => { activeTag = t; renderFilters(); renderProjects(); });
    box.append(b);
  });
}

function renderFiles(files = []) {
  const list = $("file-list");
  if (!files.length) return list.append(el("li", { className: "empty", textContent: "No files yet." }));
  files.forEach((f) => list.append(el("li", {}, [
    el("a", { href: f.path, textContent: f.name, download: "" }),
    el("span", { textContent: f.note || "" }),
  ])));
}

function renderContact(contact = []) {
  contact.forEach((c) => $("contact-list").append(el("li", {}, [
    `${c.label}: `, el("a", { href: c.url, textContent: c.text, rel: "noopener" }),
  ])));
}

function setupTheme() {
  const root = document.documentElement;
  const saved = (() => { try { return localStorage.getItem("theme"); } catch { return null; } })();
  const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const apply = (d) => {
    root.dataset.theme = d ? "dark" : "light";
    $("theme").textContent = d ? "Light mode" : "Dark mode";
  };
  apply(dark);
  $("theme").addEventListener("click", () => {
    const d = root.dataset.theme !== "dark";
    apply(d);
    try { localStorage.setItem("theme", d ? "dark" : "light"); } catch {}
  });
}

function setupNavHighlight() {
  const links = [...document.querySelectorAll("nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.hash === "#" + e.target.id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll("main section").forEach((s) => io.observe(s));
}

async function init() {
  setupTheme();
  try {
    const res = await fetch("data.json");
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    document.title = `${data.name} | Portfolio`;
    $("name").textContent = data.name;
    $("footer-name").textContent = data.name;
    $("year").textContent = `© ${new Date().getFullYear()}`;
    $("tagline").textContent = data.tagline || "";
    $("about-text").textContent = data.about || "";
    projects = data.projects || [];
    renderFilters();
    renderProjects();
    renderFiles(data.files);
    renderContact(data.contact);
  } catch (err) {
    $("project-list").append(el("li", { className: "error", textContent:
      "Could not load data.json. If you opened index.html directly, run a local server (python -m http.server) instead." }));
  }
  setupNavHighlight();
}
init();
