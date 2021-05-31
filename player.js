async function mainMusicPlayer(trackIndex) {
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

	// let now_playing = document.querySelector('.now-playing');

	// console.log(audioSrc);

	let isPlaying = false;
	let updateTimer;

	let currentTrack = document.createElement('audio');
	let audioSrc = tracksArr[trackIndex];

	function loadTrack(trackIndex) {
		// Clear the previous seek timer
		clearInterval(updateTimer);
		// resetValues();

		// Load a new track
		console.log(tracksArr[trackIndex].songUrl);
		currentTrack.src = tracksArr[trackIndex].songUrl;
		currentTrack.load();

		// UPDATE DETAILS
		let trackImg = `<img src="${tracksArr[trackIndex].img}">`;
		trackImgContainer.innerHTML = trackImg;

		trackName.innerHTML = tracksArr[trackIndex].trackName;
		trackArtist.innerHTML = tracksArr[trackIndex].artists;

		// updateTimer = setInterval(seekUpdate, 1000);
		currentTrack.addEventListener('ended', nextTrack);
	}

	loadTrack(trackIndex);
}

/*
	trackArr -> play -> click -> trackArr ka pehla play hoga -> isPlaying -> true & play song
	second click -> pause

	next -> (idx+1) % arr.length;
	prev -> (idx-- ) % arr.length

	
	

*/
