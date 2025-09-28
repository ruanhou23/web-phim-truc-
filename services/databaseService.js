const mongoose = require('mongoose');

class DatabaseService {
    constructor() {
        this.mongoConnected = false;
    }

    // Check MongoDB connection
    checkMongoConnection() {
        return mongoose.connection.readyState === 1;
    }

    // Get database status
    getStatus() {
        return {
            mongodb: this.checkMongoConnection(),
            timestamp: new Date().toISOString()
        };
    }

    // Save to MongoDB
    async saveToMongo(collection, data) {
        if (!this.checkMongoConnection()) {
            throw new Error('MongoDB not connected');
        }

        try {
            const Model = mongoose.model(collection);
            const document = new Model(data);
            return await document.save();
        } catch (error) {
            console.error('MongoDB save error:', error);
            throw error;
        }
    }

    // Get from MongoDB
    async getFromMongo(collection, query = {}) {
        if (!this.checkMongoConnection()) {
            throw new Error('MongoDB not connected');
        }

        try {
            const Model = mongoose.model(collection);
            return await Model.find(query);
        } catch (error) {
            console.error('MongoDB get error:', error);
            throw error;
        }
    }

    // Update in MongoDB
    async updateInMongo(collection, id, data) {
        if (!this.checkMongoConnection()) {
            throw new Error('MongoDB not connected');
        }

        try {
            const Model = mongoose.model(collection);
            return await Model.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            console.error('MongoDB update error:', error);
            throw error;
        }
    }

    // Delete from MongoDB
    async deleteFromMongo(collection, id) {
        if (!this.checkMongoConnection()) {
            throw new Error('MongoDB not connected');
        }

        try {
            const Model = mongoose.model(collection);
            return await Model.findByIdAndDelete(id);
        } catch (error) {
            console.error('MongoDB delete error:', error);
            throw error;
        }
    }

    // Count documents in MongoDB
    async countInMongo(collection, query = {}) {
        if (!this.checkMongoConnection()) {
            throw new Error('MongoDB not connected');
        }

        try {
            const Model = mongoose.model(collection);
            return await Model.countDocuments(query);
        } catch (error) {
            console.error('MongoDB count error:', error);
            throw error;
        }
    }
}

module.exports = new DatabaseService();