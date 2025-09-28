// ===== ADMIN SCRIPTS =====

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page
    if (document.getElementById('admin-login-form')) {
        initializeLoginPage();
    } 
    // Check if we're on dashboard page specifically
    else if (document.querySelector('.admin-container') && document.getElementById('total-movies')) {
        initializeDashboard();
    }
    // For other admin pages, just initialize sidebar and logout
    else if (document.querySelector('.admin-container')) {
        initializeSidebar();
    }
});

// ===== LOGIN PAGE FUNCTIONALITY =====
function initializeLoginPage() {
    const loginForm = document.getElementById('admin-login-form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = togglePassword.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Basic validation
    if (!username || !password) {
        showNotification('Vui lòng nhập đầy đủ thông tin!', 'error');
        return;
    }

    // Show loading state
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang đăng nhập...';
    loginBtn.disabled = true;

    // Make API call
    fetch('/api/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store login state
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify({
                username: data.user.username,
                role: data.user.role,
                loginTime: new Date().toISOString()
            }));

            if (rememberMe) {
                localStorage.setItem('adminRememberMe', 'true');
            }

            showNotification(data.message, 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showNotification(data.message, 'error');
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        showNotification('Lỗi kết nối! Vui lòng thử lại.', 'error');
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    });
}

// ===== DASHBOARD FUNCTIONALITY =====
function initializeDashboard() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Initialize dashboard components
    initializeSidebar();
    initializeStats();
    initializeCharts();
    initChart();
    setupTableActions();
    animateStats();
    initializeTable();
    initializeNotifications();
}

function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle sidebar on mobile
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }

    // Handle navigation - just update active class
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Let the browser handle the navigation naturally
            // No need to prevent default or handle navigation manually
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUser');
                window.location.href = 'admin-login.html';
            }
        });
    }
}

// Navigation is now handled by direct HTML links
// No need for JavaScript navigation functions

function initializeStats() {
    // Load stats from API
    fetch('/api/admin/stats')
        .then(response => response.json())
        .then(data => {
            // Update stats with real data
            updateStatCard(0, data.totalMovies);
            updateStatCard(1, data.totalUsers);
            updateStatCard(2, data.todayViews);
            updateStatCard(3, data.monthlyRevenue);
        })
        .catch(error => {
            console.error('Error loading stats:', error);
            // Fallback to default values
            const statNumbers = document.querySelectorAll('.stat-content h3');
            statNumbers.forEach(stat => {
                const finalValue = stat.textContent;
                const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                
                if (!isNaN(numericValue)) {
                    animateNumber(stat, 0, numericValue, 2000);
                }
            });
        });
}

function updateStatCard(index, value) {
    const statCards = document.querySelectorAll('.stat-content h3');
    if (statCards[index]) {
        animateNumber(statCards[index], 0, value, 2000);
    }
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
    // This would initialize charts (Chart.js, D3.js, etc.)
    console.log('Initializing charts...');
    
    // For now, we'll just add some sample data to the chart placeholder
    const chartPlaceholder = document.querySelector('.chart-placeholder');
    if (chartPlaceholder) {
        // In a real app, you would render actual charts here
        console.log('Chart placeholder ready for real chart implementation');
    }
}

function initializeTable() {
    const table = document.querySelector('.data-table');
    if (!table) return;

    // Add row hover effects
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });

    // Handle action buttons
    const editButtons = table.querySelectorAll('.btn-icon:first-child');
    const deleteButtons = table.querySelectorAll('.btn-icon:last-child');

    editButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const movieName = row.cells[1].textContent;
            showNotification(`Chỉnh sửa phim: ${movieName}`, 'info');
        });
    });

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const movieName = row.cells[1].textContent;
            
            if (confirm(`Bạn có chắc chắn muốn xóa phim "${movieName}"?`)) {
                row.remove();
                showNotification(`Đã xóa phim: ${movieName}`, 'success');
            }
        });
    });
}

function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('Bạn có 3 thông báo mới!', 'info');
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    return colors[type] || '#3498db';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
        transition: background 0.3s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(style);

// Chart functionality
function initChart() {
    const ctx = document.getElementById('viewsChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
            datasets: [{
                label: 'Lượt xem',
                data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
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

// Table actions
function setupTableActions() {
    const refreshBtn = document.getElementById('refresh-movies');
    const addMovieBtn = document.getElementById('add-movie-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Làm mới';
                this.disabled = false;
                showNotification('Dữ liệu đã được cập nhật!', 'success');
            }, 1500);
        });
    }
    
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', function() {
            showNotification('Tính năng thêm phim sẽ được phát triển!', 'info');
        });
    }
}

// Animate stats numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-content h3');
    
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isNumber = !isNaN(parseInt(finalValue.replace(/[^0-9]/g, '')));
        
        if (isNumber) {
            const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
            animateNumber(stat, 0, numericValue, 2000, finalValue);
        }
    });
}

function animateNumber(element, start, end, duration, originalText) {
    const startTime = performance.now();
    const isCurrency = originalText.includes('$');
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = isCurrency ? `$${current.toLocaleString()}` : current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}
