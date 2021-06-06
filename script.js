let homeBtn = document.querySelector('.home');
let searchBtn = document.querySelector('.search');
let likedSongsBtn = document.querySelector('.liked-songs');
let homeIcon = document.querySelector('.home-icon');
let likedSongsIcon = document.querySelector('.liked-songs-icon');
let searchIcon = document.querySelector('.search-icon');
let options = document.querySelectorAll('.option');
let likedSongsContainer = document.querySelector('.liked-songs-container');
let navigationBtn = document.querySelector('.navigation-container');

homeBtn.addEventListener('click', homeFunction);

searchBtn.addEventListener('click', searchFunction);

likedSongsBtn.addEventListener('click', likedSongsFunction);

// navigationBtn.addEventListener('click', navigationFunction);

let homeClickCount = 0;
let homeIconFilled = false;
let searchClickCount = 0;
let likedSongsClickCount = 0;
let likedSongsIconFilled = false;

function homeFunction() {
	// REMOVE ACTIVE CLASS FROM ALL OTHER & CHANGE THEIR ICONS
	for (let i = 0; i < options.length; i++) {
		options[i].classList.remove('left-option-active');

		if (likedSongsIconFilled) {
			likedSongsIcon.innerHTML = `
                <span class="material-icons-outlined">
                    favorite_border
                </span>
            `;

			likedSongsIconFilled = false;
		}
	}

	// CHANGE ICON
	homeIcon.innerHTML = `
        <span class="material-icons">
            home
        </span>
    `;

	homeIconFilled = true;

	// CHANGE TO ACTIVE CLASS
	homeBtn.classList.add('left-option-active');

	showHomePage();
}

function searchFunction() {
	// REMOVE ACTIVE CLASS FROM ALL OTHER & CHANGE THEIR ICONS
	for (let i = 0; i < options.length; i++) {
		options[i].classList.remove('left-option-active');

		if (homeIconFilled) {
			homeIcon.innerHTML = `
                <span class="material-icons-outlined">
                    home
                </span>
            `;

			homeIconFilled = false;
		}

		if (likedSongsIconFilled) {
			likedSongsIcon.innerHTML = `
                <span class="material-icons-outlined">
                    favorite_border
                </span>
            `;

			likedSongsIconFilled = false;
		}
	}

	// CHANGE TO ACTIVE CLASS
	searchBtn.classList.add('left-option-active');

	searchClickCount++;
}

function likedSongsFunction() {
	// REMOVE ACTIVE CLASS FROM ALL OTHER & CHANGE THEIR ICONS
	for (let i = 0; i < options.length; i++) {
		options[i].classList.remove('left-option-active');

		if (homeIconFilled) {
			homeIcon.innerHTML = `
                <span class="material-icons-outlined">
                    home
                </span>
            `;

			homeIconFilled = false;
		}
	}

	// CHANGE ICON
	likedSongsIcon.innerHTML = `
        <span class="material-icons-outlined">
            favorite
        </span>
    `;

	likedSongsIconFilled = true;
	// CHANGE TO ACTIVE CLASS
	likedSongsBtn.classList.add('left-option-active');

	// SHOW LIKED SONGS ON RIGHT CONTAINER

	showLikedSongs();
}

async function showLikedSongs() {
	let contentHeading = document.querySelector('.content-heading');
	let genreContentHeading = document.querySelector('.genre-heading');
	let playlistContentHeading = document.querySelector(
		'.playlist-heading-details'
	);

	contentHeading.style.display = 'none';
	genreContentHeading.style.display = 'none';
	playlistContentHeading.style.display = 'none';
	browseContainer.style.display = 'none';
	playlistContainer.style.display = 'none';
	playlistPage.style.display = 'none';

	let mainTracksContainerLiked = document.querySelector(
		'.liked-songs-container .main-tracks-container'
	);

	for (let i = 0; i < likedSongsArr.length; i++) {
		// console.log(likedSongsArr[i]);

		createTrack(
			likedSongsArr[i].idx,
			likedSongsArr[i].id,
			likedSongsArr[i].trackName,
			likedSongsArr[i].albumName,
			likedSongsArr[i].img,
			likedSongsArr[i].releaseDate,
			likedSongsArr[i].artists,
			likedSongsArr[i].duration,
			likedSongsArr[i].songUrl,
			likedSongsArr[i].likedSongIdx
		);

		hoverTrack();

		musicPlayer();

		function createTrack(
			idx,
			id,
			trackName,
			albumName,
			img,
			releaseDate,
			artists,
			duration,
			songUrl,
			likedSongIdx
		) {
			let html = `
				<div class="track-index">
					<div class="track-index-number">${likedSongIdx + 1}</div>
						<span class="track-index-icon" style="display: none;">
							<i class="fas fa-play"></i>
						</span>
					</div>
				</div>
				
				<div class="track-title-container">
					<img src="${img}">
					<div class="track-row">
						<div class="track-title">
							<p>${trackName}</p>
						</div>
						<div class="track-artists">
							<span>
								${artists}
							</span>
						</div>
					</div>
				</div>

				<div class='track-album'>
					<span>
						${albumName}
					</span>
				</div>
				
				<div class='track-date'>${releaseDate}</div>
				
				<div class='track-duration'>${duration}</div>
				
				<div class="track-like-song">
					<input type="checkbox" class='heart-checkbox' name="heart" checked/>
				</div>
			`;

			let elem = document.createElement('div');
			elem.className = 'track';
			// elem.id = `${id}`;
			elem.innerHTML = html;

			mainTracksContainerLiked.appendChild(elem);
		}

		function musicPlayer() {
			// console.log('music player');

			mainMusicPlayer(likedSongsArr);
		}

		function hoverTrack() {
			let allTracks = document.querySelectorAll('.track');

			for (let i = 0; i < allTracks.length; i++) {
				let elem = allTracks[i];
				elem.addEventListener('mouseenter', function () {
					let trackIndex = document.querySelectorAll('.track-index-number');
					let trackIndexIcon = document.querySelectorAll('.track-index-icon');

					// console.log(trackIndex[i]);

					trackIndex[i].style.display = 'none';

					trackIndexIcon[i].style.display = 'block';
				});

				elem.addEventListener('mouseleave', function () {
					let trackIndex = document.querySelectorAll('.track-index-number');
					let trackIndexIcon = document.querySelectorAll('.track-index-icon');

					trackIndexIcon[i].style.display = 'none';

					trackIndex[i].style.display = 'block';
				});
			}
		}

		async function mainMusicPlayer(likedSongsArr) {
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
			let allTracks = document.querySelectorAll(
				'.liked-songs-container .track'
			);

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

			let allAudioElem = document.querySelectorAll('audio');

			for (let i = 0; i < allAudioElem.length; i++) {
				allAudioElem[i].remove();
			}

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
				console.log(likedSongsArr[trackIndex]);
				currentTrack.src = likedSongsArr[trackIndex].songUrl;
				currentTrack.load();

				// UPDATE DETAILS
				let trackImg = `<img src="${likedSongsArr[trackIndex].img}">`;
				trackImgContainer.innerHTML = trackImg;

				trackName.innerHTML = likedSongsArr[trackIndex].trackName;
				trackArtist.innerHTML = likedSongsArr[trackIndex].artists;

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

					// trackIndex = Math.floor(Math.random() * likedSongsArr.length);

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
					trackIndex = Math.floor(Math.random() * likedSongsArr.length);
				} else {
					trackIndex = (trackIndex + 1) % likedSongsArr.length;
				}

				loadTrack(trackIndex);
				playTrack();
			}

			function prevTrack() {
				trackIndex = (trackIndex - 1) % likedSongsArr.length;

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
					seekPosition =
						currentTrack.currentTime * (100 / currentTrack.duration);

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
	}

	console.log(likedSongsArr);

	likedSongsContainer.style.display = 'flex';
}

async function showHomePage() {
	playlistContainer.style.display = 'none';
	playlistContainer.innerHTML = '';
	playlistPage.style.display = 'none';
	let mainTracksContainer = document.querySelector(
		'.playlist-page .main-tracks-container'
	);
	// mainTracksContainer.innerHTML = '';
	likedSongsContainer.style.display = 'none';
	let mainTracksContainerLiked = document.querySelector(
		'.liked-songs-container .main-tracks-container'
	);
	mainTracksContainerLiked.innerHTML = '';

	browseContainer.style.display = 'flex';
}

// async function navigationFunction() {

// }

// IIFE FOR RESIZABLE LEFT CONTAINER
(function resizableX() {
	const resizer = document.querySelector('.resizer-x');
	resizer.addEventListener('mousedown', onmousedown);
	resizer.addEventListener('touchstart', ontouchstart);

	// for mobile
	function ontouchstart(e) {
		e.preventDefault();
		resizer.addEventListener('touchmove', ontouchmove);
		resizer.addEventListener('touchend', ontouchend);
	}
	function ontouchmove(e) {
		e.preventDefault();
		const clientX = e.touches[0].clientX;
		const deltaX = clientX - (resizer._clientX || clientX);
		resizer._clientX = clientX;
		const l = resizer.previousElementSibling;
		const r = resizer.nextElementSibling;
		// LEFT
		if (deltaX < 0) {
			const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
			l.style.flex = `0 ${w < 10 ? 0 : w}px`;
			r.style.flex = '1 0';
		}
		// RIGHT
		if (deltaX > 0) {
			const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
			r.style.flex = `0 ${w < 10 ? 0 : w}px`;
			l.style.flex = '1 0';
		}
	}
	function ontouchend(e) {
		e.preventDefault();
		resizer.removeEventListener('touchmove', ontouchmove);
		resizer.removeEventListener('touchend', ontouchend);
		delete e._clientX;
	}

	// for desktop
	function onmousedown(e) {
		e.preventDefault();
		document.addEventListener('mousemove', onmousemove);
		document.addEventListener('mouseup', onmouseup);
	}
	function onmousemove(e) {
		e.preventDefault();
		const clientX = e.clientX;
		const deltaX = clientX - (resizer._clientX || clientX);
		resizer._clientX = clientX;
		const l = resizer.previousElementSibling;
		const r = resizer.nextElementSibling;
		// LEFT
		if (deltaX < 0) {
			const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
			l.style.flex = `0 ${w < 10 ? 0 : w}px`;
			r.style.flex = '1 0';
		}
		// RIGHT
		if (deltaX > 0) {
			const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
			r.style.flex = `0 ${w < 10 ? 0 : w}px`;
			l.style.flex = '1 0';
		}
	}
	function onmouseup(e) {
		e.preventDefault();
		document.removeEventListener('mousemove', onmousemove);
		document.removeEventListener('mouseup', onmouseup);
		delete e._clientX;
	}
})();
