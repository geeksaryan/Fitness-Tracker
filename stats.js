// DOM Elements
const activityChart = document.getElementById('activity-chart');
const distributionChart = document.getElementById('distribution-chart');
const timePeriod = document.getElementById('time-period');
const exportBtn = document.getElementById('export-btn');
const tabButtons = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const strengthMetrics = document.getElementById('strength-metrics');
const cardioMetrics = document.getElementById('cardio-metrics');
const bodyMetrics = document.getElementById('body-metrics');

// Sample Data
const strengthData = [
    {
        id: 1,
        exercise: "Bench Press",
        current: "85 kg",
        best: "90 kg",
        unit: "kg",
        lastUpdated: "Mar 25, 2025"
    },
    {
        id: 2,
        exercise: "Squat",
        current: "120 kg",
        best: "130 kg",
        unit: "kg",
        lastUpdated: "Mar 23, 2025"
    },
    {
        id: 3,
        exercise: "Deadlift",
        current: "140 kg",
        best: "150 kg",
        unit: "kg",
        lastUpdated: "Mar 20, 2025"
    }
];

const cardioData = [
    {
        id: 1,
        exercise: "5K Run",
        current: "22:30",
        best: "21:45",
        unit: "min",
        lastUpdated: "Mar 27, 2025"
    },
    {
        id: 2,
        exercise: "1 Mile Run",
        current: "6:15",
        best: "6:05",
        unit: "min",
        lastUpdated: "Mar 24, 2025"
    },
    {
        id: 3,
        exercise: "Cycling (10 miles)",
        current: "32:20",
        best: "30:15",
        unit: "min",
        lastUpdated: "Mar 22, 2025"
    }
];

const bodyData = [
    {
        id: 1,
        measurement: "Weight",
        current: "78",
        start: "85",
        unit: "kg",
        lastUpdated: "Mar 28, 2025"
    },
    {
        id: 2,
        measurement: "Body Fat",
        current: "15",
        start: "18",
        unit: "%",
        lastUpdated: "Mar 28, 2025"
    },
    {
        id: 3,
        measurement: "Waist",
        current: "84",
        start: "90",
        unit: "cm",
        lastUpdated: "Mar 28, 2025"
    }
];

// Initialize
function init() {
    renderActivityChart();
    renderDistributionChart();
    renderMetrics();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Time period change
    if (timePeriod) {
        timePeriod.addEventListener('change', () => {
            renderActivityChart();
            renderDistributionChart();
        });
    }
    
    // Export button
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${tab}-metrics`).classList.add('active');
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

// Render Metrics
function renderMetrics() {
    // Strength metrics
    strengthMetrics.innerHTML = '';
    strengthData.forEach(metric => {
        const metricCard = createMetricCard(metric, 'exercise');
        strengthMetrics.appendChild(metricCard);
    });
    
    // Cardio metrics
    cardioMetrics.innerHTML = '';
    cardioData.forEach(metric => {
        const metricCard = createMetricCard(metric, 'exercise');
        cardioMetrics.appendChild(metricCard);
    });
    
    // Body metrics
    bodyMetrics.innerHTML = '';
    bodyData.forEach(metric => {
        const metricCard = createMetricCard(metric, 'measurement');
        bodyMetrics.appendChild(metricCard);
    });
}

// Create Metric Card
function createMetricCard(metric, titleKey) {
    const metricCard = document.createElement('div');
    metricCard.className = 'metric-card';
    
    metricCard.innerHTML = `
        <div class="metric-header">
            <h4>${metric[titleKey]}</h4>
            <span class="metric-date">Last updated: ${metric.lastUpdated}</span>
        </div>
        <div class="metric-values">
            <span>Current: ${metric.current} ${metric.unit}</span>
            <span>${titleKey === 'measurement' ? 'Start' : 'Best'}: ${titleKey === 'measurement' ? metric.start : metric.best} ${metric.unit}</span>
        </div>
        <div class="metric-chart">
            Exercise progress chart
        </div>
    `;
    
    return metricCard;
}

// Render Activity Chart
function renderActivityChart() {
    if (!activityChart) return;
    
    const ctx = activityChart.getContext('2d');
    
    // Sample data for the past 30 days
    const data = [
        2, 3, 1, 0, 2, 1, 3, 2, 1, 2, 0, 1, 2, 3, 2, 
        1, 0, 2, 3, 4, 2, 3, 1, 2, 3, 2, 1, 3, 2, 3
    ];
    
    const period = timePeriod ? timePeriod.value : 'month';
    let displayData = data;
    let labels = [];
    
    // Adjust data based on selected period
    if (period === 'week') {
        displayData = data.slice(-7);
        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(day.getDate() - i);
            labels.push(day.toLocaleDateString('en-US', { weekday: 'short' }));
        }
    } else if (period === 'month') {
        displayData = data;
        for (let i = 0; i < 30; i += 3) {
            const day = new Date();
            day.setDate(day.getDate() - (29 - i));
            labels.push(day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
    } else if (period === 'quarter') {
        // In a real app, this would be 90 days of data
        displayData = [...data, ...data, ...data].slice(0, 90);
        for (let i = 0; i < 90; i += 10) {
            const day = new Date();
            day.setDate(day.getDate() - (89 - i));
            labels.push(day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
    } else if (period === 'year') {
        // In a real app, this would be 365 days of data
        displayData = Array(12).fill().map(() => Math.floor(Math.random() * 50) + 10);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels = months;
    }
    
    const chartWidth = activityChart.width;
    const chartHeight = activityChart.height;
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
    const maxValue = Math.max(...displayData) * 1.1;
    
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
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    
    displayData.forEach((value, index) => {
        const x = padding + (graphWidth / (displayData.length - 1)) * index;
        const y = chartHeight - padding - (value / maxValue) * graphHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw area under the line
    ctx.lineTo(padding + graphWidth, chartHeight - padding);
    ctx.lineTo(padding, chartHeight - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding, 0, chartHeight - padding);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw data points
    displayData.forEach((value, index) => {
        const x = padding + (graphWidth / (displayData.length - 1)) * index;
        const y = chartHeight - padding - (value / maxValue) * graphHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    
    // Draw x-axis labels
    ctx.fillStyle = '#9ca3af';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    
    const labelSpacing = Math.ceil(displayData.length / labels.length);
    labels.forEach((label, i) => {
        const index = i * labelSpacing;
        if (index < displayData.length) {
            const x = padding + (graphWidth / (displayData.length - 1)) * index;
            ctx.fillText(label, x, chartHeight - padding + 20);
        }
    });
}

// Render Distribution Chart
function renderDistributionChart() {
    if (!distributionChart) return;
    
    const ctx = distributionChart.getContext('2d');
    
    // Sample data
    const data = [
        { label: "Strength", value: 45, color: "#3b82f6" },
        { label: "Cardio", value: 30, color: "#10b981" },
        { label: "HIIT", value: 15, color: "#f59e0b" },
        { label: "Flexibility", value: 10, color: "#8b5cf6" }
    ];
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const chartWidth = distributionChart.width;
    const chartHeight = distributionChart.height;
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.7;
    
    // Clear the canvas
    ctx.clearRect(0, 0, chartWidth, chartHeight);
    
    // Draw pie chart
    let startAngle = -Math.PI / 2; // Start from top
    
    data.forEach((item) => {
        // Calculate angles
        const sliceAngle = (item.value / total) * (Math.PI * 2);
        const endAngle = startAngle + sliceAngle;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Fill slice
        ctx.fillStyle = item.color;
        ctx.fill();
        
        // Draw slice border
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Calculate label position
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        // Draw label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${item.value}%`, labelX, labelY);
        
        // Update start angle for next slice
        startAngle = endAngle;
    });
    
    // Draw legend
    const legendX = chartWidth - 120;
    const legendY = 20;
    const legendItemHeight = 25;
    
    data.forEach((item, index) => {
        const itemY = legendY + index * legendItemHeight;
        
        // Draw color box
        ctx.fillStyle = item.color;
        ctx.fillRect(legendX, itemY, 15, 15);
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 1;
        ctx.strokeRect(legendX, itemY, 15, 15);
        
        // Draw label
        ctx.fillStyle = '#d1d5db';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label, legendX + 25, itemY + 7.5);
    });
}

// Handle Export
function handleExport() {
    // alert('Statistics would be exported as CSV or PDF in a real application');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);