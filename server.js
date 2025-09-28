const express = require('express');
const mongoose = require('mongoose');
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

// Database connection
let mongoConnected = false;

// MongoDB Connection
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        mongoConnected = true;
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('📝 MongoDB is required for this application');
        mongoConnected = false;
    });
} else {
    console.log('📝 MongoDB not configured - please set MONGODB_URI in .env file');
}

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
    console.log(`   MongoDB: ${mongoConnected ? '✅ Connected' : '❌ Not connected'}`);
    console.log('   Server ready to handle requests\n');
}, 1000);

// Import models
const User = require('./models/User');
const Movie = require('./models/Movie');

// API routes
app.use('/api', apiRoutes);

// Auth API endpoints
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
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
        const user = new User({
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
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Đăng ký thành công!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
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
        const user = await User.findOne({ email });
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
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
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
                id: user._id,
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
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
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

// Movies API
app.get('/api/movies', async (req, res) => {
    try {
        const { page = 1, limit = 20, genre, search } = req.query;
        const query = {};
        
        if (genre) {
            query.genre = genre;
        }
        
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const movies = await Movie.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Movie.countDocuments(query);

        res.json({
            success: true,
            movies: movies,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalMovies: total
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
        const movie = await Movie.findById(req.params.id);
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
        const user = await User.findById(req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thêm phim'
            });
        }

        const { title, description, genre, year, rating, imageUrl, videoUrl } = req.body;
        
        const movie = new Movie({
            title,
            description,
            genre,
            year,
            rating,
            imageUrl,
            videoUrl,
            createdBy: req.user.userId
        });

        await movie.save();

        res.json({
            success: true,
            message: 'Thêm phim thành công!',
            movie: movie
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
        const user = await User.findById(req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật phim'
            });
        }

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: new Date() },
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Phim không tồn tại'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật phim thành công!',
            movie: movie
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
        const user = await User.findById(req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa phim'
            });
        }

        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Phim không tồn tại'
            });
        }

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
        
        const user = await User.findOne({ email, role: 'admin' });
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
                userId: user._id, 
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
                id: user._id,
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
        const user = await User.findById(req.user.userId);
        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập'
            });
        }

        const totalMovies = await Movie.countDocuments();
        const totalUsers = await User.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayUsers = await User.countDocuments({ lastLogin: { $gte: today } });

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
            mongodb: mongoConnected,
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