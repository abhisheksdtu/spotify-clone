const browseContainer = document.querySelector('.browse-container');
const playlistContainer = document.querySelector('.playlist-container');

const genreImg = document.querySelector('.browse-container .browse .img');
const genreHeading = document.querySelector(
	'.browse-container .browse .heading'
);
const genreDescription = document.querySelector(
	'browse-container .browse .description'
);

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
		const limit = 10;

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
		const limit = 10;

		const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + token },
		});

		const data = await result.json();

		console.log(data.items);

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
		selectGenre: '#select_genre',
		selectPlaylist: '#select_playlist',
		buttonSubmit: '#btn_submit',
		divSongDetail: '#song-detail',
		hfToken: '#hidden_token',
		divSonglist: '.song-list',
	};

	// console.log(browseContainer);
	// console.log(genre);

	//public methods
	return {
		// CREATES A GENRE
		createGenre(text, value, imgUrl) {
			// const html = `<option value="${value}">${text}</option>`;
			// document
			// 	.querySelector(DOMElements.selectGenre)
			// 	.insertAdjacentHTML('beforeend', html);

			browseContainer.style.display = 'flex';

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

		createPlaylist(name, value, description, img, owner) {
			browseContainer.style.display = 'none';
			playlistContainer.style.display = 'flex';

			let html = `
          <img src="${img}">
          <div class="heading">${name}</div>
          <div class="owner">By ${owner}</div>          
      `;

			let elem = document.createElement('div');
			elem.className = 'playlist';
			elem.id = `${value}`;
			elem.innerHTML = html;

			playlistContainer.appendChild(elem);
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

			// console.log(g);

			g.addEventListener('click', async function () {
				//get the token that's stored on the page
				const token = UICtrl.getStoredToken().token;
				// get the genre select field
				// const genreSelect = g.id;
				// get the genre id associated with the selected genre
				const genreId = g.id;
				// console.log(g.id);
				// ge the playlist based on a genre
				const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
				// create a playlist list item for every playlist returned
				playlist.forEach((p) => {
					console.log(p);
					// console.log(p.owner.display_name);
					UICtrl.createPlaylist(
						p.name,
						p.tracks.href,
						p.description,
						p.images[0].url,
						p.owner.display_name
					);
				});
			});
		}
	};

	return {
		init() {
			console.log('App is starting');
			loadGenres();
		},
	};
})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();
