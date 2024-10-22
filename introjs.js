let flag = 0;

// Redirect to the game page when the space bar is pressed
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && flag === 0) {
        
        var intro = new Audio('./assets/audio/multiplicationintro.mp3');
        intro.play();
        flag ++;
    }
    else {
        window.location.href = 'index.html';
    }
});