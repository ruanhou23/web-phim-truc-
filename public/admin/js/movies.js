// ===== MOVIES MANAGEMENT =====

// Sample movies data
let movies = [
    {
        id: 1,
        title: "Avengers: Endgame",
        category: "action",
        year: 2019,
        rating: 8.4,
        views: 1234,
        status: "active",
        description: "Sau khi Thanos thực hiện Snap, các siêu anh hùng còn lại phải tìm cách đảo ngược tình thế.",
        poster: "https://placehold.co/300x450/333/fff?text=Avengers",
        trailer: "https://youtube.com/watch?v=TcMBFSGVi1c"
    },
    {
        id: 2,
        title: "Spider-Man: No Way Home",
        category: "action",
        year: 2021,
        rating: 8.2,
        views: 2345,
        status: "active",
        description: "Peter Parker phải đối mặt với những kẻ thù từ các vũ trụ khác.",
        poster: "https://placehold.co/300x450/333/fff?text=Spider-Man",
        trailer: "https://youtube.com/watch?v=JfVOs4VSpmA"
    },
    {
        id: 3,
        title: "Black Widow",
        category: "action",
        year: 2021,
        rating: 6.7,
        views: 987,
        status: "inactive",
        description: "Natasha Romanoff đối mặt với quá khứ đen tối của mình.",
        poster: "https://placehold.co/300x450/333/fff?text=Black+Widow",
        trailer: "https://youtube.com/watch?v=ybji16u608U"
    },
    {
        id: 4,
        title: "The Batman",
        category: "action",
        year: 2022,
        rating: 7.8,
        views: 1876,
        status: "active",
        description: "Batman điều tra một loạt vụ giết người bí ẩn ở Gotham City.",
        poster: "https://placehold.co/300x450/333/fff?text=The+Batman",
        trailer: "https://youtube.com/watch?v=mqqft2x_Aa4"
    },
    {
        id: 5,
        title: "Top Gun: Maverick",
        category: "action",
        year: 2022,
        rating: 8.3,
        views: 2156,
        status: "active",
        description: "Pete 'Maverick' Mitchell trở lại với nhiệm vụ nguy hiểm nhất.",
        poster: "https://placehold.co/300x450/333/fff?text=Top+Gun",
        trailer: "https://youtube.com/watch?v=qSqVVswa420"
    }
];

let currentPage = 1;
let itemsPerPage = 10;
let filteredMovies = [...movies];
let editingMovieId = null;

// Initialize movies page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('movies-table')) {
        initializeMoviesPage();
    }
});

function initializeMoviesPage() {
    setupEventListeners();
    renderMovies();
    updatePagination();
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('movie-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filters
    const categoryFilter = document.getElementById('category-filter');
    const yearFilter = document.getElementById('year-filter');
    const statusFilter = document.getElementById('status-filter');
    const clearFilters = document.getElementById('clear-filters');

    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (yearFilter) yearFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (clearFilters) clearFilters.addEventListener('click', clearAllFilters);

    // Add movie button
    const addMovieBtn = document.getElementById('add-movie-btn');
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', () => openMovieModal());
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
    filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderMovies();
    updatePagination();
}

function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const year = document.getElementById('year-filter').value;
    const status = document.getElementById('status-filter').value;
    const searchTerm = document.getElementById('movie-search').value.toLowerCase();

    filteredMovies = movies.filter(movie => {
        const matchesCategory = !category || movie.category === category;
        const matchesYear = !year || movie.year.toString() === year;
        const matchesStatus = !status || movie.status === status;
        const matchesSearch = !searchTerm || 
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesYear && matchesStatus && matchesSearch;
    });

    currentPage = 1;
    renderMovies();
    updatePagination();
}

function clearAllFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('year-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('movie-search').value = '';
    
    filteredMovies = [...movies];
    currentPage = 1;
    renderMovies();
    updatePagination();
}

function renderMovies() {
    const tbody = document.getElementById('movies-tbody');
    if (!tbody) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageMovies = filteredMovies.slice(startIndex, endIndex);

    tbody.innerHTML = pageMovies.map(movie => `
        <tr>
            <td>
                <input type="checkbox" class="movie-checkbox" value="${movie.id}">
            </td>
            <td>
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            </td>
            <td>
                <div class="movie-title">${movie.title}</div>
                <div class="movie-description">${movie.description.substring(0, 50)}...</div>
            </td>
            <td>
                <span class="category-badge category-${movie.category}">
                    ${getCategoryName(movie.category)}
                </span>
            </td>
            <td>${movie.year}</td>
            <td>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${movie.rating}</span>
                </div>
            </td>
            <td>${movie.views.toLocaleString()}</td>
            <td>
                <span class="status status-${movie.status}">
                    ${movie.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon edit-btn" onclick="editMovie(${movie.id})" title="Chỉnh sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="deleteMovie(${movie.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="btn-icon view-btn" onclick="viewMovie(${movie.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePaginationButtons();
}

function getCategoryName(category) {
    const categories = {
        'action': 'Hành động',
        'comedy': 'Hài',
        'drama': 'Tâm lý',
        'horror': 'Kinh dị',
        'romance': 'Lãng mạn'
    };
    return categories[category] || category;
}

function updatePagination() {
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
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
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderMovies();
        updatePagination();
    }
}

function handleSelectAll(e) {
    const checkboxes = document.querySelectorAll('.movie-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
}

// Modal functions
function openMovieModal(movieId = null) {
    const modal = document.getElementById('movie-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('movie-form');
    
    if (movieId) {
        editingMovieId = movieId;
        const movie = movies.find(m => m.id === movieId);
        modalTitle.textContent = 'Chỉnh sửa phim';
        populateForm(movie);
    } else {
        editingMovieId = null;
        modalTitle.textContent = 'Thêm phim mới';
        form.reset();
    }
    
    modal.style.display = 'flex';
}

function populateForm(movie) {
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-year').value = movie.year;
    document.getElementById('movie-category').value = movie.category;
    document.getElementById('movie-rating').value = movie.rating;
    document.getElementById('movie-description').value = movie.description;
    document.getElementById('movie-poster').value = movie.poster;
    document.getElementById('movie-trailer').value = movie.trailer;
    document.getElementById('movie-status').value = movie.status;
}

function setupModalEvents() {
    const modal = document.getElementById('movie-modal');
    const deleteModal = document.getElementById('delete-modal');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('modal-cancel');
    const saveBtn = document.getElementById('modal-save');
    const deleteCloseBtn = document.getElementById('delete-modal-close');
    const deleteCancelBtn = document.getElementById('delete-cancel');
    const deleteConfirmBtn = document.getElementById('delete-confirm');

    if (closeBtn) closeBtn.addEventListener('click', closeMovieModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeMovieModal);
    if (saveBtn) saveBtn.addEventListener('click', saveMovie);
    if (deleteCloseBtn) deleteCloseBtn.addEventListener('click', closeDeleteModal);
    if (deleteCancelBtn) deleteCancelBtn.addEventListener('click', closeDeleteModal);
    if (deleteConfirmBtn) deleteConfirmBtn.addEventListener('click', confirmDelete);

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeMovieModal();
        });
    }
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }
}

function closeMovieModal() {
    const modal = document.getElementById('movie-modal');
    modal.style.display = 'none';
    editingMovieId = null;
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.style.display = 'none';
}

function saveMovie() {
    const form = document.getElementById('movie-form');
    const formData = new FormData(form);
    
    const movieData = {
        title: formData.get('title'),
        year: parseInt(formData.get('year')),
        category: formData.get('category'),
        rating: parseFloat(formData.get('rating')) || 0,
        description: formData.get('description'),
        poster: formData.get('poster'),
        trailer: formData.get('trailer'),
        status: formData.get('status'),
        views: 0
    };

    if (editingMovieId) {
        // Update existing movie
        const index = movies.findIndex(m => m.id === editingMovieId);
        if (index !== -1) {
            movies[index] = { ...movies[index], ...movieData };
            showNotification('Phim đã được cập nhật thành công!', 'success');
        }
    } else {
        // Add new movie
        const newId = Math.max(...movies.map(m => m.id)) + 1;
        movies.push({ id: newId, ...movieData });
        showNotification('Phim đã được thêm thành công!', 'success');
    }

    closeMovieModal();
    applyFilters();
}

function editMovie(id) {
    openMovieModal(id);
}

function deleteMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    const modal = document.getElementById('delete-modal');
    modal.style.display = 'flex';
    
    // Store the ID for deletion
    modal.dataset.movieId = id;
}

function confirmDelete() {
    const modal = document.getElementById('delete-modal');
    const movieId = parseInt(modal.dataset.movieId);
    
    const index = movies.findIndex(m => m.id === movieId);
    if (index !== -1) {
        movies.splice(index, 1);
        showNotification('Phim đã được xóa thành công!', 'success');
        applyFilters();
    }
    
    closeDeleteModal();
}

function viewMovie(id) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    // Create a simple view modal
    const viewModal = document.createElement('div');
    viewModal.className = 'modal';
    viewModal.style.display = 'flex';
    viewModal.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h3>${movie.title}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="movie-detail">
                    <div class="movie-poster-large">
                        <img src="${movie.poster}" alt="${movie.title}">
                    </div>
                    <div class="movie-info">
                        <p><strong>Năm:</strong> ${movie.year}</p>
                        <p><strong>Thể loại:</strong> ${getCategoryName(movie.category)}</p>
                        <p><strong>Đánh giá:</strong> ${movie.rating}/10</p>
                        <p><strong>Lượt xem:</strong> ${movie.views.toLocaleString()}</p>
                        <p><strong>Trạng thái:</strong> ${movie.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}</p>
                        <p><strong>Mô tả:</strong></p>
                        <p>${movie.description}</p>
                        ${movie.trailer ? `<p><strong>Trailer:</strong> <a href="${movie.trailer}" target="_blank">Xem trailer</a></p>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(viewModal);
    
    // Close when clicking outside
    viewModal.addEventListener('click', (e) => {
        if (e.target === viewModal) viewModal.remove();
    });
}

// Add CSS for movies page
const moviesCSS = `
<style>
.movies-content {
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

.movie-poster {
    width: 60px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
}

.movie-title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
}

.movie-description {
    color: #7f8c8d;
    font-size: 12px;
}

.category-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
}

.category-action { background: #e74c3c; color: white; }
.category-comedy { background: #f39c12; color: white; }
.category-drama { background: #3498db; color: white; }
.category-horror { background: #8e44ad; color: white; }
.category-romance { background: #e91e63; color: white; }

.rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #f39c12;
}

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
}

.edit-btn {
    background: #3498db;
    color: white;
}

.edit-btn:hover {
    background: #2980b9;
}

.delete-btn {
    background: #e74c3c;
    color: white;
}

.delete-btn:hover {
    background: #c0392b;
}

.view-btn {
    background: #27ae60;
    color: white;
}

.view-btn:hover {
    background: #229954;
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
.form-group select,
.form-group textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.movie-detail {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 20px;
}

.movie-poster-large img {
    width: 100%;
    border-radius: 8px;
}

.text-danger {
    color: #e74c3c;
    font-weight: 500;
}

.btn-danger {
    background: #e74c3c;
    color: white;
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
    
    .movie-detail {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', moviesCSS);
