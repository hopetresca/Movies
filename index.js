document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const query = document.getElementById('searchInput').value; 
        const movies = await fetchMovies(query);
        console.log(movies);

        const searchMessage = document.getElementById('resultsInfo'); 
        searchMessage.textContent = `Showing results for: "${query}"`;

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
});



async function fetchMovies(query) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=3ad3648f&s=${query}`);
    if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data.Search || [];
    } 
    else {
        console.error('Error fetching data:', response.statusText);
        return [];
    }
}


function sortMovies(movies, sortSelect) {
    if (sortSelect === 'asc') {
        return movies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sortSelect === 'desc') {
        return movies.sort((a, b) => b.Title.localeCompare(a.Title));
    }
    else if (sortSelect === 'newest') {
        return movies.sort((a, b) => a.Title.localeCompare(b.Title));
    }
    else if (sortSelect === 'oldest') {
        return movies.sort((a, b) => b.Title.localeCompare(a.Title));
    }
    return movies;
}



async function fetchAndDisplayMovies(query) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=3ad3648f&s=${query}`);
    
    if (response.ok) {
        const data = await response.json();
        const movies = data.Search; 
        displayMovies(movies); 
    } else {
        console.error('Error fetching data:', response.statusText);
        displayMovies([]); 
    }
}


function displayMovies(movies) {
    const movieGrid = document.getElementById('movie-grid');
    movieGrid.innerHTML = ''; 

    if (movies && movies.length > 0) {
        const movieCards = movies.map(movie => {
            const posterSrc = movie.Poster && movie.Poster !== 'N/A' 
                ? movie.Poster 
                : 'assets/no-movie-poster.jpg';

            return `
                <div class="movie-card">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                    <img src="${posterSrc}" alt="${movie.Title} Poster" />
                </div>
            `;
        }).join(''); 

        movieGrid.innerHTML = movieCards; 
    } else {
        movieGrid.innerHTML = '<p>No movies found. Please try a different search.</p>';
    }
}
