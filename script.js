// Element
const playPauseBtn = document.querySelector(".play-pause-btn");
const theaterBtn = document.querySelector(".theater-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const fullScreenBtn = document.querySelector(".full-screen-btn");
const currentTimeEle = document.querySelector(".current-time");
const totalTimeElem = document.querySelector(".total-time");
const video = document.querySelector("video");
const videoContainer = document.querySelector(".video-container");
const captionsBtn = document.querySelector(".captions-btn");
const muteBtn = document.querySelector(".mute-btn");
const volumnSlider = document.querySelector(".volume-slider");

const captions = video.textTracks[0];
captions.mode = "hidden";
console.log(video.textTracks[0].mode);

function toggleCaptions() {
    // const isHidden = captions.mode === "hidden";
    // captions.mode = isHidden ? "showing" : "hidden";
    captions.mode === "hidden"
        ? (captions.mode = "showing")
        : (captions.mode = "hidden");
    videoContainer.classList.toggle("captions");
}

captionsBtn.addEventListener("click", toggleCaptions);

// Change
const togglePlay = () => {
    video.paused ? video.play() : video.pause();
};

// Event Listener
document.addEventListener("keydown", (e) => {
    const tagName = document.activeElement.tagName.toLowerCase;
    console.log(tagName);
    switch (e.key.toLowerCase()) {
        case " ":
            togglePlay();
            console.log("SPACE");
            break;
        case "k":
            togglePlay();
            console.log("K");
            break;
        case "f":
            toggleFullScreenMode();
            break;
        case "t":
            toggleTheaterMode();
            break;
        case "arrowright":
            skip(5);
            break;
        case "l":
            skip(10);
            break;
        case "arrowleft":
            skip(-5);
            break;
        case "j":
            skip(-10);
    }
});

function skip(duration) {
    video.currentTime += duration;
}

document.addEventListener("keydown", (e) => {
    console.log(e.key);
});

//duration
video.addEventListener("loadeddata", (e) => {
    console.log(`Seconds: ${video.duration % 60}`);
    totalTimeElem.textContent = formatDuration(video.duration);
});

console.log(`video currentTime: ${video.currentTime}`);

document.addEventListener("mouseup", (e) => {
    if (isScrubbing) toggleScrubbing(e);
});

//time line
const previewImg = document.querySelector(".preview-img");
const thumbnailImg = document.querySelector(".thumbnail-img");

const timeLineContainer = document.querySelector(".timeline-container");

// chà được mượt hơn
document.addEventListener("mouseup", (e) => {
    if (isScrubbing) toggleScrubbing(e);
});

document.addEventListener("mousemove", (e) => {
    if (isScrubbing) handleTimeLineUpdate(e);
});

let isScrubbing = false;
let wasPaused;
function toggleScrubbing(e) {
    const rect = timeLineContainer.getBoundingClientRect();
    console.log(e);
    const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle("scrubbing", isScrubbing);

    if (isScrubbing) {
        wasPaused = video.paused;
        video.pause();
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play();
    }

    handleTimeLineUpdate(e);
}

// handller
function handleTimeLineUpdate(e) {
    const rect = timeLineContainer.getBoundingClientRect();
    const precent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    const previewImgNumber = Math.max(
        1,
        Math.floor((precent * video.duration) / 10)
    );
    const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
    previewImg.src = previewImgSrc;
    timeLineContainer.style.setProperty("--preview-position", precent);
    if (isScrubbing) {
        e.preventDefault();
        thumbnailImg.src = previewImgSrc;
        timeLineContainer.style.setProperty("--progress-position", precent);
    }
}
timeLineContainer.addEventListener("mousedown", toggleScrubbing);
timeLineContainer.addEventListener("mousemove", handleTimeLineUpdate);

video.addEventListener("timeupdate", (e) => {
    currentTimeEle.textContent = formatDuration(video.currentTime);
    // New
    const percent = video.currentTime / video.duration;
    timeLineContainer.style.setProperty("--progress-position", percent);
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
});

function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
    } else {
        return `${1}:${leadingZeroFormatter.format(
            2
        )}:${leadingZeroFormatter.format(seconds)}`;
    }
}

// volumn
muteBtn.addEventListener("click", toggleMute);

volumnSlider.addEventListener("input", (e) => {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
});

function toggleMute() {
    video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
    volumnSlider.value = video.volume;
    let volumeLevel;
    if (video.muted || video.volume === 0) {
        volumnSlider.value = 0;
        volumeLevel = "muted";
    } else if (video.volume >= 0.5) {
        volumeLevel = "high";
    } else {
        volumeLevel = "low";
    }

    videoContainer.dataset.volumeLevel = volumeLevel;
});
// views model
theaterBtn.addEventListener("click", toggleTheaterMode);
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);
fullScreenBtn.addEventListener("click", toggleFullScreenMode);

function toggleTheaterMode() {
    videoContainer.classList.toggle("theater");
}

function toggleMiniPlayerMode() {
    if (videoContainer.classList.contains("mini-player")) {
        document.exitPictureInPicture();
    } else {
        video.requestPictureInPicture();
    }
}

function toggleFullScreenMode() {
    if (document.fullscreenElement === null) {
        theaterBtn.classList.add("none");
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
        theaterBtn.classList.remove("none");
    }
}

document.addEventListener("fullscreenchange", () => {
    // videoContainer.classList.toggle("full-screen");
    videoContainer.classList.toggle("full-screen", document.fullscreenElement);
});

video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player");
});

// play / pause
playPauseBtn.addEventListener("click", togglePlay);

video.addEventListener("play", () => {
    videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
    videoContainer.classList.add("paused");
});

video.addEventListener("click", togglePlay);

video.addEventListener("dblclick", (e) => {
    toggleFullScreenMode();
    togglePlay();
});
