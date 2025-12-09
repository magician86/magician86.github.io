function initMap() {
  const container = document.getElementById('map');
  if (!container || !window.L) return;
  const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(loc => {
      const lat = Number(loc.latitude);
      const lon = Number(loc.longitude);
      if (!isFinite(lat) || !isFinite(lon)) return;
      const text = [loc.city, loc.region, loc.country_name].filter(Boolean).join(', ');
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(text || 'Your location');
      map.setView([lat, lon], 4);
    })
    .catch(() => {});
}

document.addEventListener('DOMContentLoaded', initMap);
