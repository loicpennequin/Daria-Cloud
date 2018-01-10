import AudioPlayer from "./audioplayer";

document.addEventListener("DOMContentLoaded", () => {
    let player;
    getSongs()
    .then ( songs => {
        // songs.forEach( (song) =>{
        //     player = new SongPlayer(song);
        //     player.init();
        // })
        player = new AudioPlayer(songs);
        player.init();
    })

    document.addEventListener("click", (e)=>{
        if (e.target.matches('.main-nav ul li a')){
            e.preventDefault();
            document.querySelector(e.target.dataset.target).scrollIntoView({
                behavior: 'smooth'
            });
        }
    })
})


let getSongs = async () => {
    let rawResponse = await fetch('http://localhost:3000/assets/data/songslist.json');
    let response = await rawResponse.json();
    return response;



    // return new Promise( (resolve, reject) =>{
    //     fetch('http://localhost:3000/assets/data/songslist.json')
    //     .then(rawResponse => {
    //         rawResponse.json()
    //         .then(response =>{
    //             resolve(response);
    //         });
    //     });
    // });
};

// function SongPlayer(song){
//     this.song = song;
//     this.player = new Audio();
//     this.wrapper;
//     this.controls;
// };
//
// SongPlayer.prototype.init = function(){
//     const self = this;
//
//     self.render();
//
//     self.player.src="assets/songs/" + this.song.file;
//
//     self.controls = self.wrapper.querySelector('.controls');
//     self.setListeners();
// };
//
// SongPlayer.prototype.render = function(){
//     const self = this;
//
//     let template = document.querySelector("#song-player-template"),
//         title = template.content.querySelector('.song-title'),
//         container = document.querySelector("#song-list");
//
//     self.wrapper = document.createElement('div');
//     container.appendChild(self.wrapper);
//
//     title.textContent = self.song.title;
//
//     self.wrapper.appendChild(document.importNode(template.content, true));
// };
//
// SongPlayer.prototype.setListeners = function(){
//     const self = this;
//     self.controls.addEventListener('click', (e) =>{
//         if (e.target.matches('.play-btn') ){
//             self.player.paused ? self.player.play() : self.player.pause();
//         }
//     })
// }
