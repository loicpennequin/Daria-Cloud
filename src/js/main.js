import AudioPlayer from "./audioplayer";

document.addEventListener("DOMContentLoaded", () => {
    let player;
    getSongs()
    .then ( songs => {
        player = new AudioPlayer(songs);
        player.init();
        setSongAlbum(songs);
    })

    document.addEventListener("click", (e)=>{
        if (e.target.matches('.main-nav ul li a')){
            e.preventDefault();
            e.stopPropagation();
            document.querySelector(e.target.dataset.target).scrollIntoView({
                behavior: 'smooth'
            });
            return;
        }

        if (e.target.matches('.set-song') ){
            player.currentSongIndex = e.target.dataset.songid;
            player.show();
            player.setCurrentSong();
            player.playCurrentSong();
        }
    })
})


let getSongs = async () => {
    let rawResponse = await fetch('http://localhost:3000/assets/data/songslist.json');
    let response = await rawResponse.json();
    return response;
};

let setSongAlbum = (songs) => {
    songs.forEach((song, index)=>{
        let template = document.querySelector("#song-picker"),
            title = template.content.querySelector('#song-picker-title'),
            cover = template.content.querySelector('#song-picker-cover'),
            playBtn = template.content.querySelector(".set-song"),
            container = document.querySelector("#song-list");

        title.textContent = song.title;
        cover.src = "http://localhost:3000/assets/img/covers/" + song.cover;
        playBtn.dataset.songid = index;

        container.appendChild(document.importNode(template.content, true));
    })
};
