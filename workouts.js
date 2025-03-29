// DOM Elements
const workoutGrid = document.getElementById('workout-grid');
const filterBtn = document.getElementById('filter-btn');
const searchInput = document.querySelector('.search-box input');
const tabs = document.querySelectorAll('.tab');

// Sample Data
const workoutData = [
    {
        id: 1,
        title: "Upper Body Strength",
        category: "Strength",
        duration: 45,
        exercises: 8,
        image: "images/workout-upper-body.jpg"
    },
    {
        id: 2,
        title: "Morning Run",
        category: "Cardio",
        duration: 30,
        exercises: 1,
        image: "images/workout-running.jpg"
    },
    {
        id: 3,
        title: "Full Body HIIT",
        category: "HIIT",
        duration: 25,
        exercises: 12,
        image: "images/workout-hiit.jpg"
    },
    {
        id: 4,
        title: "Leg Day",
        category: "Strength",
        duration: 50,
        exercises: 7,
        image: "images/workout-legs.jpg"
    },
    {
        id: 5,
        title: "Core Crusher",
        category: "Strength",
        duration: 20,
        exercises: 6,
        image: "images/workout-core.jpg"
    },
    {
        id: 6,
        title: "Cycling Session",
        category: "Cardio",
        duration: 45,
        exercises: 1,
        image: "images/workout-cycling.jpg"
    }
];

// Initialize
function init() {
    renderWorkouts(workoutData);
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Category tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Filter workouts by category
            const category = tab.dataset.category;
            filterWorkouts(category);
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// Filter workouts by category
function filterWorkouts(category) {
    if (category === 'all') {
        renderWorkouts(workoutData);
    } else {
        const filtered = workoutData.filter(workout => 
            workout.category.toLowerCase() === category.toLowerCase()
        );
        renderWorkouts(filtered);
    }
}

// Handle search input
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        // If search is empty, respect the current category filter
        const activeTab = document.querySelector('.tab.active');
        const category = activeTab.dataset.category;
        filterWorkouts(category);
    } else {
        // Filter by search term
        const filtered = workoutData.filter(workout => 
            workout.title.toLowerCase().includes(searchTerm) ||
            workout.category.toLowerCase().includes(searchTerm)
        );
        renderWorkouts(filtered);
    }
}

// Render workouts to the grid
function renderWorkouts(workouts) {
    workoutGrid.innerHTML = '';
    
    if (workouts.length === 0) {
        workoutGrid.innerHTML = '<div class="no-results">No workouts found</div>';
        return;
    }
    
    workouts.forEach(workout => {
        const workoutCard = document.createElement('div');
        workoutCard.className = 'workout-card';
        
        let typeClass = 'badge-blue';
        if (workout.category === 'Cardio') typeClass = 'badge-green';
        if (workout.category === 'HIIT') typeClass = 'badge-orange';
        
        workoutCard.innerHTML = `
            <div class="workout-image">
                <img src="${workout.image}" alt="${workout.title}">
                <div class="workout-overlay">
                    <span class="badge ${typeClass}">${workout.category}</span>
                </div>
            </div>
            <div class="workout-card-content">
                <h3>${workout.title}</h3>
                <div class="workout-card-meta">
                    <span>${workout.duration} min</span>
                    <span>${workout.exercises} exercises</span>
                </div>
            </div>
        `;
        
        workoutGrid.appendChild(workoutCard);
    });
}

// Format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);