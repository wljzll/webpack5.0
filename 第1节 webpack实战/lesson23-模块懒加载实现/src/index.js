let playButton = document.getElementById('play');

playButton.addEventListener('click', () => {
    import('./video').then(result => {
        console.log(result);
    })
})