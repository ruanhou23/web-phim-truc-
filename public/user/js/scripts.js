document.addEventListener('DOMContentLoaded', function() {
    // Sample movie data for demonstration
    const sampleMovies = {
        korean: [
            { id: 1, title: 'Tên Phim 1', image: 'https://placehold.co/180x250/333/fff?text=Korean+1', category: 'korean' },
            { id: 2, title: 'Tên Phim 2', image: 'https://placehold.co/180x250/333/fff?text=Korean+2', category: 'korean' },
            { id: 3, title: 'Tên Phim 3', image: 'https://placehold.co/180x250/333/fff?text=Korean+3', category: 'korean' },
            { id: 4, title: 'Tên Phim 4', image: 'https://placehold.co/180x250/333/fff?text=Korean+4', category: 'korean' },
            { id: 5, title: 'Tên Phim 5', image: 'https://placehold.co/180x250/333/fff?text=Korean+5', category: 'korean' },
            { id: 6, title: 'Tên Phim Dài Hơn Một Chút', image: 'https://placehold.co/180x250/333/fff?text=Korean+6', category: 'korean' }
        ],
        chinese: [
            { id: 7, title: 'Tên Phim A', image: 'https://placehold.co/180x250/444/fff?text=Chinese+A', category: 'chinese' },
            { id: 8, title: 'Tên Phim B', image: 'https://placehold.co/180x250/444/fff?text=Chinese+B', category: 'chinese' },
            { id: 9, title: 'Tên Phim C', image: 'https://placehold.co/180x250/444/fff?text=Chinese+C', category: 'chinese' },
            { id: 10, title: 'Tên Phim D', image: 'https://placehold.co/180x250/444/fff?text=Chinese+D', category: 'chinese' },
            { id: 11, title: 'Tên Phim E', image: 'https://placehold.co/180x250/444/fff?text=Chinese+E', category: 'chinese' },
            { id: 12, title: 'Tên Phim F', image: 'https://placehold.co/180x250/444/fff?text=Chinese+F', category: 'chinese' }
        ],
        latest: [
            { id: 13, title: 'Zombie Movie', image: 'https://placehold.co/180x250/555/fff?text=Movie+Z', category: 'latest' },
            { id: 14, title: 'Great Robbery', image: 'https://placehold.co/180x250/555/fff?text=Movie+Y', category: 'latest' },
            { id: 15, title: 'Blue Beetle', image: 'https://placehold.co/180x250/555/fff?text=Movie+X', category: 'latest' },
            { id: 16, title: 'Oppenheimer', image: 'https://placehold.co/180x250/555/fff?text=Movie+W', category: 'latest' },
            { id: 17, title: 'Past Lives', image: 'https://placehold.co/180x250/555/fff?text=Movie+V', category: 'latest' },
            { id: 18, title: 'Windmill', image: 'https://placehold.co/180x250/555/fff?text=Movie+U', category: 'latest' }
        ],
        topRanked: [
            { id: 19, title: 'Phố Sơn Hải', image: 'https://placehold.co/190x270/666/fff?text=Phố+Sơn+Hải', rank: 1, category: 'top-ranked' },
            { id: 20, title: 'Phò Mã', image: 'https://placehold.co/190x270/666/fff?text=Phò+Mã', rank: 2, category: 'top-ranked' },
            { id: 21, title: 'Giông Tố', image: 'https://placehold.co/190x270/666/fff?text=Giông+Tố', rank: 3, category: 'top-ranked' },
            { id: 22, title: 'Hạ Lệnh Săn Bắt', image: 'https://placehold.co/190x270/666/fff?text=Hạ+Lệnh+Săn+Bắt', rank: 4, category: 'top-ranked' }
        ]
    };

    // Initialize the page
    initializePage();
    
    // Check login status
    checkUserLoginStatus();

    function initializePage() {
        loadAllMovies();
        setupEventListeners();
    }

    function loadAllMovies() {
        loadMovies('korean-movies', sampleMovies.korean);
        loadMovies('chinese-movies', sampleMovies.chinese);
        loadMovies('latest-movies', sampleMovies.latest);
        loadTopRankedMovies('top-ranked-movies', sampleMovies.topRanked);
    }

    function loadMovies(containerId, movies) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = createMovieItem(movie);
            container.appendChild(movieItem);
        });
    }

    function loadTopRankedMovies(containerId, movies) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = createTopRankedMovieItem(movie);
            container.appendChild(movieItem);
        });
    }

    function createMovieItem(movie) {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}" loading="lazy">
            <div class="movie-overlay">
                <div class="movie-play-btn"></div>
            </div>
            <p class="movie-title">${movie.title}</p>
            <div class="movie-rating">
                <span>⭐</span>
                <span>${(Math.random() * 2 + 3).toFixed(1)}</span>
            </div>
            <div class="movie-year">${2020 + Math.floor(Math.random() * 4)}</div>
        `;
        
        movieItem.addEventListener('click', () => {
            playMovie(movie);
        });

        return movieItem;
    }

    function createTopRankedMovieItem(movie) {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <span class="rank-number">${movie.rank}</span>
            <img src="${movie.image}" alt="${movie.title}" loading="lazy">
            <div class="movie-overlay">
                <div class="movie-play-btn"></div>
            </div>
            <p class="movie-title">${movie.title}</p>
            <div class="movie-rating">
                <span>⭐</span>
                <span>${(Math.random() * 2 + 3).toFixed(1)}</span>
            </div>
            <div class="movie-year">${2020 + Math.floor(Math.random() * 4)}</div>
        `;
        
        movieItem.addEventListener('click', () => {
            playMovie(movie);
        });

        return movieItem;
    }

    function playMovie(movie) {
        // This would typically open a movie player or navigate to movie details
        console.log('Playing movie:', movie.title);
        alert(`Đang phát: ${movie.title}`);
    }

    function setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => handleFilterClick(button));
        });

        // Navigation menu
        setupNavigationMenu();

        // Mobile menu toggle
        setupMobileMenu();

        // Scroll to top button
        setupScrollToTop();

        // Login/Register buttons
        const loginBtn = document.querySelector('.login-btn');
        const registerBtn = document.querySelector('.register-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleLogin();
            });
        }
        
        if (registerBtn) {
            registerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                handleRegister();
            });
        }

        // Play button in hero section
        const playButton = document.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                e.preventDefault();
                playFeaturedMovie();
            });
        }
    }

    function setupNavigationMenu() {
        // Main navigation links
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handleNavigation(link);
            });
        });

        // Dropdown menu items
        const genreLinks = document.querySelectorAll('.dropdown-menu a[data-genre]');
        genreLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handleGenreFilter(link);
            });
        });

        const countryLinks = document.querySelectorAll('.dropdown-menu a[data-country]');
        countryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                handleCountryFilter(link);
            });
        });
    }

    function handleNavigation(link) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
        });

        // Add active class to clicked link
        link.classList.add('active');

        const page = link.getAttribute('data-page');
        console.log('Navigating to:', page);

        // Handle different page navigation
        switch(page) {
            case 'home':
                showHomePage();
                break;
            case 'genres':
                showGenresPage();
                break;
            case 'countries':
                showCountriesPage();
                break;
            case 'new-movies':
                showNewMoviesPage();
                break;
            case 'series':
                showSeriesPage();
                break;
            case 'movies':
                showMoviesPage();
                break;
            case 'dubbed':
                showDubbedPage();
                break;
            case 'cinema':
                showCinemaPage();
                break;
            case 'tv-show':
                showTVShowPage();
                break;
            default:
                console.log('Page not implemented:', page);
        }
    }

    function handleGenreFilter(link) {
        const genre = link.getAttribute('data-genre');
        console.log('Filter by genre:', genre);
        
        // Update active state
        document.querySelectorAll('.dropdown-menu a').forEach(dropdownLink => {
            dropdownLink.classList.remove('active');
        });
        link.classList.add('active');

        // Filter movies by genre
        filterMoviesByGenre(genre);
    }

    function handleCountryFilter(link) {
        const country = link.getAttribute('data-country');
        console.log('Filter by country:', country);
        
        // Update active state
        document.querySelectorAll('.dropdown-menu a').forEach(dropdownLink => {
            dropdownLink.classList.remove('active');
        });
        link.classList.add('active');

        // Filter movies by country
        filterMoviesByCountry(country);
    }

    function showHomePage() {
        console.log('Showing home page');
        // Show all movie categories
        document.querySelectorAll('.movie-category').forEach(category => {
            category.style.display = 'block';
        });
    }

    function showGenresPage() {
        console.log('Showing genres page');
        // This would show a dedicated genres page
        alert('Trang thể loại sẽ được triển khai sớm!');
    }

    function showCountriesPage() {
        console.log('Showing countries page');
        // This would show a dedicated countries page
        alert('Trang quốc gia sẽ được triển khai sớm!');
    }

    function showNewMoviesPage() {
        console.log('Showing new movies page');
        // Show only new movies
        document.querySelectorAll('.movie-category').forEach(category => {
            if (category.querySelector('.category-title').textContent.includes('Mới')) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    }

    function showSeriesPage() {
        console.log('Showing series page');
        alert('Trang phim bộ sẽ được triển khai sớm!');
    }

    function showMoviesPage() {
        console.log('Showing movies page');
        alert('Trang phim lẻ sẽ được triển khai sớm!');
    }

    function showDubbedPage() {
        console.log('Showing dubbed movies page');
        alert('Trang phim thuyết minh sẽ được triển khai sớm!');
    }

    function showCinemaPage() {
        console.log('Showing cinema movies page');
        alert('Trang phim chiếu rạp sẽ được triển khai sớm!');
    }

    function showTVShowPage() {
        console.log('Showing TV shows page');
        alert('Trang TV Show sẽ được triển khai sớm!');
    }

    function filterMoviesByGenre(genre) {
        console.log('Filtering movies by genre:', genre);
        // This would filter movies based on genre
        // For now, just show an alert
        alert(`Đang lọc phim theo thể loại: ${genre}`);
    }

    function filterMoviesByCountry(country) {
        console.log('Filtering movies by country:', country);
        // This would filter movies based on country
        // For now, just show an alert
        alert(`Đang lọc phim theo quốc gia: ${country}`);
    }

    // This function is now replaced by the enhanced version above

    function handleFilterClick(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        console.log('Filter by category:', category);
        
        // Here you would typically filter movies by category
        // For now, we'll just log the category
    }

    function handleLogin() {
        console.log('Login clicked');
        // Redirect to auth page
        window.location.href = 'auth.html';
    }

    function handleRegister() {
        console.log('Register clicked');
        // Redirect to auth page
        window.location.href = 'auth.html';
    }

    function playFeaturedMovie() {
        console.log('Playing featured movie');
        alert('Đang phát phim nổi bật: Lệnh Trừng Phạt');
    }

    // Function to fetch movies from API (for future use)
    function fetchMoviesFromAPI() {
        fetch('/api/movies')
            .then(response => response.json())
            .then(data => {
                console.log('Movies from API:', data);
                // Update the UI with real data from API
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                // Fallback to sample data
                loadAllMovies();
            });
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                }
            });
        }

        // Mobile dropdown functionality
        const mobileDropdowns = mobileNav.querySelectorAll('.dropdown');
        mobileDropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        });
    }

    // Scroll to top functionality
    function setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        
        if (scrollToTopBtn) {
            // Show/hide scroll to top button based on scroll position
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            });

            // Scroll to top when button is clicked
            scrollToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Enhanced search with debouncing
    let searchTimeout;
    function handleSearch(event) {
        clearTimeout(searchTimeout);
        const searchTerm = event.target.value.toLowerCase();
        
        searchTimeout = setTimeout(() => {
            console.log('Searching for:', searchTerm);
            
            if (searchTerm.length < 2) {
                // Show all movies if search term is too short
                document.querySelectorAll('.movie-item').forEach(item => {
                    item.style.display = 'block';
                });
                return;
            }
            
            // Filter all movie lists based on search term
            const allMovieItems = document.querySelectorAll('.movie-item');
            let visibleCount = 0;
            
            allMovieItems.forEach(item => {
                const title = item.querySelector('.movie-title').textContent.toLowerCase();
                const isVisible = title.includes(searchTerm);
                item.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleCount++;
            });

            // Show "no results" message if no movies found
            showSearchResults(visibleCount, searchTerm);
        }, 300);
    }

    function showSearchResults(count, searchTerm) {
        // Remove existing search results message
        const existingMessage = document.querySelector('.search-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (count === 0 && searchTerm.length >= 2) {
            const message = document.createElement('div');
            message.className = 'search-results-message';
            message.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #a9aabc;">
                    <h3>Không tìm thấy phim nào</h3>
                    <p>Không có kết quả nào cho từ khóa "${searchTerm}"</p>
                </div>
            `;
            document.querySelector('.container').appendChild(message);
        }
    }

    // Smooth scrolling for anchor links
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Initialize smooth scrolling
    setupSmoothScrolling();

    // Check user login status
    function checkUserLoginStatus() {
        const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
        
        if (user) {
            updateUserInterface(user);
        }
    }

    function updateUserInterface(user) {
        const userActions = document.querySelector('.user-actions');
        if (userActions) {
            userActions.innerHTML = `
                <div class="user-info">
                    <span class="user-email">${user.name || user.email || 'User'}</span>
                    <div class="user-dropdown">
                        <button class="user-avatar">👤</button>
                        <div class="user-menu">
                            <a href="#" class="user-menu-item">Hồ sơ</a>
                            <a href="#" class="user-menu-item">Cài đặt</a>
                            <a href="#" class="user-menu-item" onclick="logout()">Đăng xuất</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Logout function
    window.logout = function() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Reload page to update UI
        window.location.reload();
    };

    // Optional: Load real data from API
    // fetchMoviesFromAPI();
});