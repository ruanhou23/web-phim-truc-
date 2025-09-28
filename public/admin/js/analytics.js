// ===== ANALYTICS MANAGEMENT =====

// Sample analytics data
const analyticsData = {
    totalViews: 125000,
    totalUsers: 2500,
    totalMovies: 150,
    avgWatchTime: 45,
    
    timeSeriesData: {
        views: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3800, 4200, 5100, 4800, 5500, 6200, 5800, 6500, 7200, 6800, 7500, 8200, 7800, 8500, 9200, 8800, 9500, 10200, 9800, 10500, 11200, 10800, 11500],
        users: [150, 200, 250, 300, 180, 220, 280, 320, 350, 380, 400, 420, 450, 480, 500, 520, 550, 580, 600, 620, 650, 680, 700, 720, 750, 780, 800, 820, 850, 880],
        movies: [5, 8, 12, 15, 10, 13, 18, 22, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 65, 68, 70, 72, 75, 78]
    },
    
    categoryData: {
        labels: ['Hành động', 'Hài', 'Tâm lý', 'Kinh dị', 'Lãng mạn', 'Khoa học viễn tưởng'],
        data: [35, 25, 20, 10, 15, 5]
    },
    
    deviceData: {
        labels: ['Desktop', 'Mobile', 'Tablet', 'TV'],
        data: [45, 40, 10, 5]
    },
    
    hourlyData: {
        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        data: [50, 30, 20, 40, 80, 120, 150, 180, 200, 250, 300, 200]
    },
    
    topMovies: [
        { name: 'Avengers: Endgame', views: 15000, rating: 8.4 },
        { name: 'Spider-Man: No Way Home', views: 12000, rating: 8.2 },
        { name: 'The Batman', views: 10000, rating: 7.8 },
        { name: 'Top Gun: Maverick', views: 9500, rating: 8.3 },
        { name: 'Black Widow', views: 8000, rating: 6.7 }
    ],
    
    topUsers: [
        { name: 'john_doe', views: 2500, joinDate: '2024-01-15' },
        { name: 'jane_smith', views: 2200, joinDate: '2024-01-10' },
        { name: 'bob_wilson', views: 1800, joinDate: '2024-01-05' },
        { name: 'alice_brown', views: 1600, joinDate: '2024-01-12' },
        { name: 'charlie_davis', views: 1400, joinDate: '2024-01-08' }
    ]
};

let currentChartType = 'views';
let timeChart, categoryChart, deviceChart, hourlyChart;

// Initialize analytics page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('timeChart')) {
        initializeAnalyticsPage();
    }
});

function initializeAnalyticsPage() {
    setupEventListeners();
    updateOverviewStats();
    initializeCharts();
    loadTopMovies();
    loadTopUsers();
}

function setupEventListeners() {
    // Date range filter
    const dateRange = document.getElementById('date-range');
    if (dateRange) {
        dateRange.addEventListener('change', handleDateRangeChange);
    }

    // Chart type buttons
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            switchChartType(type);
        });
    });

    // Export button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
}

function updateOverviewStats() {
    animateNumber(document.getElementById('total-views'), 0, analyticsData.totalViews, 2000);
    animateNumber(document.getElementById('total-users'), 0, analyticsData.totalUsers, 2000);
    animateNumber(document.getElementById('total-movies'), 0, analyticsData.totalMovies, 2000);
    animateNumber(document.getElementById('avg-watch-time'), 0, analyticsData.avgWatchTime, 2000);
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function initializeCharts() {
    initializeTimeChart();
    initializeCategoryChart();
    initializeDeviceChart();
    initializeHourlyChart();
}

function initializeTimeChart() {
    const ctx = document.getElementById('timeChart');
    if (!ctx) return;

    timeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(),
            datasets: [{
                label: 'Lượt xem',
                data: analyticsData.timeSeriesData.views,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initializeCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: analyticsData.categoryData.labels,
            datasets: [{
                data: analyticsData.categoryData.data,
                backgroundColor: [
                    '#e74c3c',
                    '#f39c12',
                    '#3498db',
                    '#8e44ad',
                    '#e91e63',
                    '#00bcd4'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function initializeDeviceChart() {
    const ctx = document.getElementById('deviceChart');
    if (!ctx) return;

    deviceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: analyticsData.deviceData.labels,
            datasets: [{
                data: analyticsData.deviceData.data,
                backgroundColor: [
                    '#667eea',
                    '#f093fb',
                    '#4facfe',
                    '#43e97b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function initializeHourlyChart() {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) return;

    hourlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: analyticsData.hourlyData.labels,
            datasets: [{
                label: 'Lượt xem',
                data: analyticsData.hourlyData.data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: '#667eea',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function generateTimeLabels() {
    const labels = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

function switchChartType(type) {
    currentChartType = type;
    
    // Update button states
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // Update chart data
    if (timeChart) {
        const newData = analyticsData.timeSeriesData[type];
        const newLabel = getChartLabel(type);
        
        timeChart.data.datasets[0].data = newData;
        timeChart.data.datasets[0].label = newLabel;
        timeChart.update();
    }
}

function getChartLabel(type) {
    const labels = {
        'views': 'Lượt xem',
        'users': 'Người dùng',
        'movies': 'Phim'
    };
    return labels[type] || type;
}

function loadTopMovies() {
    const container = document.getElementById('top-movies');
    if (!container) return;

    container.innerHTML = analyticsData.topMovies.map((movie, index) => `
        <div class="movie-item">
            <div class="movie-rank">${index + 1}</div>
            <div class="movie-info">
                <div class="movie-name">${movie.name}</div>
                <div class="movie-stats">
                    <span class="views">${movie.views.toLocaleString()} lượt xem</span>
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${movie.rating}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadTopUsers() {
    const container = document.getElementById('top-users');
    if (!container) return;

    container.innerHTML = analyticsData.topUsers.map((user, index) => `
        <div class="user-item">
            <div class="user-rank">${index + 1}</div>
            <div class="user-info">
                <div class="username">${user.name}</div>
                <div class="user-stats">
                    <span class="views">${user.views.toLocaleString()} lượt xem</span>
                    <span class="join-date">Tham gia: ${formatDate(user.joinDate)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function handleDateRangeChange(e) {
    const days = parseInt(e.target.value);
    // In a real application, you would fetch new data based on the date range
    console.log(`Loading data for ${days} days`);
    showNotification(`Đã cập nhật dữ liệu cho ${days} ngày qua`, 'success');
}

function exportReport() {
    // In a real application, this would generate and download a report
    showNotification('Đang xuất báo cáo...', 'info');
    
    setTimeout(() => {
        showNotification('Báo cáo đã được xuất thành công!', 'success');
    }, 2000);
}

// Add CSS for analytics page
const analyticsCSS = `
<style>
.analytics-content {
    padding: 30px;
}

.overview-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 25px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    background: linear-gradient(135deg, #667eea, #764ba2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.stat-content h3 {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 5px;
}

.stat-content p {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 8px;
}

.stat-trend {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
}

.stat-trend.positive {
    color: #27ae60;
}

.stat-trend i {
    font-size: 10px;
}

.charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.chart-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.chart-header {
    padding: 20px;
    border-bottom: 1px solid #e1e8ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chart-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
}

.chart-controls {
    display: flex;
    gap: 10px;
}

.chart-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.chart-btn.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.chart-btn:hover {
    background: #f8f9fa;
}

.chart-btn.active:hover {
    background: #5a6fd8;
}

.chart-content {
    padding: 20px;
    height: 300px;
    position: relative;
}

.detailed-analytics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 30px;
}

.analytics-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.card-header {
    padding: 20px;
    border-bottom: 1px solid #e1e8ed;
}

.card-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
}

.card-content {
    padding: 20px;
}

.movie-item, .user-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #f1f3f4;
}

.movie-item:last-child, .user-item:last-child {
    border-bottom: none;
}

.movie-rank, .user-rank {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #667eea;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
}

.movie-info, .user-info {
    flex: 1;
}

.movie-name, .username {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
}

.movie-stats, .user-stats {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #7f8c8d;
}

.views {
    color: #667eea;
    font-weight: 500;
}

.rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #f39c12;
}

.join-date {
    color: #7f8c8d;
}

.device-location-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.date-range select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    background: white;
}

@media (max-width: 1200px) {
    .charts-section {
        grid-template-columns: 1fr;
    }
    
    .detailed-analytics {
        grid-template-columns: 1fr;
    }
    
    .device-location-stats {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .overview-stats {
        grid-template-columns: 1fr;
    }
    
    .chart-controls {
        flex-wrap: wrap;
    }
    
    .movie-stats, .user-stats {
        flex-direction: column;
        gap: 5px;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', analyticsCSS);
