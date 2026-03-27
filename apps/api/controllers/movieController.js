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

// Create a new movie
exports.createMovie = async (req, res) => {
    try {
        const newMovie = {
            id: (mockMovies.length + 1).toString(),
            ...req.body,
            createdAt: new Date()
        };
        mockMovies.push(newMovie);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all movies
exports.getAllMovies = async (req, res) => {
    try {
        res.status(200).json(mockMovies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a movie by ID
exports.getMovieById = async (req, res) => {
    try {
        const movie = mockMovies.find(m => m.id === req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a movie by ID
exports.updateMovie = async (req, res) => {
    try {
        const movieIndex = mockMovies.findIndex(m => m.id === req.params.id);
        if (movieIndex === -1) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        mockMovies[movieIndex] = { ...mockMovies[movieIndex], ...req.body };
        res.status(200).json(mockMovies[movieIndex]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a movie by ID
exports.deleteMovie = async (req, res) => {
    try {
        const movieIndex = mockMovies.findIndex(m => m.id === req.params.id);
        if (movieIndex === -1) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        mockMovies.splice(movieIndex, 1);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};