const modalRoot = document.getElementById('modal-root');

const state = {
  destinations: [],
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  filterRegion: 'all',
};

// NAV TOGGLE FUNCTIONALITY
function setupNavToggle(buttonId, navId) {
  const btn = document.getElementById(buttonId);
  const nav = document.getElementById(navId);
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true' || false;
    btn.setAttribute('aria-expanded', !expanded);
    nav.classList.toggle('open');
  });
}

// MODAL FUNCTIONALITY
function createModal(content, title) {
  // Clear existing modal if any
  modalRoot.innerHTML = '';

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.tabIndex = -1;

  const modal = document.createElement('section');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');

  const header = document.createElement('header');
  const heading = document.createElement('h2');
  heading.id = 'modal-title';
  heading.textContent = title;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.innerHTML = '&times;';

  closeBtn.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });

  header.appendChild(heading);
  header.appendChild(closeBtn);

  modal.appendChild(header);
  modal.appendChild(content);

  backdrop.appendChild(modal);
  modalRoot.appendChild(backdrop);

  // Focus trapping (basic)
  closeBtn.focus();
}

// RENDER CARDS (for Home page featured section)
function renderCards(destinations) {
  const cardsContainer = document.getElementById('cards');
  if (!cardsContainer) return;
  cardsContainer.innerHTML = '';

  destinations.slice(0, 6).forEach(dest => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;

    card.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
      <h3>${dest.name}</h3>
      <p>${dest.description}</p>
      <p class="meta"><strong>Best time:</strong> ${dest.bestTime}</p>
      <button class="fav" aria-pressed="${state.favorites.includes(dest.id)}" aria-label="Toggle favorite for ${dest.name}" data-id="${dest.id}">
        ${state.favorites.includes(dest.id) ? '★ Favorited' : '☆ Favorite'}
      </button>
    `;

    card.querySelector('button.fav').addEventListener('click', e => {
      toggleFavorite(dest.id);
      e.target.textContent = state.favorites.includes(dest.id) ? '★ Favorited' : '☆ Favorite';
      e.target.setAttribute('aria-pressed', state.favorites.includes(dest.id));
    });

    card.addEventListener('click', e => {
      // Prevent modal if favorite button clicked
      if (e.target.tagName.toLowerCase() === 'button') return;
      showDetailsModal(dest);
    });

    cardsContainer.appendChild(card);
  });
}

// RENDER LIST (for Destinations page)
function renderList(destinations) {
  const listContainer = document.getElementById('list');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  // Filter by region if needed
  const filtered = state.filterRegion === 'all'
    ? destinations
    : destinations.filter(d => d.region === state.filterRegion);

  if (filtered.length === 0) {
    listContainer.textContent = 'No destinations found for this region.';
    return;
  }

  filtered.forEach(dest => {
    const item = document.createElement('article');
    item.className = 'item';
    item.tabIndex = 0;

    item.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}" loading="lazy" />
      <h3>${dest.name}</h3>
      <p>${dest.description}</p>
      <p class="meta"><strong>Best time:</strong> ${dest.bestTime}</p>
      <button class="fav" aria-pressed="${state.favorites.includes(dest.id)}" aria-label="Toggle favorite for ${dest.name}" data-id="${dest.id}">
        ${state.favorites.includes(dest.id) ? '★ Favorited' : '☆ Favorite'}
      </button>
    `;

    item.querySelector('button.fav').addEventListener('click', e => {
      toggleFavorite(dest.id);
      e.target.textContent = state.favorites.includes(dest.id) ? '★ Favorited' : '☆ Favorite';
      e.target.setAttribute('aria-pressed', state.favorites.includes(dest.id));
      e.stopPropagation();
    });

    item.addEventListener('click', () => {
      showDetailsModal(dest);
    });

    listContainer.appendChild(item);
  });
}

function toggleFavorite(id) {
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(favId => favId !== id);
  } else {
    state.favorites.push(id);
  }
  localStorage.setItem('favorites', JSON.stringify(state.favorites));
}

// Show modal with detailed info
function showDetailsModal(dest) {
  const content = document.createElement('div');

  content.innerHTML = `
    <img src="${dest.image}" alt="${dest.name}" loading="lazy" style="max-width:100%; border-radius: 10px; margin-bottom: 1rem;" />
    <p><strong>Region:</strong> ${capitalize(dest.region)}</p>
    <p>${dest.details}</p>
  `;

  createModal(content, dest.name);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Filter handler
function setupFilter() {
  const filterSelect = document.getElementById('filter');
  if (!filterSelect) return;

  filterSelect.value = state.filterRegion;

  filterSelect.addEventListener('change', e => {
    state.filterRegion = e.target.value;
    renderList(state.destinations);
  });
}

// Clear favorites button handler
function setupClearFavorites() {
  const btn = document.getElementById('clear-favs');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (confirm('Clear all favorites?')) {
      state.favorites = [];
      localStorage.removeItem('favorites');
      renderCards(state.destinations);
      renderList(state.destinations);
    }
  });
}

async function fetchDestinations() {
  try {
    const response = await fetch('data/destinations.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    state.destinations = data;
    renderCards(state.destinations);
    renderList(state.destinations);
  } catch (error) {
    console.error('Fetch error:', error);
    alert('Sorry, failed to load destination data.');
  }
}

function updateYearFooter() {
  document.querySelectorAll('#year, #year-2, #year-3').forEach(el => {
    if (el) el.textContent = new Date().getFullYear();
  });
}

// MAIN INIT
function init() {
  updateYearFooter();

  setupNavToggle('nav-toggle', 'primary-nav');
  setupNavToggle('nav-toggle-2', 'primary-nav-2');

  setupFilter();
  setupClearFavorites();

  fetchDestinations();
}

document.addEventListener('DOMContentLoaded', init);
