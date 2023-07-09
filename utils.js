
function getGenres(arr){
    const genreArray = arr
    let genreHtml = ''
    for(let i = 0; i < genreArray.length; i++){
        genreHtml += genreArray[i]
    }
    return genreHtml
}

function getRating(arr){
    return arr[0].Value.slice(0, 3)
}

export {getGenres, getRating}