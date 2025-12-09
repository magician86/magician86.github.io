const sections = {
  profile: 'content/profile.md',
  about: 'content/about.md',
  research: 'content/research.md',
  news: 'content/news.md',
  publications: 'content/publications.md',
  honors: 'content/honors.md',
  talks: 'content/talks.md',
  experience: 'content/experience.md',
  visitors: 'content/visitors.md'
};

function loadMarkdown(id, path) {
  fetch(path)
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(md => {
      const el = document.getElementById(id + '-content');
      if (el) {
        el.innerHTML = marked.parse(md);
        executeScripts(el);
        if (id === 'profile') {
          renderProfileExtras(el);
        }
      }
    })
    .catch(() => {});
}

Object.entries(sections).forEach(([id, path]) => loadMarkdown(id, path));

function renderProfileExtras(el) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date(document.lastModified || Date.now());
  const t = `Last updated: ${months[d.getMonth()]}. ${d.getFullYear()}`;
  const badge = document.createElement('div');
  badge.className = 'last-updated';
  badge.textContent = t;
  const hasImg = el.querySelector('img');
  if (!hasImg) {
    loadAvatar().then(src => {
      const img = document.createElement('img');
      img.src = src;
      el.insertBefore(img, el.firstChild);
      el.appendChild(badge);
    }).catch(() => {
      el.appendChild(badge);
    });
  } else {
    el.appendChild(badge);
  }
}

function loadAvatar() {
  const candidates = [
    'assets/images/avatar.jpg',
    'assets/images/avatar.png',
    'assets/images/avatar.jpeg',
    'assets/images/avatar.webp'
  ];
  const fallback = 'https://placehold.co/240x240?text=Avatar';
  return new Promise((resolve, reject) => {
    let i = 0;
    function tryNext() {
      if (i >= candidates.length) { resolve(fallback); return; }
      const url = candidates[i++];
      fetch(url, { method: 'HEAD' }).then(r => {
        if (r.ok) resolve(url); else tryNext();
      }).catch(() => tryNext());
    }
    tryNext();
  });
}

function executeScripts(container) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach(s => {
    const n = document.createElement('script');
    if (s.src) {
      n.src = s.src;
    } else {
      n.textContent = s.textContent;
    }
    (document.body || container).appendChild(n);
  });
}
