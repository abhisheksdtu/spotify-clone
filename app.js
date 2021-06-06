const browseContainer = document.querySelector('.browse-container');
const playlistContainer = document.querySelector('.playlist-container');
const genreImg = document.querySelector('.browse-container .browse .img');
const genreHeading = document.querySelector(
	'.browse-container .browse .heading'
);
const genreDescription = document.querySelector(
	'browse-container .browse .description'
);
let tracksContainer = document.querySelector('.tracks-container');
let playlistPage = document.querySelector('.playlist-page');
let contentHeading = document.querySelector('.content-heading');
let genreContentHeading = document.querySelector('.genre-heading');
let playlistContentHeading = document.querySelector(
	'.playlist-heading-details'
);

let tracksArr = [];

let likedSongsArr = [];

let likedSongIdx = 0;

const APIController = (function () {
	const clientId = 'ea31e31a4afd417383e99aa0e994dd8c';
	const clientSecret = '2b65112ba398461389dbbe48efa4f37a';

	// private methods
	const _getToken = async () => {
		const result = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: 'Basic ' + btoa(clientId + ':' + clientSecret),
			},
			body: 'grant_type=client_credentials',
		});

		const data = await result.json();

		console.log(data.access_token);

		return data.access_token;
	};

	const _getGenres = async (token) => {
		const result = await fetch(
			`https://api.spotify.com/v1/browse/categories?locale=sv_US`,
			{
				method: 'GET',
				headers: { Authorization: 'Bearer ' + token },
			}
		);

		const data = await result.json();
		return data.categories.items;
	};

	const _getPlaylistByGenre = async (token, genreId) => {
		const limit = 30;

		const result = await fetch(
			`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`,
			{
				method: 'GET',
				headers: { Authorization: 'Bearer ' + token },
			}
		);

		const data = await result.json();
		return data.playlists.items;
	};

	const _getTracks = async (token, tracksEndPoint) => {
		const limit = 100;

		const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + token },
		});

		const data = await result.json();

		// console.log(data.items);

		return data.items;
	};

	const _getTrack = async (token, trackEndPoint) => {
		const result = await fetch(`${trackEndPoint}`, {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + token },
		});

		const data = await result.json();
		return data;
	};

	return {
		getToken() {
			return _getToken();
		},
		getGenres(token) {
			return _getGenres(token);
		},
		getPlaylistByGenre(token, genreId) {
			return _getPlaylistByGenre(token, genreId);
		},
		getTracks(token, tracksEndPoint) {
			return _getTracks(token, tracksEndPoint);
		},
		getTrack(token, trackEndPoint) {
			return _getTrack(token, trackEndPoint);
		},
	};
})();

// UI Module
const UIController = (function () {
	//object to hold references to html selectors
	const DOMElements = {
		hfToken: '#hidden_token',
	};

	// console.log(browseContainer);
	// console.log(genre);

	//public methods
	return {
		// CREATES A GENRE
		createGenre(text, value, imgUrl) {
			// browseContainer.style.display = 'flex';

			// console.log(imgUrl);
			contentHeading.textContent = 'Browse All';
			genreContentHeading.style.display = 'none';

			let html = `
          		<img src="${imgUrl}">
          		<div class="heading">${text}</div>
      		`;

			let elem = document.createElement('div');
			elem.className = 'browse';
			elem.id = `${value}`;
			elem.innerHTML = html;

			// console.log(browseContainer);
			browseContainer.appendChild(elem);
		},

		createPlaylist(name, value, description, img, owner, genreName) {
			// console.log(name, genreName);
			contentHeading.style.display = 'none';
			genreContentHeading.style.display = 'flex';
			genreContentHeading.innerHTML = `
				<h1>${genreName}</h1>
			`;

			browseContainer.style.display = 'none';
			playlistContainer.style.display = 'none';
			playlistContainer.style.display = 'flex';

			let html = `
				<img src="${img}">
				<div class="heading">${name}</div>
				<div style='display:none'>${description}</div>
				<div class="owner">By
					<span>${owner}</span>
				</div>
			`;

			let elem = document.createElement('div');
			elem.className = 'playlist';
			elem.id = `${value}`;
			elem.innerHTML = html;

			playlistContainer.appendChild(elem);
		},

		createTrack(
			idx,
			id,
			trackName,
			albumName,
			img,
			releaseDate,
			artists,
			duration,
			songUrl
		) {
			browseContainer.style.display = 'none';
			playlistContainer.style.display = 'none';
			playlistPage.style.display = 'flex';

			let mainTracksContainer = document.querySelector(
				'.playlist-page .main-tracks-container'
			);

			if (tracksArr[idx] !== null) {
				// console.log(id);

				// if (tracksArr.includes(tracksArr[idx].idx)) {
				// 	console.log('true');
				// }

				// console.log(tracksArr[idx].idx);

				let html = `
					<div class="track-index">
                        <div class="track-index-number">${idx + 1}</div>
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
                        <input type="checkbox" class='heart-checkbox' name="heart" />
                    </div>
			`;

				let elem = document.createElement('div');
				elem.className = 'track';
				// elem.id = `${id}`;
				elem.innerHTML = html;

				mainTracksContainer.appendChild(elem);
			}
		},

		storeToken(value) {
			document.querySelector(DOMElements.hfToken).value = value;
		},

		getStoredToken() {
			return {
				token: document.querySelector(DOMElements.hfToken).value,
			};
		},
	};
})();

const APPController = (function (UICtrl, APICtrl) {
	// get input field object ref
	// const DOMInputs = UICtrl.inputField();

	// get genres on page load
	const loadGenres = async () => {
		//get the token
		const token = await APICtrl.getToken();
		//store the token onto the page
		UICtrl.storeToken(token);
		//get the genres
		const genres = await APICtrl.getGenres(token);
		//populate our genres select element
		genres.forEach((element) => {
			// console.log(element);
			// console.log(element.icons[0].url);
			UICtrl.createGenre(element.name, element.id, element.icons[0].url);
		});

		showPlaylist();
	};

	const showPlaylist = async () => {
		const genre = document.querySelectorAll('.browse');
		// console.log(genre);
		for (let i = 0; i < genre.length; i++) {
			let g = genre[i];

			// console.log(g.textContent);

			g.addEventListener('click', async function () {
				//get the token that's stored on the page
				const token = UICtrl.getStoredToken().token;
				// get the genre select field
				// const genreSelect = g.id;
				// console.log(g.id);
				// get the genre id associated with the selected genre
				const genreId = g.id;
				// console.log(g);
				// console.log(g.id);
				// ge the playlist based on a genre
				const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
				// console.log(playlist);
				// create a playlist list item for every playlist returned

				playlist.forEach((p) => {
					// console.log(p);
					// console.log(p.owner.display_name);
					UICtrl.createPlaylist(
						p.name,
						p.tracks.href,
						p.description,
						p.images[0].url,
						p.owner.display_name,
						g.textContent
					);
				});
				showSongs();
			});
		}
	};

	const showSongs = async () => {
		const playlist = document.querySelectorAll('.playlist');

		for (let i = 0; i < playlist.length; i++) {
			let g = playlist[i];
			// console.log(g);

			g.addEventListener('click', async function () {
				//get the token that's stored on the page
				const token = UICtrl.getStoredToken().token;
				// console.log(g.children[0].src);
				let playlistImg = g.children[0].src;
				// console.log(g.children[1].textContent);
				let playlistHeading = g.children[1].textContent;
				// console.log(g.children[2].textContent);
				let playlistDescription = g.children[2].textContent;
				console.log(g.children[3].children[0].textContent);
				let playlistOwner = g.children[3].children[0].textContent;

				const playlistId = g.id;
				// console.log(playlistId);

				// console.log(playlistImg);

				const tracks = await APICtrl.getTracks(token, playlistId);

				contentHeading.style.display = 'none';
				genreContentHeading.style.display = 'none';

				playlistContentHeading.innerHTML = `
					<div class="playlist-img">
							<img src="${playlistImg}">
					</div>
					<div class="playlist-content">
						<h2>
							Playlist
						</h2>
						<h1>${playlistHeading}</h1>
						<div class="playlist-description">${playlistDescription}</div>
						<div class="user-name-in-playlist">
							<span>${playlistOwner}</span>
						</div>
					</div>	
				`;

				playlistContentHeading.style.display = 'flex';

				let idx = 0;
				tracks.forEach((el) => {
					let artists = [];
					// console.log(artists);

					// console.log(el);

					// console.log(el.track.preview_url);

					for (let i in el.track.artists) {
						// console.log(el.track.artists[i].name);

						artists.push(' ' + el.track.artists[i].name);
					}

					let duration = millisToMinutesAndSeconds(el.track.duration_ms);

					// console.log(el.track.album.images[1].url);

					if (el.track.preview_url !== null) {
						// if(tracksArr.includes())
						tracksArr.push({
							idx: idx,
							trackName: el.track.name,
							artists: artists,
							img: el.track.album.images[1].url,
							songUrl: el.track.preview_url,
							duration: 30,
							albumName: el.track.album.name,
							releaseDate: el.track.album.release_date,
						});

						// console.log(tracksArr);

						UICtrl.createTrack(
							idx,
							el.track.href,
							el.track.name,
							el.track.album.name,
							el.track.album.images[1].url,
							el.track.album.release_date,
							artists,
							duration,
							el.track.preview_url
						);

						idx++;
					}
				});

				// console.log(tracksArr);

				hoverTrack();

				clickOnLikeBtn();

				musicPlayer();
			});
		}
	};

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

	function clickOnLikeBtn() {
		let allTracks = document.querySelectorAll('.heart-checkbox');

		for (let i = 0; i < allTracks.length; i++) {
			let elem = allTracks[i];

			let isSongLiked = false;

			// console.log(elem);

			// console.log(likedSongsArr);
			elem.addEventListener('change', function () {
				if (this.checked == true) {
					tracksArr[i].likedSongIdx = likedSongsArr.length;
					likedSongsArr[likedSongsArr.length] = tracksArr[i];

					// likedSongsArr[likedSongIdx].likedSongIdx = likedSongIdx;

					// console.log(likedSongsArr[likedSongIdx]);
					// console.log(likedSongsArr);

					// likedSongIdx++;
				} else {
					let index = likedSongsArr.findIndex((x) => x.idx === i);

					// console.log(index);

					// console.log(likedSongsArr);

					likedSongsArr.splice(index, 1);

					// console.log(likedSongsArr);
				}
			});
			// console.log(likedSongsArr);
		}
	}

	function musicPlayer() {
		// console.log('music player');

		mainMusicPlayer(tracksArr);
	}

	return {
		init() {
			console.log('App is starting');
			loadGenres();
		},
	};
})(UIController, APIController);

const millisToMinutesAndSeconds = (millis) => {
	let minutes = Math.floor(millis / 60000);
	let seconds = ((millis % 60000) / 1000).toFixed(0);

	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// will need to call a method to load the genres on page load
APPController.init();

// saari current track ko ek array me push krke aur uska output nikaal le
