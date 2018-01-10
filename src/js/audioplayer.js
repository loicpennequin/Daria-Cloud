module.exports = class AudioPlayer{
    constructor(songs){
        this.songs = songs;
        this.player = new Audio();
        this.currentSongIndex;
        this.currentSong;
        this.wrapper;
        this.controls;
        this.hidden = true;
    };

    init(){
        this.currentSongIndex = 0;

        this.setCurrentSong();

        this.render();
    };

    setCurrentSong(){
        this.currentSong = this.songs[this.currentSongIndex];
        this.player.src="assets/songs/" + this.currentSong.file;
    }

    playCurrentSong(){
        this.player.load();
        this.player.play();
        this.controls.querySelector('#play-btn').innerHTML = "&#10074;&#10074;";
    }

    pauseSong(){
        this.player.pause();
        this.controls.querySelector('#play-btn').innerHTML = "&#9658;";
    }

    render(){
        let template = document.querySelector("#audio-player-template"),
            title = template.content.querySelector('#current-song-title');

        this.wrapper = document.querySelector("#audio-player");

        title.textContent = this.currentSong.title;

        this.wrapper.innerHTML = "";
        this.wrapper.appendChild(document.importNode(template.content, true));

        this.controls = this.wrapper.querySelector('#audio-player-controls');
        this.setListeners();
    };

    setListeners(){
        this.controls.addEventListener('click', (e) =>{
            if (e.target.matches('#play-btn') ){
                e.preventDefault();
                e.stopPropagation();

                this.player.paused ? this.playCurrentSong() : this.pauseSong();
                return;
            };

            if (e.target.matches('#prev-btn') ){
                e.preventDefault();
                e.stopPropagation();

                this.currentSongIndex === 0 ? this.currentSongIndex = this.songs.length-1 : this.currentSongIndex--;
                this.setCurrentSong();
                this.render();
                this.playCurrentSong();
                return;
            };

            if (e.target.matches('#next-btn') ){
                e.preventDefault();
                e.stopPropagation();

                this.currentSongIndex === this.songs.length-1 ? this.currentSongIndex = 0 : this.currentSongIndex++;
                this.setCurrentSong();
                this.render();
                this.playCurrentSong();
                return;
            };

        })
    }
}
