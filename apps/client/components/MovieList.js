import React, { useEffect, useState } from 'react';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('/api/movies');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Movie List</h2>
            <ul>
                {movies.map(movie => (
                    <li key={movie._id}>
                        <h3>{movie.title}</h3>
                        <p>{movie.description}</p>
                        <video controls>
                            <source src={movie.videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MovieList;