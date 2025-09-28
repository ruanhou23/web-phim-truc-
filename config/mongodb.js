const mongoose = require('mongoose');

// MongoDB connection configuration
const connectMongoDB = async () => {
    try {
        // Try multiple MongoDB connection options
        const mongoOptions = [
            process.env.MONGODB_URI,
            'mongodb://localhost:27017/nhanphim-platform',
            'mongodb://127.0.0.1:27017/nhanphim-platform',
            'mongodb://0.0.0.0:27017/nhanphim-platform'
        ];

        let connected = false;
        let lastError = null;

        for (const mongoURI of mongoOptions) {
            if (!mongoURI) continue;
            
            try {
                console.log(`🔄 Trying MongoDB connection: ${mongoURI}`);
                
                const options = {
                    serverSelectionTimeoutMS: 5000, // 5 second timeout
                    connectTimeoutMS: 10000, // 10 second timeout
                };

                await mongoose.connect(mongoURI, options);
                
                console.log('✅ MongoDB connected successfully');
                console.log(`   Database: ${mongoose.connection.db.databaseName}`);
                console.log(`   Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
                connected = true;
                break;
            } catch (error) {
                lastError = error;
                console.log(`❌ Failed to connect to: ${mongoURI}`);
                continue;
            }
        }

        if (!connected) {
            throw lastError || new Error('No MongoDB connection available');
        }
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.log('💡 To fix MongoDB connection:');
        console.log('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
        console.log('   2. Start MongoDB service');
        console.log('   3. Or use MongoDB Atlas (cloud)');
        return false;
    }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('📡 MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('📡 MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('📡 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
        process.exit(1);
    }
});

module.exports = { connectMongoDB };
