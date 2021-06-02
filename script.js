let homeBtn = document.querySelector('.home');
let searchBtn = document.querySelector('.search');
let likedSongsBtn = document.querySelector('.liked-songs');
let homeIcon = document.querySelector('.home-icon');
let likedSongsIcon = document.querySelector('.liked-songs-icon');
let searchIcon = document.querySelector('.search-icon');
let options = document.querySelectorAll('.option');

let likedSongsContainer = document.querySelector('.liked-songs-container');

homeBtn.addEventListener('click', homeFunction);

searchBtn.addEventListener('click', searchFunction);

likedSongsBtn.addEventListener('click', likedSongsFunction);

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
	browseContainer.style.display = 'none';
	playlistContainer.style.display = 'none';
	playlistPage.style.display = 'none';

	likedSongsContainer.style.display = 'flex';
}

async function showHomePage() {
	playlistContainer.style.display = 'none';
	playlistPage.style.display = 'none';
	likedSongsContainer.style.display = 'none';

	browseContainer.style.display = 'flex';
}
