// Set current year and last modified date in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  const lastModifiedP = document.getElementById('lastModified');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastModifiedP) lastModifiedP.textContent = `Last Modified: ${document.lastModified}`;

  // Directory page logic
  if (document.getElementById('members-container')) {
    loadMembers();
    setupViewToggle();
  }

  // Home page logic
  if (document.getElementById('spotlight-container')) {
    loadSpotlights();
  }

  if (document.getElementById('current-temp')) {
    loadWeather();
  }
});

async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error('Error loading members:', error);
  }
}

function displayMembers(members) {
  const container = document.getElementById('members-container');
  if (!container) return;

  container.innerHTML = '';

  members.forEach(member => {
    const card = document.createElement('article');
    card.className = 'member-card';

    const img = document.createElement('img');
    img.src = `images/${member.image}`;
    img.alt = `${member.name} logo`;
    card.appendChild(img);

    const name = document.createElement('h3');
    name.textContent = member.name;
    card.appendChild(name);

    const address = document.createElement('p');
    address.textContent = member.address;
    card.appendChild(address);

    const phone = document.createElement('p');
    phone.textContent = `Phone: ${member.phone}`;
    card.appendChild(phone);

    const website = document.createElement('p');
    const link = document.createElement('a');
    link.href = member.website;
    link.textContent = 'Website';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    website.appendChild(link);
    card.appendChild(website);

    const membership = document.createElement('p');
    let level = '';
    switch (member.membershipLevel) {
      case 1: level = 'Member'; break;
      case 2: level = 'Silver'; break;
      case 3: level = 'Gold'; break;
      default: level = 'Member';
    }
    membership.textContent = `Membership: ${level}`;
    card.appendChild(membership);

    container.appendChild(card);
  });
}

function setupViewToggle() {
  const gridBtn = document.getElementById('gridView');
  const listBtn = document.getElementById('listView');
  const container = document.getElementById('members-container');

  if (!gridBtn || !listBtn || !container) return;

  gridBtn.addEventListener('click', () => {
    container.classList.add('grid');
    container.classList.remove('list');
  });

  listBtn.addEventListener('click', () => {
    container.classList.add('list');
    container.classList.remove('grid');
  });
}

// ---------------------- SPOTLIGHTS ----------------------
async function loadSpotlights() {
  try {
    const response = await fetch('data/members.json');
    const members = await response.json();

    const eligible = members.filter(m =>
      m.membershipLevel === 2 || m.membershipLevel === 3
    );

    const shuffled = eligible.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    selected.forEach(member => {
      const card = document.createElement('article');
      card.className = 'member-card';

      const img = document.createElement('img');
      img.src = `images/${member.image}`;
      img.alt = `${member.name} logo`;
      card.appendChild(img);

      const name = document.createElement('h3');
      name.textContent = member.name;
      card.appendChild(name);

      const phone = document.createElement('p');
      phone.textContent = `Phone: ${member.phone}`;
      card.appendChild(phone);

      const address = document.createElement('p');
      address.textContent = member.address;
      card.appendChild(address);

      const website = document.createElement('a');
      website.href = member.website;
      website.target = '_blank';
      website.rel = 'noopener noreferrer';
      website.textContent = 'Visit Website';
      card.appendChild(website);

      const level = document.createElement('p');
      level.textContent = `Membership: ${member.membershipLevel === 3 ? 'Gold' : 'Silver'}`;
      card.appendChild(level);

      container.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading spotlights:', error);
  }
}

// ---------------------- WEATHER ----------------------
async function loadWeather() {
  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
  const city = 'Gulu';
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},UG&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Today's weather
    const temp = Math.round(data.list[0].main.temp);
    const desc = data.list[0].weather[0].description;
    document.getElementById('current-temp').textContent = `${temp}°C`;
    document.getElementById('weather-desc').textContent = desc;

    // Forecast: next 3 days at 12:00:00
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    const forecastDays = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    forecastDays.slice(0, 3).forEach(day => {
      const date = new Date(day.dt_txt);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const temp = Math.round(day.main.temp);

      const div = document.createElement('div');
      div.innerHTML = `<strong>${dayName}</strong>: ${temp}°C`;
      forecastContainer.appendChild(div);
    });

  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}
