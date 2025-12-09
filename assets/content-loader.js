const sections = {
  about: 'content/about.md',
  research: 'content/research.md',
  news: 'content/news.md',
  publications: 'content/publications.md',
  honors: 'content/honors.md',
  talks: 'content/talks.md',
  experience: 'content/experience.md'
};

function loadMarkdown(id, path) {
  fetch(path)
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(md => {
      const el = document.getElementById(id + '-content');
      if (el) el.innerHTML = marked.parse(md);
    })
    .catch(() => {});
}

Object.entries(sections).forEach(([id, path]) => loadMarkdown(id, path));
