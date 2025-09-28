// ===== USERS MANAGEMENT =====

// Sample users data
let users = [
    {
        id: 1,
        username: "john_doe",
        email: "john@example.com",
        fullname: "John Doe",
        phone: "0123456789",
        role: "user",
        status: "active",
        avatar: "https://placehold.co/100x100/667eea/fff?text=JD",
        joinDate: "2024-01-15",
        lastActive: "2024-01-20",
        totalViews: 1250,
        favoriteMovies: 15
    },
    {
        id: 2,
        username: "jane_smith",
        email: "jane@example.com",
        fullname: "Jane Smith",
        phone: "0987654321",
        role: "vip",
        status: "active",
        avatar: "https://placehold.co/100x100/e91e63/fff?text=JS",
        joinDate: "2024-01-10",
        lastActive: "2024-01-20",
        totalViews: 3200,
        favoriteMovies: 45
    },
    {
        id: 3,
        username: "admin_user",
        email: "admin@nhanphim.com",
        fullname: "Admin User",
        phone: "0111222333",
        role: "admin",
        status: "active",
        avatar: "https://placehold.co/100x100/27ae60/fff?text=AU",
        joinDate: "2024-01-01",
        lastActive: "2024-01-20",
        totalViews: 5000,
        favoriteMovies: 100
    },
    {
        id: 4,
        username: "bob_wilson",
        email: "bob@example.com",
        fullname: "Bob Wilson",
        phone: "0444555666",
        role: "user",
        status: "inactive",
        avatar: "https://placehold.co/100x100/f39c12/fff?text=BW",
        joinDate: "2024-01-05",
        lastActive: "2024-01-18",
        totalViews: 800,
        favoriteMovies: 8
    },
    {
        id: 5,
        username: "alice_brown",
        email: "alice@example.com",
        fullname: "Alice Brown",
        phone: "0777888999",
        role: "vip",
        status: "banned",
        avatar: "https://placehold.co/100x100/8e44ad/fff?text=AB",
        joinDate: "2024-01-12",
        lastActive: "2024-01-19",
        totalViews: 2100,
        favoriteMovies: 25
    }
];

let currentPage = 1;
let itemsPerPage = 10;
let filteredUsers = [...users];
let editingUserId = null;

// Initialize users page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('users-table')) {
        initializeUsersPage();
    }
});

function initializeUsersPage() {
    setupEventListeners();
    renderUsers();
    updatePagination();
    updateStats();
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filters
    const roleFilter = document.getElementById('role-filter');
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const clearFilters = document.getElementById('clear-filters');

    if (roleFilter) roleFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (dateFilter) dateFilter.addEventListener('change', applyFilters);
    if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);

    // Add user button
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => openUserModal());
    }

    // Select all checkbox
    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        selectAll.addEventListener('change', handleSelectAll);
    }

    // Pagination
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');
    if (prevPage) prevPage.addEventListener('click', () => changePage(currentPage - 1));
    if (nextPage) nextPage.addEventListener('click', () => changePage(currentPage + 1));

    // Modal events
    setupModalEvents();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.fullname.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderUsers();
    updatePagination();
}

function applyFilters() {
    const role = document.getElementById('role-filter').value;
    const status = document.getElementById('status-filter').value;
    const date = document.getElementById('date-filter').value;
    const searchTerm = document.getElementById('user-search').value.toLowerCase();

    filteredUsers = users.filter(user => {
        const matchesRole = !role || user.role === role;
        const matchesStatus = !status || user.status === status;
        const matchesSearch = !searchTerm || 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.fullname.toLowerCase().includes(searchTerm);
        
        let matchesDate = true;
        if (date) {
            const userDate = new Date(user.joinDate);
            const now = new Date();
            switch (date) {
                case 'today':
                    matchesDate = userDate.toDateString() === now.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = userDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = userDate >= monthAgo;
                    break;
            }
        }

        return matchesRole && matchesStatus && matchesSearch && matchesDate;
    });

    currentPage = 1;
    renderUsers();
    updatePagination();
}

function clearAllFilters() {
    document.getElementById('role-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('date-filter').value = '';
    document.getElementById('user-search').value = '';
    
    filteredUsers = [...users];
    currentPage = 1;
    renderUsers();
    updatePagination();
}

function renderUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageUsers = filteredUsers.slice(startIndex, endIndex);

    tbody.innerHTML = pageUsers.map(user => `
        <tr>
            <td>
                <input type="checkbox" class="user-checkbox" value="${user.id}">
            </td>
            <td>
                <img src="${user.avatar}" alt="${user.username}" class="user-avatar">
            </td>
            <td>
                <div class="user-info">
                    <div class="username">${user.username}</div>
                    <div class="fullname">${user.fullname}</div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="role-badge role-${user.role}">
                    ${getRoleName(user.role)}
                </span>
            </td>
            <td>${formatDate(user.joinDate)}</td>
            <td>${formatDate(user.lastActive)}</td>
            <td>
                <span class="status status-${user.status}">
                    ${getStatusName(user.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon view-btn" onclick="viewUser(${user.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon edit-btn" onclick="editUser(${user.id})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="deleteUser(${user.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePaginationButtons();
}

function getRoleName(role) {
    const roles = {
        'admin': 'Admin',
        'vip': 'VIP',
        'user': 'Người dùng'
    };
    return roles[role] || role;
}

function getStatusName(status) {
    const statuses = {
        'active': 'Hoạt động',
        'inactive': 'Tạm khóa',
        'banned': 'Bị cấm'
    };
    return statuses[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const pageNumbers = document.getElementById('page-numbers');
    
    if (!pageNumbers) return;

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="page-number ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    pageNumbers.innerHTML = paginationHTML;
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderUsers();
        updatePagination();
    }
}

function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.user-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
}

function updateStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const newUsers = users.filter(u => {
        const userDate = new Date(u.joinDate);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return userDate >= weekAgo;
    }).length;
    const totalViews = users.reduce((sum, user) => sum + user.totalViews, 0);

    const totalUsersEl = document.getElementById('total-users');
    const activeUsersEl = document.getElementById('active-users');
    const newUsersEl = document.getElementById('new-users');
    const totalViewsEl = document.getElementById('total-views');

    if (totalUsersEl) animateNumber(totalUsersEl, 0, totalUsers, 1000);
    if (activeUsersEl) animateNumber(activeUsersEl, 0, activeUsers, 1000);
    if (newUsersEl) animateNumber(newUsersEl, 0, newUsers, 1000);
    if (totalViewsEl) animateNumber(totalViewsEl, 0, totalViews, 1000);
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

// Modal functions
function openUserModal(userId = null) {
    const modal = document.getElementById('user-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('user-form');
    
    if (userId) {
        editingUserId = userId;
        const user = users.find(u => u.id === userId);
        modalTitle.textContent = 'Chỉnh sửa người dùng';
        populateForm(user);
    } else {
        editingUserId = null;
        modalTitle.textContent = 'Thêm người dùng mới';
        form.reset();
    }
    
    modal.style.display = 'flex';
}

function populateForm(user) {
    document.getElementById('user-username').value = user.username;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-fullname').value = user.fullname;
    document.getElementById('user-phone').value = user.phone;
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-avatar').value = user.avatar;
    document.getElementById('user-status').value = user.status;
}

function setupModalEvents() {
    const modal = document.getElementById('user-modal');
    const userDetailsModal = document.getElementById('user-details-modal');
    const deleteModal = document.getElementById('delete-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveBtn = document.getElementById('modal-save');
    const userDetailsCloseBtn = document.getElementById('user-details-close');
    const deleteCloseBtn = document.getElementById('delete-modal-close');
    const deleteCancelBtn = document.getElementById('delete-cancel');
    const deleteConfirmBtn = document.getElementById('delete-confirm');

    if (closeBtn) closeBtn.addEventListener('click', closeUserModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeUserModal);
    if (saveBtn) saveBtn.addEventListener('click', saveUser);
    if (userDetailsCloseBtn) userDetailsCloseBtn.addEventListener('click', closeUserDetailsModal);
    if (deleteCloseBtn) deleteCloseBtn.addEventListener('click', closeDeleteModal);
    if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteModal);
    if (deleteConfirmBtn) deleteConfirmBtn.addEventListener('click', confirmDelete);

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeUserModal();
        });
    }
    if (userDetailsModal) {
        userDetailsModal.addEventListener('click', (e) => {
            if (e.target === userDetailsModal) closeUserDetailsModal();
        });
    }
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }
}

function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.style.display = 'none';
    editingUserId = null;
}

function closeUserDetailsModal() {
    const modal = document.getElementById('user-details-modal');
    modal.style.display = 'none';
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
}

function saveUser() {
    const form = document.getElementById('user-form');
    const formData = new FormData(form);
    
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        fullname: formData.get('fullname'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        avatar: formData.get('avatar'),
        status: formData.get('status'),
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        totalViews: 0,
        favoriteMovies: 0
    };

    if (editingUserId) {
        // Update existing user
        const index = users.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            users[index] = { ...users[index], ...userData };
            showNotification('Người dùng đã được cập nhật thành công!', 'success');
        }
    } else {
        // Add new user
        const newId = Math.max(...users.map(u => u.id)) + 1;
        users.push({ id: newId, ...userData });
        showNotification('Người dùng đã được thêm thành công!', 'success');
    }

    closeUserModal();
    applyFilters();
    updateStats();
}

function editUser(id) {
    openUserModal(id);
}

function viewUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const modal = document.getElementById('user-details-modal');
    const content = document.getElementById('user-details-content');
    
    content.innerHTML = `
        <div class="user-profile">
            <div class="user-avatar-large">
                <img src="${user.avatar}" alt="${user.username}">
            </div>
            <div class="user-info-detail">
                <h2>${user.fullname}</h2>
                <p class="username">@${user.username}</p>
                <p class="email">${user.email}</p>
                <p class="phone">${user.phone}</p>
            </div>
        </div>
        <div class="user-stats">
            <div class="stat-item">
                <i class="fas fa-calendar"></i>
                <span>Ngày đăng ký: ${formatDate(user.joinDate)}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-clock"></i>
                <span>Lần cuối hoạt động: ${formatDate(user.lastActive)}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-eye"></i>
                <span>Tổng lượt xem: ${user.totalViews.toLocaleString()}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-heart"></i>
                <span>Phim yêu thích: ${user.favoriteMovies}</span>
            </div>
        </div>
        <div class="user-role-status">
            <span class="role-badge role-${user.role}">${getRoleName(user.role)}</span>
            <span class="status status-${user.status}">${getStatusName(user.status)}</span>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const modal = document.getElementById('delete-modal');
    modal.style.display = 'flex';
    
    // Store the ID for deletion
    modal.dataset.userId = id;
}

function confirmDelete() {
    const modal = document.getElementById('delete-modal');
    const userId = parseInt(modal.dataset.userId);
    
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
        users.splice(index, 1);
        showNotification('Người dùng đã được xóa thành công!', 'success');
        applyFilters();
        updateStats();
    }
    
    closeDeleteModal();
}

// Add CSS for users page
const usersCSS = `
<style>
.users-content {
    padding: 30px;
}

.filters-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    gap: 20px;
    align-items: end;
    flex-wrap: wrap;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.filter-group label {
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
}

.filter-group select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    min-width: 150px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.username {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 2px;
}

.fullname {
    color: #7f8c8d;
    font-size: 12px;
}

.role-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
}

.role-admin { background: #e74c3c; color: white; }
.role-vip { background: #f39c12; color: white; }
.role-user { background: #3498db; color: white; }

.status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
}

.status-active {
    background: #d4edda;
    color: #155724;
}

.status-inactive {
    background: #fff3cd;
    color: #856404;
}

.status-banned {
    background: #f8d7da;
    color: #721c24;
}

.action-buttons {
    display: flex;
    gap: 5px;
}

.btn-icon {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 14px;
}

.view-btn {
    background: #27ae60;
    color: white;
}

.view-btn:hover {
    background: #229954;
    transform: scale(1.1);
}

.edit-btn {
    background: #3498db;
    color: white;
}

.edit-btn:hover {
    background: #2980b9;
    transform: scale(1.1);
}

.delete-btn {
    background: #e74c3c;
    color: white;
}

.delete-btn:hover {
    background: #c0392b;
    transform: scale(1.1);
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
}

.page-numbers {
    display: flex;
    gap: 5px;
}

.page-number {
    width: 40px;
    height: 40px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.page-number:hover {
    background: #f8f9fa;
}

.page-number.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content.large {
    max-width: 800px;
}

.modal-content.small {
    max-width: 400px;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #e1e8ed;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #7f8c8d;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid #e1e8ed;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-weight: 500;
    color: #2c3e50;
}

.form-group input,
.form-group select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.user-profile {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e1e8ed;
}

.user-avatar-large img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

.user-info-detail h2 {
    margin-bottom: 10px;
    color: #2c3e50;
}

.username {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 5px;
}

.email, .phone {
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 5px;
}

.user-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
}

.stat-item i {
    color: #667eea;
    width: 20px;
}

.user-role-status {
    display: flex;
    gap: 10px;
    justify-content: center;
}

.text-danger {
    color: #e74c3c;
    font-weight: 500;
    font-size: 13px;
}

.btn-danger {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.3s ease;
}

.btn-danger:hover {
    background: #c0392b;
}

@media (max-width: 768px) {
    .filters-section {
        flex-direction: column;
        align-items: stretch;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .user-profile {
        flex-direction: column;
        text-align: center;
    }
    
    .user-stats {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', usersCSS);
