import { getGenres, getRating} from "./utils.js"

let movieIds = []

initializeMovieIds()

document.getElementById('search-btn').addEventListener('click', function(){
    const search = document.getElementById('search-input').value
    getMovies(search)
})

document.addEventListener('click', function(e){
    const targetId = e.target.dataset.id
    if(targetId){
        switchButton(targetId)
    }
})

function getMovies(searchTerm){
    fetch(`http://www.omdbapi.com/?apikey=81662f65&s=${searchTerm}`)
            .then(res => res.json())
            .then(data => {
                if(data.Response === 'False'){
                    document.getElementById('explore').innerHTML = `<p class="error">Unable to find what you’re looking for.<br>Please try another search.<p>`
                }else{
                    const movieArray = data.Search
                    renderMovies(movieArray)
                }
        })
    }

async function renderMovies(arr){
    let fullMovieList = []
    let html = ''
    for(let i = 0; i < arr.length; i++){
        let data = await fetch(`http://www.omdbapi.com/?apikey=81662f65&t=${arr[i].Title}`)
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
                    ${getCorrectButtonState(data.imdbID)}
                </div>
                <div class="bottom">
                    <p class="plot">${data.Plot}</p>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById('explore').innerHTML = html
}

function saveToLocalStorage(movieId){
    movieIds.push(movieId)
    localStorage.setItem('movieIds', JSON.stringify(movieIds))
}

function switchButton(movieId){
    const button = document.querySelector(`[data-id=${movieId}]`)
    console.log(button)
    if(button.textContent === ' Watchlist'){
        button.innerHTML = `
        <p class="watchlist" data-id="${movieId}"><i class="fa-solid fa-circle-minus"></i> Remove</p>
        `
        saveToLocalStorage(movieId)
    }else{
        button.innerHTML = `<p class="watchlist" data-id="${movieId}"><i class="fa-solid fa-circle-plus"></i> Watchlist</p>`
        removeMovieSearch(movieId)
    }
}

function removeMovieSearch(movieId){
    let movies = JSON.parse(localStorage.movieIds)
    movies = movies.filter(function(item) {
        return item !== movieId
    })
    movieIds = movies
    localStorage.setItem('movieIds', JSON.stringify(movies))
}

function getCorrectButtonState(movieId){
    let correctHtml = `<p class="watchlist" data-id="${movieId}"><i class="fa-solid fa-circle-plus"></i> Watchlist</p>`
    if(movieIds.length > 0){
        const movies = JSON.parse(localStorage.movieIds)

        for(let i = 0; i < movies.length; i++){
            if(movies[i] === movieId){
                correctHtml = `<p class="watchlist" data-id="${movieId}"><i class="fa-solid fa-circle-minus"></i> Remove</p>`
            }
    }
    }
    return correctHtml
}

function initializeMovieIds(){
    if(localStorage.getItem('movieIds')){
        movieIds = JSON.parse(localStorage.movieIds)
    }
}
