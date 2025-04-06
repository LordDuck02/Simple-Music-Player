let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let trackIndex = 0;
let playing = false;
let updateTimer;

let currTrack = document.createElement('audio');

let trackList = [];

fetch("tracks.json")
    .then(response => response.json())
    .then(data => {
        trackList = data;
        if (trackList && trackList.length > 0) {
            loadTrack(trackIndex);
        } else {
            console.error("Track list is empty or invalid.");
        }
    })
    .catch(error => {
        console.error("Error loading tracks:", error);
    });

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function loadTrack(i) {
    if (!trackList || trackList.length === 0) return;

    clearInterval(updateTimer);
    resetValues();

    let track = trackList[i];

    let spinner = document.createElement('div');
    spinner.classList.add("spinner");
    track_art.appendChild(spinner);

    let img = new Image();
    img.src = track.image;

    img.onload = function() {
        track_art.style.backgroundImage = `url(${track.image})`;
        track_art.removeChild(spinner);
    }

    track_name.textContent = track.name;
    track_artist.textContent = track.artist;
    currTrack.src = track.path
    now_playing.textContent = "PLAYING " + track.name + " BY " + track.artist;

    updateTimer = setInterval(seekUpdate, 1000);
    currTrack.addEventListener("ended", nextTrack);
}

function playpauseTrack() {
    if (!playing) playTrack();
    else pauseTrack();
}

function playTrack() {
    currTrack.play();
    playing = true;

    playpause_btn.querySelector('i').classList.remove("fa-play-circle");
    playpause_btn.querySelector('i').classList.add("fa-pause-circle");
}

function pauseTrack() {
    currTrack.pause();
    playing = false;

    playpause_btn.querySelector('i').classList.remove("fa-pause-circle");
    playpause_btn.querySelector('i').classList.add("fa-play-circle");
}

function nextTrack() {
    if (trackIndex < trackList.length - 1) {
        trackIndex++;
    } else { trackIndex = 0 };
    loadTrack(trackIndex);
    playTrack();
}

function prevTrack() {
    if (trackIndex > 0)
        trackIndex--;
    else trackIndex = trackList.length - 1;

    loadTrack(trackIndex);
    playTrack();
}

function seekTo() {
    let seekTo = currTrack.duration * (seek_slider.value / 100);
    currTrack.currentTime = seekTo;
}

function setVolume() {
    currTrack.volume = volume_slider.value / 100;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function seekUpdate() {
    if (!currTrack || isNaN(currTrack.duration) || currTrack.duration === 0) return;

    const seekPosition = (currTrack.currentTime / currTrack.duration) * 100;
    seek_slider.value = seekPosition;

    const currentTimeFormatted = formatTime(currTrack.currentTime);
    const durationFormatted = formatTime(currTrack.duration);

    curr_time.textContent = currentTimeFormatted;
    total_duration.textContent = durationFormatted;
}

document.addEventListener("DOMContentLoaded", () => {
    if (trackList && trackList.length > 0) {
        loadTrack(trackIndex);
    }
})
