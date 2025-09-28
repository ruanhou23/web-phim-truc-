#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Database Setup Script');
console.log('========================\n');

// Check if MongoDB is installed
function checkMongoDB() {
    return new Promise((resolve) => {
        exec('mongod --version', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ MongoDB not found');
                resolve(false);
            } else {
                console.log('✅ MongoDB is installed');
                console.log(`   Version: ${stdout.split('\n')[0]}`);
                resolve(true);
            }
        });
    });
}

// Check if MongoDB service is running
function checkMongoService() {
    return new Promise((resolve) => {
        exec('mongosh --eval "db.runCommand({ping: 1})" --quiet', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ MongoDB service not running');
                resolve(false);
            } else {
                console.log('✅ MongoDB service is running');
                resolve(true);
            }
        });
    });
}

// Start MongoDB service
function startMongoService() {
    return new Promise((resolve) => {
        console.log('🔄 Starting MongoDB service...');
        
        // Try different commands based on OS
        const commands = [
            'net start MongoDB',
            'brew services start mongodb-community',
            'sudo systemctl start mongod',
            'mongod --dbpath ./data/db'
        ];
        
        let commandIndex = 0;
        
        function tryNextCommand() {
            if (commandIndex >= commands.length) {
                console.log('❌ Could not start MongoDB service');
                console.log('💡 Please start MongoDB manually:');
                console.log('   Windows: net start MongoDB');
                console.log('   macOS: brew services start mongodb-community');
                console.log('   Linux: sudo systemctl start mongod');
                resolve(false);
                return;
            }
            
            const command = commands[commandIndex];
            console.log(`   Trying: ${command}`);
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    commandIndex++;
                    setTimeout(tryNextCommand, 1000);
                } else {
                    console.log('✅ MongoDB service started');
                    resolve(true);
                }
            });
        }
        
        tryNextCommand();
    });
}

// Create data directory
function createDataDirectory() {
    const dataDir = path.join(__dirname, 'data', 'db');
    
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`✅ Created data directory: ${dataDir}`);
    } else {
        console.log(`✅ Data directory exists: ${dataDir}`);
    }
}

// Test database connection
function testConnection() {
    return new Promise((resolve) => {
        console.log('🔄 Testing database connection...');
        
        const mongoose = require('mongoose');
        const mongoURI = 'mongodb://localhost:27017/nhanphim-platform';
        
        mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        }).then(() => {
            console.log('✅ Database connection successful');
            mongoose.connection.close();
            resolve(true);
        }).catch((error) => {
            console.log('❌ Database connection failed:', error.message);
            resolve(false);
        });
    });
}

// Main setup function
async function setupDatabases() {
    try {
        console.log('1. Checking MongoDB installation...');
        const mongoInstalled = await checkMongoDB();
        
        if (!mongoInstalled) {
            console.log('\n📥 MongoDB Installation Guide:');
            console.log('   Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/');
            console.log('   macOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/');
            console.log('   Linux: https://docs.mongodb.com/manual/administration/install-on-linux/');
            console.log('\n   Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
            return;
        }
        
        console.log('\n2. Checking MongoDB service...');
        const mongoRunning = await checkMongoService();
        
        if (!mongoRunning) {
            console.log('\n3. Starting MongoDB service...');
            createDataDirectory();
            const started = await startMongoService();
            
            if (!started) {
                console.log('\n❌ Could not start MongoDB automatically');
                console.log('💡 Please start MongoDB manually and run this script again');
                return;
            }
        }
        
        console.log('\n4. Testing database connection...');
        const connected = await testConnection();
        
        if (connected) {
            console.log('\n🎉 Database setup completed successfully!');
            console.log('\n📋 Next steps:');
            console.log('   1. Run: npm start');
            console.log('   2. Open: http://localhost:5000/user/auth.html');
            console.log('   3. Register a new account');
            console.log('   4. Check data in MongoDB');
        } else {
            console.log('\n❌ Database setup failed');
            console.log('💡 Please check MongoDB installation and try again');
        }
        
    } catch (error) {
        console.error('❌ Setup error:', error.message);
    }
}

// Run setup
if (require.main === module) {
    setupDatabases();
}

module.exports = { setupDatabases };
