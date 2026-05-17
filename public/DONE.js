async function loadRecommendations() {
    const mood = localStorage.getItem('mood');
    const mediaType = localStorage.getItem('mediaType');
    const amount = localStorage.getItem('amount');

    await fetch(
        `/recommendations?mood=${mood}&mediaType=${mediaType}&amount=${amount}`
    )

    .then((result) => result.json())
    .then((resultJson) => {console.log(resultJson)});
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    resultJson.movies.forEach((movie) => {const div = document.createElement('div'); 
    div.className = 'card';

    div.innerHTML = `<h3>${movie.Title}</h3> <p>${movie.Year}</p> <img src = "${movies.Poster}" width="150px">`;

    resultsDiv.appendChild(div);
});

    resultJson.books.forEach((book) => { const div = documents.createElement('div');
    div.className = 'card'; 
    div.innerHTML = `<h3>${book.title || 'Unknown Title'} </h3> <p>${book.author_name?.[0] || 'Unknown Author'}</p>`;

    resultsDiv.appendChild(div);
    });
}