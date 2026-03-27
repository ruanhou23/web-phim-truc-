const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const apiRoutes = require('./apps/api/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Database connection status
let dbConnected = false;

// JWT Middleware
const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Database Status Check
setTimeout(() => {
    console.log('\n📊 Database Status:');
    console.log(`   Database: ${dbConnected ? '✅ Connected' : '❌ Not connected'}`);
    console.log('   Server ready to handle requests\n');
}, 1000);

// API routes
app.use('/api', apiRoutes);

// Mock user data
const mockUsers = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        name: 'Admin User',
        phone: '0123456789',
        role: 'admin',
        isActive: true,
        lastLogin: new Date()
    }
];

// Auth API endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        
        // Check if user already exists
        const existingUser = mockUsers.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được sử dụng'
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = {
            id: (mockUsers.length + 1).toString(),
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'user',
            isActive: true,
            lastLogin: new Date(),
            preferences: {
                language: 'vi',
                theme: 'dark',
                notifications: {
                    email: true,
                    push: true
                }
            }
        };

        mockUsers.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: newUser.id, 
                email: newUser.email, 
                role: newUser.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Đăng ký thành công!',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            message: error.message || 'Có lỗi xảy ra khi đăng ký'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = mockUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không đúng'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị khóa'
            });
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Đăng nhập thành công!',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            success: false,
            message: 'Email hoặc mật khẩu không đúng'
        });
    }
});

app.post('/api/auth/verify-token', verifyToken, async (req, res) => {
    try {
        const user = mockUsers.find(u => u.id === req.user.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
});

// Mock movies data
const mockMovies = [
    {
        id: '1',
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins.',
        genre: 'Action',
        year: 2019,
        rating: 8.4,
        imageUrl: 'https://via.placeholder.com/300x400',
        videoUrl: '/videos/sample-video.mp4',
        createdAt: new Date('2023-01-01')
    },
    {
        id: '2',
        title: 'Spider-Man: No Way Home',
        description: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help.',
        genre: 'Action',
        year: 2021,
        rating: 8.2,
        imageUrl: 'https://via.placeholder.com/300x400',
        videoUrl: '/videos/sample-video.mp4',
        createdAt: new Date('2023-01-02')
    },
    {
        id: '3',
        title: 'The Batman',
        description: 'When a sadistic serial killer begins murdering key political figures in Gotham.',
        genre: 'Action',
        year: 2022,
        rating: 7.8,
        imageUrl: 'https://via.placeholder.com/300x400',
        videoUrl: '/videos/sample-video.mp4',
        createdAt: new Date('2023-01-03')
    }
];

// Movies API
app.get('/api/movies', async (req, res) => {
    try {
        const { page = 1, limit = 20, genre, search } = req.query;
        let filteredMovies = [...mockMovies];
        
        if (genre) {
            filteredMovies = filteredMovies.filter(movie => movie.genre === genre);
        }
        
        if (search) {
            filteredMovies = filteredMovies.filter(movie => 
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort by creation date (newest first)
        filteredMovies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

        res.json({
            success: true,
            movies: paginatedMovies,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(filteredMovies.length / limit),
                totalMovies: filteredMovies.length
            }
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tải danh sách phim'
        });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = mockMovies.find(m => m.id === req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Phim không tồn tại'
            });
        }

        res.json({
            success: true,
            movie: movie
        });
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi tải thông tin phim'
        });
    }
});

app.post('/api/movies', verifyToken, async (req, res) => {
    try {
        const user = mockUsers.find(u => u.id === req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thêm phim'
            });
        }

        const { title, description, genre, year, rating, imageUrl, videoUrl } = req.body;
        
        const newMovie = {
            id: (mockMovies.length + 1).toString(),
            title,
            description,
            genre,
            year,
            rating,
            imageUrl,
            videoUrl,
            createdBy: req.user.userId,
            createdAt: new Date()
        };

        mockMovies.push(newMovie);

        res.json({
            success: true,
            message: 'Thêm phim thành công!',
            movie: newMovie
        });
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi thêm phim'
        });
    }
});

app.put('/api/movies/:id', verifyToken, async (req, res) => {
    try {
        const user = mockUsers.find(u => u.id === req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật phim'
            });
        }

        const movieIndex = mockMovies.findIndex(m => m.id === req.params.id);
        if (movieIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Phim không tồn tại'
            });
        }

        mockMovies[movieIndex] = {
            ...mockMovies[movieIndex],
            ...req.body,
            updatedAt: new Date()
        };

        res.json({
            success: true,
            message: 'Cập nhật phim thành công!',
            movie: mockMovies[movieIndex]
        });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật phim'
        });
    }
});

app.delete('/api/movies/:id', verifyToken, async (req, res) => {
    try {
        const user = mockUsers.find(u => u.id === req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa phim'
            });
        }

        const movieIndex = mockMovies.findIndex(m => m.id === req.params.id);
        if (movieIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Phim không tồn tại'
            });
        }

        mockMovies.splice(movieIndex, 1);

        res.json({
            success: true,
            message: 'Xóa phim thành công!'
        });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xóa phim'
        });
    }
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// User routes
app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user', 'index.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

// Admin API routes
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = mockUsers.find(u => u.email === email && u.role === 'admin');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Tên đăng nhập hoặc mật khẩu không đúng'
            });
        }

        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            token
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đăng nhập'
        });
    }
});

app.get('/api/admin/stats', verifyToken, async (req, res) => {
    try {
        const user = mockUsers.find(u => u.id === req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập'
            });
        }

        const totalMovies = mockMovies.length;
        const totalUsers = mockUsers.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsers = mockUsers.filter(u => new Date(u.lastLogin) >= today).length;

        res.json({
            success: true,
            stats: {
                totalMovies,
                totalUsers,
                todayViews: todayUsers,
                monthlyRevenue: 0 // Placeholder
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy thống kê'
        });
    }
});

// Database status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'Database status retrieved',
        database: {
            connected: dbConnected,
            timestamp: new Date().toISOString()
        },
        server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version
        }
    });
});

// Start the server
const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`🚀 Server is running on http://localhost:${port}`);
        console.log(`📊 Database Status: http://localhost:${port}/api/status`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  Port ${port} is already in use, trying port ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('❌ Server error:', err);
            process.exit(1);
        }
    });
};

startServer(PORT);