// DOM Elements
const goalsContainer = document.getElementById('goals-container');
const workoutsContainer = document.getElementById('workouts-container');
const addGoalBtn = document.getElementById('add-goal-btn');
const goalModal = document.getElementById('goal-modal');
const closeModal = document.querySelector('.close-modal');
const cancelGoalBtn = document.getElementById('cancel-goal');
const goalForm = document.getElementById('goal-form');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Sample Data
const goals = [
    {
        id: 1,
        title: "Bench Press",
        target: 100,
        current: 85,
        unit: "kg",
        dueDate: "2025-05-15"
    },
    {
        id: 2,
        title: "Run 5K",
        target: 25,
        current: 22,
        unit: "min",
        dueDate: "2025-04-30"
    },
    {
        id: 3,
        title: "Weekly Workouts",
        target: 5,
        current: 3,
        unit: "sessions",
        dueDate: "2025-04-10"
    }
];

const workouts = [
    {
        id: 1,
        title: "Upper Body Strength",
        type: "Strength",
        duration: 45,
        calories: 320,
        date: "2025-03-28"
    },
    {
        id: 2,
        title: "Morning Run",
        type: "Cardio",
        duration: 30,
        calories: 280,
        date: "2025-03-27"
    },
    {
        id: 3,
        title: "Full Body HIIT",
        type: "HIIT",
        duration: 25,
        calories: 350,
        date: "2025-03-25"
    },
    {
        id: 4,
        title: "Leg Day",
        type: "Strength",
        duration: 50,
        calories: 400,
        date: "2025-03-23"
    }
];

// Event Listeners
if (addGoalBtn) {
    addGoalBtn.addEventListener('click', openGoalModal);
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

// Mobile Menu Toggle
if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Initialize the page
function init() {
    if (goalsContainer) {
        renderGoals();
    }
    
    if (workoutsContainer) {
        renderWorkouts();
    }
    
    if (document.getElementById('workout-chart')) {
        initWorkoutChart();
    }
}

// Render Goals
function renderGoals() {
    goalsContainer.innerHTML = '';
    
    goals.forEach(goal => {
        const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);
        let progressClass = 'low';
        
        if (progress >= 70) {
            progressClass = 'high';
        } else if (progress >= 30) {
            progressClass = 'medium';
        }
        
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = `
            <div class="goal-header">
                <h4 class="goal-title">${goal.title}</h4>
                <span class="goal-due">Due ${formatDate(goal.dueDate)}</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill ${progressClass}" style="width: ${progress}%"></div>
                </div>
            </div>
            <div class="progress-header">
                <span>${goal.current} / ${goal.target} ${goal.unit}</span>
                <span>${progress}%</span>
            </div>
        `;
        
        goalsContainer.appendChild(goalElement);
    });
}

// Render Workouts
function renderWorkouts() {
    workoutsContainer.innerHTML = '';
    
    workouts.forEach(workout => {
        const workoutElement = document.createElement('div');
        workoutElement.className = 'workout-item';
        
        let typeClass = 'badge-blue';
        if (workout.type === 'Cardio') typeClass = 'badge-green';
        if (workout.type === 'HIIT') typeClass = 'badge-orange';
        
        workoutElement.innerHTML = `
            <div class="workout-info">
                <div class="workout-icon">
                    <img src="images/dumbbell.svg" alt="Workout icon">
                </div>
                <div class="workout-details">
                    <h4>${workout.title}</h4>
                    <div class="workout-meta">
                        <span class="badge ${typeClass}">${workout.type}</span>
                        <div>
                            <img src="images/calendar.svg" alt="Calendar">
                            ${formatDate(workout.date)}
                        </div>
                    </div>
                </div>
            </div>
            <div class="workout-stats">
                <div>
                    <img src="images/clock.svg" alt="Clock">
                    ${workout.duration} min
                </div>
                <div>
                    <img src="images/flame.svg" alt="Flame">
                    ${workout.calories} cal
                </div>
            </div>
        `;
        
        workoutsContainer.appendChild(workoutElement);
    });
}

// Format Date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
        id: goals.length + 1,
        title: document.getElementById('goal-title').value,
        target: parseFloat(document.getElementById('goal-target').value),
        current: parseFloat(document.getElementById('goal-current').value),
        unit: document.getElementById('goal-unit').value,
        dueDate: document.getElementById('goal-date').value
    };
    
    goals.push(newGoal);
    renderGoals();
    closeGoalModal();
}

// Initialize Workout Chart
function initWorkoutChart() {
    const canvas = document.getElementById('workout-chart');
    const ctx = canvas.getContext('2d');
    
    // Sample data for the past 7 days
    const data = [35, 45, 30, 65, 40, 55, 70];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    const chartWidth = canvas.width;
    const chartHeight = canvas.height;
    const padding = 40;
    const graphWidth = chartWidth - (padding * 2);
    const graphHeight = chartHeight - (padding * 2);
    
    // Clear the canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#374151';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, chartHeight - padding);
    ctx.lineTo(chartWidth - padding, chartHeight - padding);
    ctx.stroke();
    
    // Find the max value
    const maxValue = Math.max(...data) * 1.1;
    
    // Draw horizontal grid lines
    const gridCount = 5;
    ctx.beginPath();
    ctx.strokeStyle = '#1f2937';
    ctx.setLineDash([5, 5]);
    
    for (let i = 1; i <= gridCount; i++) {
        const y = chartHeight - padding - ((graphHeight / gridCount) * i);
        ctx.moveTo(padding, y);
        ctx.lineTo(chartWidth - padding, y);
        ctx.stroke();
        
        // Add y-axis labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round((maxValue / gridCount) * i), padding - 10, y + 4);
    }
    
    ctx.setLineDash([]);
    
    // Draw bars
    const barWidth = (graphWidth / data.length) * 0.6;
    const barSpacing = (graphWidth / data.length) * 0.4;
    
    for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / maxValue) * graphHeight;
        const x = padding + ((barWidth + barSpacing) * i) + (barSpacing / 2);
        const y = chartHeight - padding - barHeight;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, 0, chartHeight - padding);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#1d4ed8');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Add rounded corners to the top
        const radius = 4;
        ctx.moveTo(x, y + radius);
        ctx.arcTo(x, y, x + radius, y, radius);
        ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
        ctx.arcTo(x + barWidth, chartHeight - padding, x + barWidth - radius, chartHeight - padding, 0);
        ctx.arcTo(x, chartHeight - padding, x, chartHeight - padding - radius, 0);
        ctx.closePath();
        ctx.fill();
        
        // Add x-axis labels
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + (barWidth / 2), chartHeight - padding + 15);
        
        // Add value on top of the bar
        ctx.fillStyle = '#f9fafb';
        ctx.fillText(data[i].toString(), x + (barWidth / 2), y - 5);
    }
}

// Call init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);