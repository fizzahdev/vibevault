const API_URL = 'http://localhost:5000/api/vibes'; // Your local backend endpoint

// DOM Elements
const vibesGrid = document.getElementById('vibesGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const vibeModal = document.getElementById('vibeModal');
const vibeForm = document.getElementById('vibeForm');

let allVibes = [];

// Fetch Vibes on Load
async function fetchVibes() {
    try {
        const response = await fetch(API_URL);
        allVibes = await response.json();
        displayVibes(allVibes);
    } catch (error) {
        console.error("Error fetching vibes (Is your backend running?):", error);
        vibesGrid.innerHTML = `<p style="color: #f472b6; text-align: center; grid-column: 1/-1;">Oops! Make sure your backend server is running on port 5000! 🛑</p>`;
    }
}

// Display Vibes in Grid
function displayVibes(vibes) {
    vibesGrid.innerHTML = '';
    if (vibes.length === 0) {
        vibesGrid.innerHTML = `<p style="color: #94a3b8; text-align: center; grid-column: 1/-1;">No vibes found in the vault yet. Add one! ✨</p>`;
        return;
    }

    vibes.forEach(vibe => {
        const card = document.createElement('div');
        card.classList.add('vibe-card');
        card.innerHTML = `
            <span>${vibe.category}</span>
            <p>"${vibe.quote}"</p>
            <h4>— ${vibe.author}</h4>
        `;
        vibesGrid.appendChild(card);
    });
}

// Filter Functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        if (category === 'all') {
            displayVibes(allVibes);
        } else {
            const filtered = allVibes.filter(v => v.category === category);
            displayVibes(filtered);
        }
    });
});

// Modal Toggles
openModalBtn.addEventListener('click', () => vibeModal.style.display = 'flex');
closeModalBtn.addEventListener('click', () => vibeModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === vibeModal) vibeModal.style.display = 'none';
});

// Handle Form Submission (Save to MongoDB via Backend)
vibeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newVibe = {
        quote: document.getElementById('quoteText').value,
        author: document.getElementById('authorText').value,
        category: document.getElementById('categorySelect').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newVibe)
        });

        if (response.ok) {
            vibeForm.reset();
            vibeModal.style.display = 'none';
            fetchVibes(); // Refresh the grid!
        }
    } catch (error) {
        console.error("Error saving vibe:", error);
    }
});

// Initial Load
fetchVibes();