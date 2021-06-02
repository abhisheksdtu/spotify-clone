async function mainMusicPlayer(tracksArr) {
	let trackName = document.querySelector('.music-details-row-name');
	let trackArtist = document.querySelector('.music-details-row-artist');
	let trackImgContainer = document.querySelector('.music-details-img');
	let playPauseBtn = document.querySelector('.playpause-btn');
	let nextBtn = document.querySelector('.next-btn');
	let prevBtn = document.querySelector('.prev-btn');
	let shuffleBtn = document.querySelector('.shuffle-btn');
	let repeatBtn = document.querySelector('.repeat-btn');
	let seekSlider = document.querySelector('.seek-slider');
	let volumeSlider = document.querySelector('.volume-slider');
	let currentTime = document.querySelector('.current-time');
	let totalDuration = document.querySelector('.total-duration');

	let isPlaying = false;

	// MAIN EVENT LISTENER
	let allTracks = document.querySelectorAll('.track');

	for (let i = 0; i < allTracks.length; i++) {
		let elem = allTracks[i];

		elem.addEventListener('click', function () {
			loadTrack(i);

			elem.addEventListener('click', function () {
				pauseTrack();
			});
		});
	}

	let updateTimer;

	let currentTrack = document.createElement('audio');

	let duration = 30;

	let isShuffling = false;

	currentTrack.muted = true;

	// EVENT LISTENERS

	shuffleBtn.addEventListener('click', shuffleTrack);

	prevBtn.addEventListener('click', prevTrack);

	playPauseBtn.addEventListener('click', playPauseTrack);
	playPauseBtn.addEventListener('click', playPauseTrack);

	nextBtn.addEventListener('click', nextTrack);

	repeatBtn.addEventListener('click', repeatTrack);

	seekSlider.addEventListener('change', seekTo);

	volumeSlider.addEventListener('change', setVolume);

	function loadTrack(trackIndex) {
		// Clear the previous seek timer
		clearInterval(updateTimer);
		// resetValues();

		// Load a new track
		// console.log(tracksArr[trackIndex].songUrl);
		currentTrack.src = tracksArr[trackIndex].songUrl;
		currentTrack.load();

		// UPDATE DETAILS
		let trackImg = `<img src="${tracksArr[trackIndex].img}">`;
		trackImgContainer.innerHTML = trackImg;

		trackName.innerHTML = tracksArr[trackIndex].trackName;
		trackArtist.innerHTML = tracksArr[trackIndex].artists;

		currentTrack.muted = false;
		playTrack();

		updateTimer = setInterval(seekUpdate, 1000);
		currentTrack.addEventListener('ended', nextTrack);
	}

	function resetValues() {
		currentTime.innerHTML = '00:00';
		totalDuration.innerHTML = '00:00';
		seekSlider.value = 0;
	}

	function shuffleTrack() {
		if (!isShuffling) {
			isShuffling = true;

			shuffleBtn.style.color = '#1ED760';

			// trackIndex = Math.floor(Math.random() * tracksArr.length);

			currentTrack.addEventListener('ended', nextTrack);
		} else {
			isShuffling = false;

			shuffleBtn.style.color = '#aaa';

			currentTrack.addEventListener('ended', nextTrack);
		}

		// loadTrack(trackIndex);
		// playTrack();
	}

	function repeatTrack() {
		currentTrack.loop = true;
		repeatBtn.style.color = '#1ED760';

		// loadTrack(trackIndex);
		// playTrack();
	}

	function playPauseTrack() {
		if (!isPlaying) {
			playTrack();
		} else {
			pauseTrack();
		}
	}

	function playTrack() {
		currentTrack.play();
		isPlaying = true;
		playPauseBtn.innerHTML = `
			<span class="material-icons-round">
				pause_circle_outline
			</span>
		`;
	}

	function pauseTrack() {
		currentTrack.pause();
		isPlaying = false;
		playPauseBtn.innerHTML = `
			<span class="material-icons-round">
                play_circle_outline
            </span>
		`;
	}

	function nextTrack() {
		if (isShuffling) {
			trackIndex = Math.floor(Math.random() * tracksArr.length);
		} else {
			trackIndex = (trackIndex + 1) % tracksArr.length;
		}

		loadTrack(trackIndex);
		playTrack();
	}

	function prevTrack() {
		trackIndex = (trackIndex - 1) % tracksArr.length;

		loadTrack(trackIndex);
		playTrack();
	}

	function seekTo() {
		let seekto = duration * (seekSlider.value / 100);
		currentTrack.currentTime = seekto;
	}

	function setVolume() {
		currentTrack.volume = volumeSlider.value / 100;
	}

	function seekUpdate() {
		let seekPosition = 0;

		if (!isNaN(currentTrack.duration)) {
			seekPosition = currentTrack.currentTime * (100 / currentTrack.duration);

			seekSlider.value = seekPosition;

			let currentMinutes = Math.floor(currentTrack.currentTime / 60);
			let currentSeconds = Math.floor(
				currentTrack.currentTime - currentMinutes * 60
			);
			let durationMinutes = Math.floor(currentTrack.duration / 60);
			let durationSeconds = Math.floor(
				currentTrack.duration - durationMinutes * 60
			);

			if (currentSeconds < 10) {
				currentSeconds = '0' + currentSeconds;
			}
			if (durationSeconds < 10) {
				durationSeconds = '0' + durationSeconds;
			}
			if (currentMinutes < 10) {
				currentMinutes = '0' + currentMinutes;
			}
			if (durationMinutes < 10) {
				durationMinutes = '0' + durationMinutes;
			}

			currentTime.innerHTML = currentMinutes + ':' + currentSeconds;
			totalDuration.innerHTML = durationMinutes + ':' + durationSeconds;
		}
	}
}

/*
	trackArr -> play -> click -> trackArr ka pehla play hoga -> isPlaying -> true & play song
	second click -> pause

	next -> (idx+1) % arr.length;
	prev -> (idx-- ) % arr.length

	sound gif -> https://icons8.com/free-animated-icons/sound
	

*/
