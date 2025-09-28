// ===== CATEGORIES MANAGEMENT =====

// Add CSS for categories page first
const categoriesCSS = `
<style>
.categories-content {
    padding: 30px;
}

.stats-grid {
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
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.category-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid #e1e8ed;
}

.category-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.category-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.category-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.category-actions {
    display: flex;
    gap: 8px;
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

.category-content {
    padding: 20px;
}

.category-name {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 8px;
}

.category-description {
    color: #7f8c8d;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
}

.category-stats {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #7f8c8d;
    font-size: 13px;
}

.stat-item i {
    color: #667eea;
}

.category-status {
    display: flex;
    justify-content: flex-end;
}

.status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
}

.status-active {
    background: #d4edda;
    color: #155724;
}

.status-inactive {
    background: #f8d7da;
    color: #721c24;
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
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
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

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.form-group label {
    font-weight: 500;
    color: #2c3e50;
    font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.form-group input[type="color"] {
    width: 60px;
    height: 40px;
    padding: 4px;
    cursor: pointer;
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
    .categories-grid {
        grid-template-columns: 1fr;
    }
    
    .category-stats {
        flex-direction: column;
        gap: 10px;
    }
    
    .category-header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
    }
    
    .category-actions {
        align-self: flex-end;
    }
}
</style>
`;

// Add CSS to DOM immediately
document.head.insertAdjacentHTML('beforeend', categoriesCSS);

// Sample categories data
let categories = [
    {
        id: 1,
        name: "Hành động",
        slug: "action",
        description: "Phim hành động với nhiều cảnh chiến đấu và phiêu lưu",
        color: "#e74c3c",
        icon: "fas fa-fist-raised",
        status: "active",
        movieCount: 15,
        totalViews: 12500
    },
    {
        id: 2,
        name: "Hài",
        slug: "comedy",
        description: "Phim hài hước, vui nhộn mang lại tiếng cười",
        color: "#f39c12",
        icon: "fas fa-laugh",
        status: "active",
        movieCount: 12,
        totalViews: 8900
    },
    {
        id: 3,
        name: "Tâm lý",
        slug: "drama",
        description: "Phim tâm lý, cảm động với cốt truyện sâu sắc",
        color: "#3498db",
        icon: "fas fa-drama-masks",
        status: "active",
        movieCount: 8,
        totalViews: 6700
    },
    {
        id: 4,
        name: "Kinh dị",
        slug: "horror",
        description: "Phim kinh dị, ma quái gây cảm giác sợ hãi",
        color: "#8e44ad",
        icon: "fas fa-ghost",
        status: "active",
        movieCount: 6,
        totalViews: 4200
    },
    {
        id: 5,
        name: "Lãng mạn",
        slug: "romance",
        description: "Phim tình cảm, lãng mạn về tình yêu",
        color: "#e91e63",
        icon: "fas fa-heart",
        status: "active",
        movieCount: 10,
        totalViews: 9800
    },
    {
        id: 6,
        name: "Khoa học viễn tưởng",
        slug: "sci-fi",
        description: "Phim khoa học viễn tưởng với công nghệ tương lai",
        color: "#00bcd4",
        icon: "fas fa-rocket",
        status: "inactive",
        movieCount: 4,
        totalViews: 3200
    }
];

let filteredCategories = [...categories];
let editingCategoryId = null;

// Initialize categories page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('categories-grid')) {
        console.log('Initializing categories page...');
        initializeCategoriesPage();
    }
});

function initializeCategoriesPage() {
    console.log('Setting up categories page...');
    setupEventListeners();
    renderCategories();
    updateStats();
    console.log('Categories page initialized successfully');
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('category-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Add category button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', () => openCategoryModal());
    }

    // Modal events
    setupModalEvents();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm)
    );
    renderCategories();
}

function renderCategories() {
    console.log('Rendering categories...');
    const grid = document.getElementById('categories-grid');
    if (!grid) {
        console.error('categories-grid element not found');
        return;
    }
    console.log('Found grid element, rendering', filteredCategories.length, 'categories');

    grid.innerHTML = filteredCategories.map(category => `
        <div class="category-card" data-category-id="${category.id}">
            <div class="category-header">
                <div class="category-icon" style="background-color: ${category.color}">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-actions">
                    <button class="btn-icon edit-btn" onclick="editCategory(${category.id})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="deleteCategory(${category.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="category-content">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-description">${category.description}</p>
                <div class="category-stats">
                    <div class="stat-item">
                        <i class="fas fa-film"></i>
                        <span>${category.movieCount} phim</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-eye"></i>
                        <span>${category.totalViews.toLocaleString()} lượt xem</span>
                    </div>
                </div>
                <div class="category-status">
                    <span class="status status-${category.status}">
                        ${category.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const totalCategories = categories.length;
    const totalMovies = categories.reduce((sum, cat) => sum + cat.movieCount, 0);
    const totalViews = categories.reduce((sum, cat) => sum + cat.totalViews, 0);

    const totalCategoriesEl = document.getElementById('total-categories');
    const totalMoviesEl = document.getElementById('total-movies');
    const totalViewsEl = document.getElementById('total-views');

    if (totalCategoriesEl) animateNumber(totalCategoriesEl, 0, totalCategories, 1000);
    if (totalMoviesEl) animateNumber(totalMoviesEl, 0, totalMovies, 1000);
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
function openCategoryModal(categoryId = null) {
    const modal = document.getElementById('category-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('category-form');
    
    if (categoryId) {
        editingCategoryId = categoryId;
        const category = categories.find(c => c.id === categoryId);
        modalTitle.textContent = 'Chỉnh sửa thể loại';
        populateForm(category);
    } else {
        editingCategoryId = null;
        modalTitle.textContent = 'Thêm thể loại mới';
        form.reset();
        document.getElementById('category-color').value = '#667eea';
    }
    
    modal.style.display = 'flex';
}

function populateForm(category) {
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-description').value = category.description;
    document.getElementById('category-color').value = category.color;
    document.getElementById('category-icon').value = category.icon;
    document.getElementById('category-status').value = category.status;
}

function setupModalEvents() {
    const modal = document.getElementById('category-modal');
    const deleteModal = document.getElementById('delete-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveBtn = document.getElementById('modal-save');
    const deleteCloseBtn = document.getElementById('delete-modal-close');
    const deleteCancelBtn = document.getElementById('delete-cancel');
    const deleteConfirmBtn = document.getElementById('delete-confirm');

    if (closeBtn) closeBtn.addEventListener('click', closeCategoryModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeCategoryModal);
    if (saveBtn) saveBtn.addEventListener('click', saveCategory);
    if (deleteCloseBtn) deleteCloseBtn.addEventListener('click', closeDeleteModal);
    if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteModal);
    if (deleteConfirmBtn) deleteConfirmBtn.addEventListener('click', confirmDelete);

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCategoryModal();
        });
    }
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    modal.style.display = 'none';
    editingCategoryId = null;
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
}

function saveCategory() {
    const form = document.getElementById('category-form');
    const formData = new FormData(form);
    
    const categoryData = {
        name: formData.get('name'),
        slug: formData.get('name').toLowerCase().replace(/\s+/g, '-'),
        description: formData.get('description'),
        color: formData.get('color'),
        icon: formData.get('icon'),
        status: formData.get('status'),
        movieCount: 0,
        totalViews: 0
    };

    if (editingCategoryId) {
        // Update existing category
        const index = categories.findIndex(c => c.id === editingCategoryId);
        if (index !== -1) {
            categories[index] = { ...categories[index], ...categoryData };
            showNotification('Thể loại đã được cập nhật thành công!', 'success');
        }
    } else {
        // Add new category
        const newId = Math.max(...categories.map(c => c.id)) + 1;
        categories.push({ id: newId, ...categoryData });
        showNotification('Thể loại đã được thêm thành công!', 'success');
    }

    closeCategoryModal();
    renderCategories();
    updateStats();
}

function editCategory(id) {
    openCategoryModal(id);
}

function deleteCategory(id) {
    const category = categories.find(c => c.id === id);
    if (!category) return;

    const modal = document.getElementById('delete-modal');
    modal.style.display = 'flex';
    
    // Store the ID for deletion
    modal.dataset.categoryId = id;
}

function confirmDelete() {
    const modal = document.getElementById('delete-modal');
    const categoryId = parseInt(modal.dataset.categoryId);
    
    const index = categories.findIndex(c => c.id === categoryId);
    if (index !== -1) {
        categories.splice(index, 1);
        showNotification('Thể loại đã được xóa thành công!', 'success');
        renderCategories();
        updateStats();
    }
    
    closeDeleteModal();
}

