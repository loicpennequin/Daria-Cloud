'use strict';

module.exports = class AudioPlayer{
    /**
     * Handle the audio player behavior
     *
     * @param songs { file: string, title: string, cover: string}
     */
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
        this.player.volume = 0.5;
        this.setCurrentSong();
        this.render();
        this.setAudioElementListeners();
    };

    setCurrentSong(){
        this.currentSong = this.songs[this.currentSongIndex];
        this.player.src="assets/songs/" + this.currentSong.file;
    };

    playCurrentSong(){
        this.render();
        this.player.load();
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

    updateTime(){
        let totalMinutes = Math.floor(this.player.duration/60),
            totalSeconds = Math.floor(this.player.duration - (totalMinutes * 60)),
            currentMinutes = Math.floor(this.player.currentTime/60),
            currentSeconds = Math.floor(this.player.currentTime - (currentMinutes * 60));

        //TODO: refactor this
        if ( totalMinutes < 10) totalMinutes = "0" + totalMinutes;
        if ( totalSeconds < 10) totalSeconds = "0" + totalSeconds;
        if ( currentMinutes < 10) currentMinutes = "0" + currentMinutes;
        if ( currentSeconds < 10) currentSeconds = "0" + currentSeconds;

        this.wrapper.querySelector('#current-time').textContent = `${currentMinutes}:${currentSeconds}`;
        this.wrapper.querySelector('#total-time').textContent = `${totalMinutes}:${totalSeconds}`;

        let slider = this.wrapper.querySelector('#time-slider');
        slider.style.width = Math.floor(this.player.currentTime / this.player.duration * 100) + "%";
    }

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

    // We need to set the listeners related to the AudioElement API separately, because listeners related to DOM elements are re-attached at every render. There would be more elegant ways to remedy this (basically not rendering the whole component so we don't have to re-attach all the listeners, conditionally add the AudioElement related listeners in the setListeners() method)
    setAudioElementListeners(){
        this.player.addEventListener('ended', () => {
            console.log('song had ended');
            this.playNextSong();
        })

        this.player.addEventListener('loadedmetadata', () => {
            this.updateTime();
        })

        this.player.addEventListener('timeupdate', () => {
            this.updateTime();
        })
    };

    setListeners(){
        // Click handler
        this.controls.addEventListener('click', (e) =>{
            e.preventDefault();
            e.stopPropagation();

            if (e.target.matches('#play-btn') || e.target.matches('#play-btn i') ){
                this.player.paused ? this.playCurrentSong() : this.pauseSong();
                return;
            };

            if (e.target.matches('#prev-btn') || e.target.matches('#prev-btn i')  ){
                this.playPreviousSong();
                return;
            };

            if (e.target.matches('#next-btn') || e.target.matches('#next-btn i') ){
                this.playNextSong();
                return;
            };

            if (e.target.matches('#toggle-btn')  || e.target.matches('#toggle-btn i')  ){
                this.hidden === true ? this.show() : this.hide();
                return;
            }

            let timerElement = e.target.closest('#timer');
            if (timerElement && timerElement.contains(e.target)) {
                let timerElement = this.wrapper.querySelector('#timer').getBoundingClientRect(),
                    clickPosition = e.clientX - timerElement.left,
                    desiredTime = Math.round(clickPosition / timerElement.width * this.player.duration);

                this.player.currentTime = desiredTime;
                return;
            }
        });

        //Volume control related handlers
        this.controls.addEventListener('mousedown', (e) => {
            if (e.target.matches('#volume-range') || e.target.matches('#volume-slider')  ){
                self.changeVolume(e, this.wrapper);
                this.controls.querySelector('#volume-range').addEventListener('mousemove', self.changeVolume);
            }
        });

        this.controls.addEventListener('mouseup', (e) =>{
            this.controls.querySelector('#volume-range').removeEventListener('mousemove', self.changeVolume)
        });

        let self = {
            player : this.player,

            changeVolume : function(e, audioplayer){
                //FIXME : proceeding like this is bad code, need to think about this again
                let range            = audioplayer ? audioplayer.querySelector('#volume-range'):
                                                     this,
                    slider           = audioplayer ? audioplayer.querySelector('#volume-slider'):
                                                     this.querySelector('#volume-slider'),
                    wrapper          = range.getBoundingClientRect(),
                    y                = wrapper.bottom - e.clientY,
                    volumePercentage = Math.round(y/wrapper.height * 100);
                    slider.style.height = volumePercentage + "%";

                self.player.volume = volumePercentage/100;
            }
        };
    }
}
