const express = require('express');
const movieRoutes = require('./routes/movieRoutes');

const router = express.Router();

// Routes
router.use('/movies', movieRoutes);

// Export the router
module.exports = router;