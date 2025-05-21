const playlistsEl = document.getElementById("playlists");
const songsEl     = document.getElementById("songs");
const backBtn     = document.getElementById("back-btn");
const playlistView= document.getElementById("playlist-view");
const songsView   = document.getElementById("songs-view");
const titleEl     = document.getElementById("current-playlist-title");
const audio       = document.getElementById("audio");

// 1) Load and render playlists
fetch("/api/playlists")
  .then(r => r.json())
  .then(list => {
    list.forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      li.addEventListener("click", () => openPlaylist(name));
      playlistsEl.appendChild(li);
    });
  });

// 2) Show songs for a playlist (no autoplay)
function openPlaylist(name) {
  titleEl.textContent = name;
  // hide playlist list, show songs list
  playlistView.classList.add("hidden");
  songsView.classList.remove("hidden");
  songsEl.innerHTML = "";        // clear old songs
  audio.removeAttribute("src");  // clear audio

  fetch(`/api/playlists/${encodeURIComponent(name)}/songs`)
    .then(r => r.json())
    .then(songs => {
      songs.forEach(({ name: songName, url }) => {
        const li = document.createElement("li");
        li.textContent = songName;
        li.addEventListener("click", () => {
          audio.src = url;
          // don't call audio.play() here → no auto-play
        });
        songsEl.appendChild(li);
      });
    });
}

// 3) Back button behavior
backBtn.addEventListener("click", () => {
  songsView.classList.add("hidden");
  playlistView.classList.remove("hidden");
  audio.pause();
});
