// Set current year and last modified date in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  const lastModifiedP = document.getElementById('lastModified');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  if (lastModifiedP) lastModifiedP.textContent = `Last Modified: ${document.lastModified}`;

  // Load and display members if on directory page
  if (document.getElementById('members-container')) {
    loadMembers();
    setupViewToggle();
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

  container.innerHTML = ''; // Clear previous

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
    switch(member.membershipLevel) {
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
