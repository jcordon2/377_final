function chooseMood(mood) {
    localStorage.setItem('mood', mood);

    window.location = 'done.html';
}