console.log("DONE.js is running");

async function loadRecommendations() {
    const mood = localStorage.getItem('mood');
    const mediaType = localStorage.getItem('mediaType');
    const amount = localStorage.getItem('amount');

    console.log(mood, mediaType, amount);

    let resultJson = {movies: [], books: [], music: []};

    try {
        const response = await fetch(`/recommendations?mood=${mood}&mediaType=${mediaType}&amount=${amount}`);
    

    resultJson = await response.json();
    console.log(resultJson);
} catch (err) {
    console.log("Fetch failed:", err);
    return;
}

const resultsDiv = document.getElementById('results');
resultsDiv.innerHTML = '';


  resultJson.movies?.forEach((movie) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `<h3>${movie.Title}</h3> <p>${movie.Year}</p> <img src="${movie.Poster}" width="150">`;

    resultsDiv.appendChild(div);
  });

  resultJson.books?.forEach((book) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `<h3>${book.title || 'Unknown Title'}</h3> <p>${book.author_name?.[0] || 'Unknown Author'}</p>`;
  })

  resultJson.music?.forEach((song) => {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML = `<h3>${song.title || 'Unknown Song'}</h3> <p>${song['artist-credit']?.[0]?.name || 'Unknown Artist'}</p>`;

    resultsDiv.appendChild(div);
  });

  await fetch('/history', {
    method: 'POST',
    body: JSON.stringify({mood, mediaType, amount}),
    headers: { 'content-type': 'application/json'}
  });

}
