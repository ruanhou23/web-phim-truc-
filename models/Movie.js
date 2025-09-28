const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    duration: {
        type: Number, // in minutes
        default: null
    },
    director: {
        type: String,
        default: null
    },
    cast: {
        type: [String],
        default: []
    },
    country: {
        type: String,
        required: true
    },
    language: {
        type: [String],
        default: ['Vietnamese']
    },
    imageUrl: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: null
    },
    trailerUrl: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isTrending: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    publishedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ year: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ views: -1 });
movieSchema.index({ status: 1 });
movieSchema.index({ isFeatured: 1 });
movieSchema.index({ isTrending: 1 });
movieSchema.index({ createdAt: -1 });

// Virtual for average rating
movieSchema.virtual('averageRating').get(function() {
    return this.rating || 0;
});

// Virtual for movie duration in hours
movieSchema.virtual('durationHours').get(function() {
    if (!this.duration) return null;
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
});

module.exports = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
