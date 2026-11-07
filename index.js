document.addEventListener('DOMContentLoaded', async () => {
    let initialQuery = 'horror';
    let movies = await fetchMovies(initialQuery); 

    displayMovies(movies);

    document.getElementById('searchForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const query = document.getElementById('searchInput').value; 
        movies = await fetchMovies(query); // Fetch movies based on search input
        console.log(movies);

        const searchMessage = document.getElementById('resultsInfo'); 
        searchMessage.textContent = `Showing results for: "${query}"`;

        displayMovies(movies);

        if (!movies || movies.length === 0) {
            console.log("No movies found.");
            document.getElementById('movie-grid').innerHTML = '<p>No movies found. Please try a different search.</p>';
            return;
        } 

        const sortSelect = document.getElementById('sortSelect').value;
        console.log("sort select", sortSelect); 
        let sortedMovies = movies;

        if (sortSelect) {
            sortedMovies = sortMovies(movies, sortSelect);
            console.log("sorted movies", sortedMovies);
        }

        displayMovies(sortedMovies);
    });

    document.getElementById('sortSelect').addEventListener('change', (event) => {
        if (movies.length === 0) return;
        const sortSelect = event.target.value;
        const sortedMovies = sortMovies(movies, sortSelect);
        displayMovies(sortedMovies);
    });
});


async function fetchMovies(query) {
    const apiKey = '3ad3648f';
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
    return data.Search;
}


function sortMovies(movies, sortSelect) {
    if (sortSelect === 'asc') {
        return movies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortSelect === 'desc') {
        return movies.sort((a, b) => b.Title.localeCompare(a.Title));
    }
    else if (sortSelect === 'newest') {
         return movies.sort((a, b) => parseInt(b.Year, 10) - parseInt(a.Year, 10));
    }
    else if (sortSelect === 'oldest') {
         return movies.sort((a, b) => parseInt(a.Year, 10) - parseInt(b.Year, 10));
    }
    return movies;
}



async function fetchAndDisplayMovies(query) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=3ad3648f&s=${query}`);
    
    if (response.ok) {
        const data = await response.json();
        const movies = data.Search; 
        displayMovies(movies); 
    } else {
        console.error('Error fetching data:', response.statusText);
        displayMovies([]); 
    }
}


async function displayMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = ''; 

    const movieCards = movies.map(movie => {
        return `
            <div class="movie-card">
                <img src="${movie.Poster}" alt="${movie.Title}" class="movie-card__img">
                <div class="movie-info">
                    <h2 class="movie-card__title">${movie.Title}</h2>
                    <p class="movie-card__year">${movie.Year}</p>
                </div>
            </div>
        `;
    }).join('');

    movieGrid.innerHTML = movieCards;
}


function handleImageError(image) {
    console.log('Image failed to load');
    const posterDiv = image.parentElement;
    posterDiv.classList.add('error');
    image.style.display = 'none';
}

