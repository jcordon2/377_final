function startApp() {
    window.location = "choosemedia.html";
}

function goAbout () {
    window.location="quickbat.html";
}

function saveChoices() {
    const mediaType = document.getElementById('mediaType').value;
    const amount = document.getElementById('amount').value;

    localStorage.setItem('mediaType', mediaType);
    localStorage.setItem('amount', amount);

    window.location = 'mewd.html';
}