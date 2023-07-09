import { getGenres, getRating} from "./utils.js"

const movieFeed = document.getElementById('movie-feed')


document.addEventListener('click', function(e){
    if(e.target.dataset.id){
        removeMovieFromStorage(e.target.dataset.id)
    }
})

async function renderSelectedMovies(){
    const movies = JSON.parse(localStorage.movieIds)
    let html = ''
    for(let i = 0; i < movies.length; i++){
        let data = await fetch(`https://www.omdbapi.com/?apikey=81662f65&i=${movies[i]}`)
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        html += `
        <div class="movie-container">
            <img src="${data.Poster}" class="poster">
            <div class="movie-info">
                <div class="top">
                    <h3>${data.Title}</h3>
                    <p class="rating"><i class="fa-solid fa-star"></i> ${getRating(data.Ratings)}</p>
                </div>
                <div class="center">
                    <p>${data.Runtime}</p>
                    <p>${getGenres(data.Genre)}</p>
                    <p class="watchlist" data-id="${data.imdbID}"><i class="fa-solid fa-circle-minus"></i> Remove</p>
                </div>
                <div class="bottom">
                    <p class="plot">${data.Plot}</p>
                </div>
            </div>
        </div>
        `
    }
    if(movies.length === 0){
        movieFeed.innerHTML = `
            <h3 class="no-movies-txt">Your watchlist is looking a little empty...</h3>
            <a href="index.html" class="find"><h4 class="add"><i class="fa-solid fa-circle-plus"></i> Let’s add some movies!</h4></a>
        `
        movieFeed.style.marginTop = '30em'
    }else{
        movieFeed.innerHTML = html
    }
}

function removeMovieFromStorage(movieId){
    let movies = JSON.parse(localStorage.movieIds)
    //const index = movies.findIndex(x => x === movieId)
    movies = movies.filter(function(item) {
        return item !== movieId
    })
    localStorage.setItem('movieIds', JSON.stringify(movies))
    renderSelectedMovies()
}

renderSelectedMovies()
