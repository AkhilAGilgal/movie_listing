const { useState, useEffect } = React;


const API_KEY = '600d918d'; 
const API_URL = `https://www.omdbapi.com?apikey=${API_KEY}`;

const MovieCard = ({ movie }) => {
    return (
        <div className="movie">
            <div>
                <p>{movie.Year}</p>
            </div>
            <div>
                <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'}
                    alt={movie.Title}
                />
            </div>
            <div>
                <span>{movie.Type}</span>
                <h3>{movie.Title}</h3>
            </div>
        </div>
    );
};


function App() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchMovies = async (title) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}&s=${title}`);
            const data = await response.json();

            if (data.Response === 'True') {
                setMovies(data.Search);
            } else {
                setMovies([]);
                setError(data.Error);
            }
        } catch (err) {
            setError('Failed to fetch movies. Please try again later.');
        }
        setIsLoading(false);
    };

   
    useEffect(() => {
        searchMovies('Batman');
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            searchMovies(searchTerm);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="app">
            <h1>MovieLand</h1>

            <div className="search">
                <input
                    placeholder="Search for movies"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>
                    Search
                </button>
            </div>

            {isLoading ? (
                <div className="empty"><h2>Loading...</h2></div>
            ) : error ? (
                <div className="empty"><h2>{error}</h2></div>
            ) : movies?.length > 0 ? (
                <div className="container">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.imdbID} />
                    ))}
                </div>
            ) : (
                <div className="empty">
                    <h2>No movies found</h2>
                </div>
            )}
        </div>
    );
}
