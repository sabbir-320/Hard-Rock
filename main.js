// All selector
const searchValue = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const songHolder = document.getElementById("song-holder");

let previousSongs = "";

// Functionality after pressing a search key word
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
    previousSongs = "";
    if (searchValue.value) {
        findSong(searchValue.value);
    }
});

// Show or Hide the lyrics after clicking the Get lyrics button
songHolder.addEventListener("click", async (e) => {
    let getSongId = e.target.getAttribute("song-id");
    if (previousSongs) {
        document.getElementById(previousSongs).classList.add("d-none"); // Off the previously opened lyrics
    }
    document.getElementById(getSongId).classList.toggle("d-none");
    previousSongs = getSongId;
});

// API Functionality 
const findSong = (searchKey) => {
    songHolder.innerHTML = "";
    fetch(`https://api.lyrics.ovh/suggest/${searchKey.toLowerCase().trim()}`) // Getting the songs
        .then((res) => res.json())
        .then((data) => {
            const songs = data.data;

            songs.slice(0, 10).map((song) => {
                let songLyrics = "";
                const songElement = document.createElement("div");
                const lyricsHolder = document.createElement("div");
                fetch(`https://api.lyrics.ovh/v1/${song.artist.name.toLowerCase()}/${song.title.toLowerCase()}`) // Getting the lyrics
                    .then((res) => res.json())
                    .then((data) => {
                        songLyrics = data.lyrics;
                    })
                    .then(() => {
                        songElement.setAttribute(
                            "class",
                            "single-result row align-items-center my-3 p-3"
                        );
                        lyricsHolder.setAttribute(
                            "class",
                            "d-none text-center songHolder"
                        );
                        lyricsHolder.setAttribute("id", song.id);
                        songElement.innerHTML = `
                        <div class="col-md-9 d-flex align-items-center">
                            <img src="${song.album.cover_small}" />
                            <div class='ml-2'>
                                <h3 class="lyrics-name">${song.title}</h3>
                                <p class="author lead">Album by <span>${song.artist.name}</span></p>
                            </div>
                        </div>
                        <div class="col-md-3 text-md-right text-center get-lyrics-buttons">
                            <button class="btn btn-success" song-id=${song.id}>Get Lyrics</button>
                        </div>
                        `;

                        lyricsHolder.innerHTML = `
                        <h2 class="text-success mb-4">${song.title}</h2>
                        <pre class='text-white' >${songLyrics ? songLyrics : "Sorry!! Lyrics not found..."}</pre>
                        `;
                        songHolder.appendChild(songElement);
                        songHolder.appendChild(lyricsHolder);
                    })
                    .catch((error) => console.log(error));
            });
        })
        .catch((error) => console.log(error));
};
