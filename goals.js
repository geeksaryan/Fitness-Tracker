// DOM Elements
const goalsGrid = document.getElementById('goals-grid');
const newGoalBtn = document.getElementById('new-goal-btn');
const goalModal = document.getElementById('goal-modal');
const closeModal = document.querySelector('.close-modal');
const cancelGoalBtn = document.getElementById('cancel-goal');
const goalForm = document.getElementById('goal-form');
const tabs = document.querySelectorAll('.tab');

// Sample Data
const activeGoals = [
    {
        id: 1,
        title: "Bench Press Goal",
        description: "Increase maximum bench press weight",
        target: 100,
        current: 85,
        unit: "kg",
        dueDate: "2025-05-15",
        category: "Strength",
        isCompleted: false
    },
    {
        id: 2,
        title: "5K Run Time",
        description: "Improve 5K running time",
        target: 25,
        current: 22,
        unit: "min",
        dueDate: "2025-04-30",
        category: "Cardio",
        isCompleted: false
    },
    {
        id: 3,
        title: "Weekly Workout Frequency",
        description: "Maintain consistent workout schedule",
        target: 5,
        current: 3,
        unit: "sessions",
        dueDate: "2025-04-10",
        category: "Consistency",
        isCompleted: false
    },
    {
        id: 4,
        title: "Weight Loss Goal",
        description: "Reduce body weight",
        target: 10,
        current: 3,
        unit: "kg",
        dueDate: "2025-06-30",
        category: "Weight",
        isCompleted: false
    },
    {
        id: 5,
        title: "Protein Intake",
        description: "Maintain daily protein consumption",
        target: 120,
        current: 100,
        unit: "g/day",
        dueDate: "2025-04-15",
        category: "Nutrition",
        isCompleted: false
    }
];

const completedGoals = [
    {
        id: 6,
        title: "Pull-up Challenge",
        description: "Perform consecutive pull-ups",
        target: 10,
        current: 10,
        unit: "reps",
        dueDate: "2025-02-28",
        category: "Strength",
        isCompleted: true
    },
    {
        id: 7,
        title: "10K Steps Daily",
        description: "Walk 10,000 steps every day for a month",
        target: 30,
        current: 30,
        unit: "days",
        dueDate: "2025-03-15",
        category: "Cardio",
        isCompleted: true
    },
    {
        id: 8,
        title: "Squat PR",
        description: "New personal record for squats",
        target: 120,
        current: 120,
        unit: "kg",
        dueDate: "2025-01-30",
        category: "Strength",
        isCompleted: true
    }
];

// Event Listeners
function setupEventListeners() {
    if (newGoalBtn) {
        newGoalBtn.addEventListener('click', openGoalModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeGoalModal);
    }
    
    if (cancelGoalBtn) {
        cancelGoalBtn.addEventListener('click', closeGoalModal);
    }
    
    if (goalForm) {
        goalForm.addEventListener('submit', handleGoalSubmit);
    }
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Filter goals by status
            const status = tab.dataset.status;
            filterGoals(status);
        });
    });
    
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

// Initialize
function init() {
    filterGoals('active'); // Show active goals by default
    setupEventListeners();
}

// Filter goals by status
function filterGoals(status) {
    let goalsToShow = [];
    
    if (status === 'active') {
        goalsToShow = activeGoals;
    } else if (status === 'completed') {
        goalsToShow = completedGoals;
    } else if (status === 'all') {
        goalsToShow = [...activeGoals, ...completedGoals];
    }
    
    renderGoals(goalsToShow);
}

// Render goals to the grid
function renderGoals(goals) {
    goalsGrid.innerHTML = '';
    
    if (goals.length === 0) {
        goalsGrid.innerHTML = '<div class="no-results">No goals found</div>';
        return;
    }
    
    goals.forEach(goal => {
        const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
        let progressClass = 'low';
        
        if (goal.isCompleted) {
            progressClass = 'high';
        } else if (progress >= 70) {
            progressClass = 'medium';
        } else if (progress >= 30) {
            progressClass = 'medium';
        }
        
        let categoryClass = 'badge-blue';
        if (goal.category === 'Cardio') categoryClass = 'badge-green';
        if (goal.category === 'Nutrition') categoryClass = 'badge-orange';
        if (goal.category === 'Weight') categoryClass = 'badge-purple';
        
        const goalCard = document.createElement('div');
        goalCard.className = 'card';
        
        goalCard.innerHTML = `
            <div class="card-header">
                <div class="goal-header">
                    <div>
                        <span class="badge ${categoryClass}">${goal.category}</span>
                        ${goal.isCompleted ? '<span class="badge badge-green">Completed</span>' : ''}
                    </div>
                    <span class="goal-due">${goal.isCompleted ? 'Completed on' : 'Due'} ${formatDate(goal.dueDate)}</span>
                </div>
                <h3>${goal.title}</h3>
                <p>${goal.description}</p>
            </div>
            <div class="card-content">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill ${progressClass}" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="progress-header">
                    <span>${goal.current} / ${goal.target} ${goal.unit}</span>
                    <span>${progress}%</span>
                </div>
            </div>
        `;
        
        goalsGrid.appendChild(goalCard);
    });
}

// Modal Functions
function openGoalModal() {
    goalModal.classList.add('active');
}

function closeGoalModal() {
    goalModal.classList.remove('active');
    goalForm.reset();
}

// Handle Goal Form Submit
function handleGoalSubmit(e) {
    e.preventDefault();
    
    const newGoal = {
        id: activeGoals.length + completedGoals.length + 1,
        title: document.getElementById('goal-title').value,
        description: document.getElementById('goal-description').value,
        category: document.getElementById('goal-category').value,
        target: parseFloat(document.getElementById('goal-target').value),
        current: parseFloat(document.getElementById('goal-current').value),
        unit: document.getElementById('goal-unit').value,
        dueDate: document.getElementById('goal-date').value,
        isCompleted: false
    };
    
    activeGoals.push(newGoal);
    
    // Re-render the current view
    const activeTab = document.querySelector('.tab.active');
    const status = activeTab.dataset.status;
    filterGoals(status);
    
    closeGoalModal();
}

// Format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);