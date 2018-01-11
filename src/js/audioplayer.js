module.exports = class AudioPlayer{
    constructor(songs){
        this.songs = songs;
        this.player = new Audio();
        this.currentSongIndex;
        this.currentSong;
        this.currentTime;
        this.wrapper;
        this.controls;
        this.hidden = true;
    };

    init(){
        this.currentSongIndex = 0;
        this.currentTime = 0;
        this.setCurrentSong();
        this.render();
    };

    setCurrentSong(){
        this.currentSong = this.songs[this.currentSongIndex];
        this.player.src="assets/songs/" + this.currentSong.file;
    };

    playCurrentSong(){
        this.render();
        this.player.load();
        this.player.currentTime = this.currentTime;
        this.currentTime = 0;
        this.player.play();
        this.controls.querySelector('#play-btn').innerHTML = '<i class="fa fa-pause"></i>';
        let cover = this.wrapper.querySelector('.cover-wrapper');
        cover.classList.remove('pulse');
        cover.classList.add('pulse');
    };

    playNextSong(){
        this.currentSongIndex === this.songs.length-1 ? this.currentSongIndex = 0 : this.currentSongIndex++;
        this.setCurrentSong();
        this.playCurrentSong();
    };

    playPreviousSong(){
        this.currentSongIndex === 0 ? this.currentSongIndex = this.songs.length-1 : this.currentSongIndex--;
        this.setCurrentSong();
        this.playCurrentSong();
    };

    pauseSong(){
        this.currentTime = this.player.currentTime;
        this.player.pause();
        this.controls.querySelector('#play-btn').innerHTML = '<i class="fa fa-play"></i>';
        let cover = this.wrapper.querySelector('.cover-wrapper');
        cover.classList.remove('pulse');
    };

    render(){
        let template = document.querySelector("#audio-player-template"),
            title = template.content.querySelector('#current-song-title'),
            cover = template.content.querySelector('#current-song-cover');

        this.wrapper = document.querySelector("#audio-player");

        title.textContent = this.currentSong.title;
        cover.src = "assets/img/covers/" + this.currentSong.cover;

        if (this.hidden === true) this.wrapper.classList.add('hidden');

        this.wrapper.innerHTML = "";
        this.wrapper.appendChild(document.importNode(template.content, true));

        this.controls = this.wrapper.querySelector('#audio-player-controls');
        this.setListeners();
    };

    show(){
        this.hidden = false;
        this.wrapper.classList.remove('hidden');
        this.controls.querySelector('#toggle-btn').innerHTML = '<i class="fa fa-eye-slash"></i>';
    };

    hide(){
        this.hidden = true;
        this.wrapper.classList.add('hidden');
        this.controls.querySelector('#toggle-btn').innerHTML = '<i class="fa fa-music"></i>';
    };

    setListeners(){
        this.controls.addEventListener('click', (e) =>{
            if (e.target.matches('#play-btn') || e.target.matches('#play-btn i') ){
                e.preventDefault();
                e.stopPropagation();

                this.player.paused ? this.playCurrentSong() : this.pauseSong();
                return;
            };

            if (e.target.matches('#prev-btn') || e.target.matches('#prev-btn i')  ){
                e.preventDefault();
                e.stopPropagation();

                this.playPreviousSong();
                return;
            };

            if (e.target.matches('#next-btn') || e.target.matches('#next-btn i') ){
                e.preventDefault();
                e.stopPropagation();

                this.playNextSong();
                return;
            };

            if (e.target.matches('#toggle-btn')  || e.target.matches('#toggle-btn i')  ){
                console.log(this.hidden);
                this.hidden === true ? this.show() : this.hide();
                return;
            }
        });

        this.player.addEventListener('ended', ()=>{
            this.playNextSong();
        })
    }
}
