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
  loadAvatar().then(src => {
    let img = el.querySelector('img');
    const isPlaceholder = img && (img.src || '').includes('placehold.co');
    if (img) {
      if (isPlaceholder) img.src = src;
    } else {
      img = document.createElement('img');
      img.src = src;
      el.insertBefore(img, el.firstChild);
    }
    el.appendChild(badge);
  }).catch(() => {
    el.appendChild(badge);
  });
}

function loadAvatar() {
  const candidates = [
    'assets/images/avatar.jpg',
    'assets/images/avatar.png',
    'assets/images/avatar.jpeg',
    'assets/images/avatar.webp'
  ];
  const fallback = 'https://placehold.co/240x240?text=Avatar';
  return new Promise((resolve) => {
    let i = 0;
    function tryNext() {
      if (i >= candidates.length) { resolve(fallback); return; }
      const url = candidates[i++];
      const image = new Image();
      image.onload = () => resolve(url);
      image.onerror = () => tryNext();
      image.src = url + '?cache-bust=' + Date.now();
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
