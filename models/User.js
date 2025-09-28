const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    provider: {
        type: String,
        enum: ['email', 'google', 'facebook'],
        default: 'email'
    },
    photoURL: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    preferences: {
        language: {
            type: String,
            default: 'vi'
        },
        theme: {
            type: String,
            default: 'dark'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});

// Indexes for better performance (email and uid already have unique indexes)
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
