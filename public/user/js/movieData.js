// Movie Data Manager
class MovieDataManager {
    constructor() {
        this.movies = [];
        this.categories = {
            'chautinhtri': 'Châu Tinh Trì',
            'thanhlong': 'Thành Long',
            'lylienkiet': 'Lý Liên Kiệt',
            'capba': 'Cấp Bậc',
            'daohaitac': 'Đảo Hải Tặc',
            'phim18': 'Phim 18+',
            'onepiece': 'One Piece Live Action',
            'lamchanhanh': 'Làm Chánh Ánh',
            'chungtudon': 'Chung Tử Đơn',
            'tng_hp': 'Tình Yêu Hạnh Phúc',
            'unknown': 'Khác'
        };
        this.categoryStates = {}; // Track pagination for each category
        this.init();
    }

    async init() {
        try {
            await this.loadMoviesData();
            this.setupEventListeners();
            this.loadHeroMovie();
            this.loadMoviesByCategory();
            this.loadTrendingMovies();
        } catch (error) {
            console.error('Error initializing movie data:', error);
            this.loadFallbackData();
        }
    }

    async loadMoviesData() {
        try {
            // Try to load from local JSON file first
            console.log('🔄 Attempting to load JSON data from ./movies_data.json...');
            const response = await fetch('./movies_data.json');
            console.log('📊 JSON response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                this.movies = Array.isArray(data) ? data : [];
                console.log('✅ Loaded movies from local JSON:', this.movies.length);
                
                // Try to load adult movies as well
                await this.loadAdultMovies();
                
                if (this.movies.length === 0) {
                    console.warn('⚠️ Local JSON data is empty, trying remote JSON...');
                    await this.loadFromRemoteJSON();
                } else {
                    console.log('🎬 Sample movie:', this.movies[0]);
                    console.log('📂 Available categories:', [...new Set(this.movies.map(m => m.category))]);
                }
            } else {
                console.warn('⚠️ Local JSON not found (status:', response.status, '), trying remote JSON...');
                // Fallback to remote JSON
                await this.loadFromRemoteJSON();
            }
        } catch (error) {
            console.error('❌ Error loading local JSON:', error);
            console.log('🔄 Trying remote JSON...');
            await this.loadFromRemoteJSON();
        }
    }

    async loadAdultMovies() {
        try {
            console.log('🔄 Attempting to load adult movies...');
            const response = await fetch('./adult_movies_data.json');
            if (response.ok) {
                const adultData = await response.json();
                if (Array.isArray(adultData) && adultData.length > 0) {
                    // Add adult movies to the main movies array
                    this.movies = this.movies.concat(adultData);
                    console.log('✅ Loaded adult movies:', adultData.length);
                    console.log('📊 Total movies now:', this.movies.length);
                }
            } else {
                console.log('⚠️ Adult movies file not found or empty');
            }
        } catch (error) {
            console.log('⚠️ Could not load adult movies:', error.message);
        }
    }

    async loadFromRemoteJSON() {
        try {
            console.log('🔄 Attempting to load from remote JSON...');
            const response = await fetch('../link/movies_data.json');
            console.log('📊 Remote JSON response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                this.movies = Array.isArray(data) ? data : [];
                console.log('✅ Loaded movies from remote JSON:', this.movies.length);
                
                if (this.movies.length === 0) {
                    console.warn('⚠️ Remote JSON data is empty, trying CSV fallback...');
                    await this.loadFromCSV();
                } else {
                    console.log('🎬 Sample movie:', this.movies[0]);
                    console.log('📂 Available categories:', [...new Set(this.movies.map(m => m.category))]);
                }
            } else {
                console.warn('⚠️ Remote JSON not found (status:', response.status, '), trying CSV fallback...');
                await this.loadFromCSV();
            }
        } catch (error) {
            console.error('❌ Error loading remote JSON:', error);
            console.log('🔄 Trying CSV fallback...');
            await this.loadFromCSV();
        }
    }

    async loadFromCSV() {
        try {
            console.log('🔄 Loading from CSV files...');
            // Try all_movies.csv first as it's most complete
            const response = await fetch('../link/all_movies.csv');
            if (response.ok) {
                const csvText = await response.text();
                this.movies = this.parseCSV(csvText);
                console.log('✅ Loaded movies from all_movies.csv:', this.movies.length);
                
                if (this.movies.length > 0) {
                    return; // Success, no need to try individual files
                }
            }
            
            // If all_movies.csv failed or empty, try individual files
            const csvFiles = [
                '../link/chautinhtri_movies.csv',
                '../link/thanhlong_movies.csv', 
                '../link/lylienkiet_movies.csv',
                '../link/capba_movies.csv',
                '../link/daohaitac_movies.csv',
                '../link/Phim_18_movies.csv',
                '../link/One_Piece_Live_Action_movies.csv',
                '../link/Lm_Chnh_Anh_movies.csv',
                '../link/Chn_T_an_movies.csv',
                '../link/Tng_Hp_movies.csv'
            ];
            
            this.movies = [];
            let totalLoaded = 0;
            
            for (const csvFile of csvFiles) {
                try {
                    console.log(`Trying to load: ${csvFile}`);
                    const response = await fetch(csvFile);
                    if (response.ok) {
                        const csvText = await response.text();
                        const movies = this.parseCSV(csvText);
                        this.movies = this.movies.concat(movies);
                        totalLoaded += movies.length;
                        console.log(`✅ Loaded ${movies.length} movies from ${csvFile}`);
                    } else {
                        console.warn(`⚠️ Failed to load ${csvFile}: ${response.status}`);
                    }
                } catch (error) {
                    console.warn(`❌ Error loading ${csvFile}:`, error);
                }
            }
            
            if (this.movies.length === 0) {
                console.error('❌ No movies loaded from any CSV file');
                this.loadFallbackData();
            } else {
                console.log(`✅ Total movies loaded from CSV: ${this.movies.length}`);
            }
        } catch (error) {
            console.error('❌ Error loading CSV data:', error);
            this.loadFallbackData();
        }
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const movies = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
                // Parse CSV with proper handling of quoted fields
                const fields = this.parseCSVLine(line);
                if (fields.length >= 2) {
                    const [id, title, originalTitle, category, actor, videoLink, filePath] = fields;
                    if (id && title) {
                        movies.push({
                            id: id.trim(),
                            title: title.trim().replace(/"/g, ''),
                            originalTitle: originalTitle ? originalTitle.trim().replace(/"/g, '') : title.trim().replace(/"/g, ''),
                            category: category ? category.trim() : 'unknown',
                            actor: actor ? actor.trim().replace(/"/g, '') : 'Unknown',
                            videoLink: videoLink ? videoLink.trim() : '#',
                            filePath: filePath ? filePath.trim() : ''
                        });
                    }
                }
            }
        }
        
        return movies;
    }

    parseCSVLine(line) {
        const fields = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        fields.push(current);
        return fields;
    }

    loadFallbackData() {
        console.log('🔄 Loading fallback data...');
        // Fallback data if JSON/CSV loading fails
        this.movies = [
            {
                id: "fallback1",
                title: "Lệnh Trừng Phạt",
                originalTitle: "Lệnh Trừng Phạt",
                category: "chautinhtri",
                actor: "Châu Tinh Trì",
                videoLink: "#",
                filePath: "movie-detail.html"
            },
            {
                id: "fallback2", 
                title: "Hãy Để Tôi Tỏa Sáng",
                originalTitle: "Hãy Để Tôi Tỏa Sáng",
                category: "thanhlong",
                actor: "Thành Long",
                videoLink: "#",
                filePath: "movie-detail.html"
            },
            {
                id: "fallback3",
                title: "Thiếu Lâm Tự",
                originalTitle: "Thiếu Lâm Tự",
                category: "lylienkiet",
                actor: "Lý Liên Kiệt",
                videoLink: "#",
                filePath: "movie-detail.html"
            },
            {
                id: "fallback4",
                title: "Vua Bịp",
                originalTitle: "Vua Bịp",
                category: "capba",
                actor: "Châu Tinh Trì",
                videoLink: "#",
                filePath: "movie-detail.html"
            },
            {
                id: "fallback5",
                title: "One Piece Live Action",
                originalTitle: "One Piece Live Action",
                category: "daohaitac",
                actor: "Iñaki Godoy",
                videoLink: "#",
                filePath: "movie-detail.html"
            },
            {
                id: "fallback6",
                title: "Phim 18+ Mẫu",
                originalTitle: "Phim 18+ Mẫu",
                category: "phim18",
                actor: "Diễn viên chính",
                videoLink: "#",
                filePath: "movie-detail.html"
            }
        ];
        console.log('✅ Fallback data loaded:', this.movies.length, 'movies');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.category);
            });
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.dataset.page);
            });
        });
    }

    loadHeroMovie() {
        // Get a random movie for hero section
        const randomMovie = this.movies[Math.floor(Math.random() * this.movies.length)];
        if (randomMovie) {
            const heroTitle = document.getElementById('hero-title');
            const heroDescription = document.getElementById('hero-description');
            const playBtn = document.getElementById('hero-play-btn');
            
            if (heroTitle) {
                heroTitle.textContent = randomMovie.title;
            }
            if (heroDescription) {
                heroDescription.textContent = `Phim ${this.categories[randomMovie.category] || 'Điện Ảnh'} - ${randomMovie.actor}`;
            }
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openMovie(randomMovie);
                });
            }
        }
    }

    loadMoviesByCategory() {
        console.log('🎬 Loading movies by category...');
        console.log('Total movies available:', this.movies.length);
        
        if (this.movies.length === 0) {
            console.warn('⚠️ No movies available, loading fallback data...');
            this.loadFallbackData();
        }
        
        // Load Châu Tinh Trì movies
        this.loadCategoryMovies('korean-movies', 'chautinhtri', 8);
        
        // Load Thành Long movies
        this.loadCategoryMovies('chinese-movies', 'thanhlong', 8);
        
        // Load latest movies (mix of categories)
        this.loadLatestMovies('latest-movies', 12);
        
        // Load Lý Liên Kiệt movies
        this.loadCategoryMovies('top-ranked-movies', 'lylienkiet', 8);
        
        // Load adult movies (hidden by default)
        this.loadAdultMoviesSection();
    }

    loadAdultMoviesSection() {
        const adultMovies = this.movies.filter(movie => movie.category === 'adult');
        if (adultMovies.length > 0) {
            console.log('🔞 Found adult movies:', adultMovies.length);
            
            // Show adult section directly
            const adultSection = document.getElementById('adult-movies-section');
            if (adultSection) {
                adultSection.style.display = 'block';
            }
            
            // Load adult movies directly without confirmation
            this.loadCategoryMovies('adult-movies', 'adult', 12);
            
            console.log('🔞 Adult content loaded directly');
        }
    }

    loadCategoryMovies(containerId, category, limit = 8, page = 1) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container not found: ${containerId}`);
            return;
        }

        const categoryMovies = this.movies.filter(movie => {
            if (category === 'adult') {
                return movie.category === 'adult';
            }
            return movie.category === category;
        });

        if (categoryMovies.length === 0) {
            console.warn(`⚠️ No movies found for category '${category}'`);
            container.innerHTML = '<p class="no-movies">Chưa có phim nào trong thể loại này.</p>';
            return;
        }

        // Initialize category state if not exists
        if (!this.categoryStates[category]) {
            this.categoryStates[category] = {
                currentPage: 1,
                moviesPerPage: limit,
                totalMovies: categoryMovies.length,
                totalPages: Math.ceil(categoryMovies.length / limit)
            };
        }

        const state = this.categoryStates[category];
        state.currentPage = page;
        state.totalMovies = categoryMovies.length;
        state.totalPages = Math.ceil(categoryMovies.length / limit);

        // Calculate movies to show
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const moviesToShow = categoryMovies.slice(startIndex, endIndex);

        // Clear container and render movies
        container.innerHTML = moviesToShow.map(movie => this.createMovieCard(movie)).join('');

        // Add pagination controls if there are more movies
        this.addPaginationControls(container, category, state);

        console.log(`✅ Loaded ${moviesToShow.length} movies for category: ${category} (page ${page}/${state.totalPages})`);
    }

    addPaginationControls(container, category, state) {
        // Only add pagination if there are multiple pages
        if (state.totalPages <= 1) {
            return;
        }

        const paginationHTML = `
            <div class="pagination-container" data-category="${category}">
                <button class="pagination-btn" id="prev-${category}" ${state.currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <div class="pagination-info">
                    <span>Trang</span>
                    <input type="number" class="pagination-input" id="page-input-${category}" 
                           value="${state.currentPage}" min="1" max="${state.totalPages}">
                    <span>/ ${state.totalPages}</span>
                </div>
                
                <button class="pagination-btn" id="next-${category}" ${state.currentPage === state.totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        container.insertAdjacentHTML('afterend', paginationHTML);

        // Add event listeners
        this.setupPaginationEvents(category, state);
    }

    setupPaginationEvents(category, state) {
        const prevBtn = document.getElementById(`prev-${category}`);
        const nextBtn = document.getElementById(`next-${category}`);
        const pageInput = document.getElementById(`page-input-${category}`);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (state.currentPage > 1) {
                    this.loadCategoryMovies(this.getContainerIdByCategory(category), category, state.moviesPerPage, state.currentPage - 1);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (state.currentPage < state.totalPages) {
                    this.loadCategoryMovies(this.getContainerIdByCategory(category), category, state.moviesPerPage, state.currentPage + 1);
                }
            });
        }

        if (pageInput) {
            pageInput.addEventListener('change', (e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= state.totalPages) {
                    this.loadCategoryMovies(this.getContainerIdByCategory(category), category, state.moviesPerPage, page);
                } else {
                    e.target.value = state.currentPage; // Reset to current page if invalid
                }
            });

            pageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= state.totalPages) {
                        this.loadCategoryMovies(this.getContainerIdByCategory(category), category, state.moviesPerPage, page);
                    } else {
                        e.target.value = state.currentPage;
                    }
                }
            });
        }
    }

    getContainerIdByCategory(category) {
        const categoryMap = {
            'chautinhtri': 'korean-movies',
            'thanhlong': 'chinese-movies',
            'lylienkiet': 'top-ranked-movies',
            'adult': 'adult-movies'
        };
        return categoryMap[category] || 'latest-movies';
    }

    loadLatestMovies(containerId, limit = 12) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ Container not found: ${containerId}`);
            return;
        }

        // Get latest movies (first 12 from the list)
        const latestMovies = this.movies.slice(0, limit);
        console.log(`📂 Loading ${latestMovies.length} latest movies into container '${containerId}'`);
        
        container.innerHTML = latestMovies.map(movie => this.createMovieCard(movie)).join('');
        
        if (latestMovies.length > 0) {
            console.log(`✅ Successfully loaded ${latestMovies.length} latest movies`);
        }
    }

    loadTopRankedMovies(containerId, limit = 8) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Get top ranked movies (mix of different categories)
        const topMovies = this.movies
            .sort(() => Math.random() - 0.5) // Randomize for demo
            .slice(0, limit);

        container.innerHTML = topMovies.map(movie => this.createMovieCard(movie, true)).join('');
    }

    createMovieCard(movie, isRanked = false) {
        const categoryName = this.categories[movie.category] || movie.category;
        const hasVideo = movie.videoLink && movie.videoLink !== '#';
        const randomViews = movie.views || Math.floor(Math.random() * 2000000) + 100000;
        const randomYear = movie.year || (2020 + Math.floor(Math.random() * 5));
        const isAdult = movie.category === 'adult';

        return `
        <div class="movie-card ${isAdult ? 'adult-movie' : ''}" onclick="movieDataManager.openMovie('${movie.id}')">
            <div class="movie-poster">
                <img src="${this.getMovieImage(movie)}" alt="${movie.title}" 
                     onload="this.style.opacity=1" 
                     style="opacity:0; transition: opacity 0.3s ease;"
                     onerror="this.src='https://images.unsplash.com/photo-1489599803000-0b0a4b0b0b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'">
                <div class="movie-overlay">
                    <div class="play-button">${hasVideo ? '▶' : '⏸'}</div>
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p>${categoryName}</p>
                        <p>${movie.actor}</p>
                        ${hasVideo ? '<span class="video-available">Có video</span>' : '<span class="video-unavailable">Chưa có video</span>'}
                        ${isAdult ? '<span class="adult-badge">🔞 18+</span>' : ''}
                    </div>
                </div>
                ${isRanked ? `<div class="movie-rank">${this.getMovieRank(movie)}</div>` : ''}
            </div>
            <div class="movie-details">
                <h3 class="movie-title" title="${movie.title}">${movie.title}</h3>
                <p class="movie-category">${categoryName}</p>
                <p class="movie-actor">${movie.actor}</p>
                <div class="movie-meta">
                    <span class="movie-year">${randomYear}</span>
                    <span class="movie-views">${this.formatViews(randomViews)}</span>
                </div>
            </div>
        </div>
        `;
    }

    getMovieRank(movie) {
        // Simple ranking based on category
        const rankMap = {
            'chautinhtri': '⭐',
            'thanhlong': '🔥',
            'lylienkiet': '💪',
            'capba': '🔞',
            'daohaitac': '🏴‍☠️',
            'phim18': '🔞',
            'onepiece': '🏴‍☠️',
            'lamchanhanh': '👨‍💼',
            'chungtudon': '🥋',
            'tng_hp': '💕'
        };
        return rankMap[movie.category] || '🎬';
    }

    formatViews(views) {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        } else if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    }

    getMovieImage(movie) {
        // Check if it's an adult movie first
        if (movie.category === 'adult' && window.adultImageMapping) {
            const imageName = window.adultImageMapping[movie.id];
            if (imageName) {
                return `https://hentaiz.bot/img/400/2024/11/08/${imageName}`;
            }
        }
        
        // Try to get image from regular mapping
        const imageName = movieImageMapping[movie.id];
        if (imageName) {
            return `img/${imageName}`;
        }
        
        // Try to find image by title keywords
        if (movie.title) {
            const titleWords = movie.title.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(' ')
                .filter(word => word.length > 2);
            
            // Look for matching image files in regular mapping
            for (const [imageId, imageName] of Object.entries(movieImageMapping)) {
                const imageNameWithoutExt = imageName.replace('.webp', '').toLowerCase();
                if (titleWords.some(word => imageNameWithoutExt.includes(word))) {
                    return `img/${imageName}`;
                }
            }
        }
        
        // Fallback to random placeholder
        return `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80`;
    }

    openMovie(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            const randomViews = Math.floor(Math.random() * 2000000) + 100000;
            const randomYear = 2020 + Math.floor(Math.random() * 5);
            const categoryName = this.categories[movie.category] || movie.category;
            
            const movieData = {
                id: movie.id,
                name: movie.title,
                originalTitle: movie.originalTitle,
                year: randomYear.toString(),
                view: randomViews,
                img: this.getMovieImage(movie),
                info: movie.description || `Phim ${categoryName} với diễn viên ${movie.actor}. Một tác phẩm điện ảnh hấp dẫn với cốt truyện kịch tính và diễn xuất chuyên nghiệp.`,
                link: movie.videoLink,
                category: movie.category,
                actor: movie.actor,
                filePath: movie.filePath
            };
            
            const encodedData = encodeURIComponent(JSON.stringify(movieData));
            // Chuyển đến trang chi tiết phim trong cùng tab
            window.location.href = `movie-detail.html?data=${encodedData}`;
        }
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        const results = this.movies.filter(movie => 
            movie.title.toLowerCase().includes(query.toLowerCase()) ||
            movie.actor.toLowerCase().includes(query.toLowerCase()) ||
            (this.categories[movie.category] && this.categories[movie.category].toLowerCase().includes(query.toLowerCase()))
        );
        
        console.log('Search results:', results);
        // You can implement search results display here
    }

    handleFilter(category) {
        console.log('Filter by category:', category);
        
        // Update all movie lists with filtered data
        const filteredMovies = this.movies.filter(movie => movie.category === category);
        
        // Update each category section
        this.loadCategoryMovies('korean-movies', category, 8);
        this.loadCategoryMovies('chinese-movies', category, 8);
        this.loadCategoryMovies('latest-movies', category, 12);
        this.loadCategoryMovies('top-ranked-movies', category, 8);
        
        // Update trending list
        this.loadTrendingMovies();
    }

    handleNavigation(page) {
        console.log('Navigate to page:', page);
        // You can implement navigation logic here
    }

    loadTrendingMovies() {
        // Load trending movies from different categories
        const trendingMovies = this.movies
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        
        const container = document.getElementById('trending-list');
        if (container) {
            container.innerHTML = trendingMovies.map((movie, index) => `
                <li class="trending-item" onclick="movieDataManager.openMovie('${movie.id}')">
                <span class="item-rank">${index + 1}</span>
                <div class="item-info">
                        <p class="item-title">${movie.title}</p>
                        <p class="item-views">${Math.floor(Math.random() * 100000) + 1000} lượt quan tâm</p>
                </div>
            </li>
        `).join('');
        }
    }
}

// Initialize when DOM is loaded
let movieDataManager;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing MovieDataManager...');
    movieDataManager = new MovieDataManager();
    window.movieDataManager = movieDataManager; // Make it globally accessible
    console.log('✅ MovieDataManager initialized');
});