import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';
import { Front } from './front.js';

class MyMap {
	/**
	 * Create a map and interactions with her
	 * @param {object} mapElement - Map object create from Google Maps Api
	 * @param {number} lat - Lat of the map
	 * @param {number} lng - Lng of the map
	 */
	constructor(mapElement, lat, lng) {
		this.newMap;
		this.allMarkers = [];
		this.mapElement = mapElement;
		this.lat = lat;
		this.lng = lng;
	}

	/**
	 * Load the googles maps api and places libraries
	 * @return {promises} The promise of Google Maps Api
	 */
	loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

	/**
	 * Use a Geocoding (and reverse geocoding) from Google Maps Api
	 * @param {number} lat - Lat of the map
	 * @param {*} lng - Lng of the map
	 * @param {*} container - which indicate if the container is an html element
	 * @param {*} isForm  - which indicate if the container is inside a form
	 */
	static displayReverseGeocoding(lat, lng, container = false, isForm = false) {
		const latLng = `${lat}, ${lng}`;
		const myRequest = new Request(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${keyData.keyGeocoding}`
		);

		const reverseGeocoding = fetch(myRequest)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				if (container) {
					const addressClick = data.results[0].formatted_address;
					if (isForm) {
						container.value = addressClick;
						container.setAttribute('data-place-id', data.results[0].place_id);
					} else {
						container.textContent = addressClick;
					}
				}
			});
	}

	/**
	 * Create a google maps api
	 * @return {object} - New object of google maps api
	 */
	createMap() {
		this.newMap = new google.maps.Map(this.mapElement, {
			zoom: 14,
			center: new google.maps.LatLng(this.lat, this.lng),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		});

		const markerCenter = new google.maps.Marker({
			position: this.newMap.center,
			map: this.newMap,
			icon: {
				url: '../assets/img/icon-here.png',
			},
		});

		return this.newMap;
	}

	/**
	 * Add marker from the google maps object
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {object} latLng
	 * @param {string} title
	 * @param {number} stars
	 * @param {array} arrayOfAllMarkers
	 * @param {boolean} isAdd
	 * @return {array} - Array of all markers
	 */
	static addMarker(map, latLng, title, stars, arrayOfAllMarkers, isAdd = false) {
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
			stars: stars,
			icon: '../../assets/img/marker-food.png',
		});

		marker.setMap(map);

		if (isAdd) {
			map.panTo(latLng);
		}

		arrayOfAllMarkers.push(marker);

		return arrayOfAllMarkers;
	}

	/**
	 * Use street view api from the google maps to get image of restaurant
	 * @param {number} lat
	 * @param {number} lng
	 * @param {HTMLElement} container
	 */
	static getImgStreetView(lat, lng, container) {
		const location = `${lat}, ${lng}`;
		const params = {
			size: '600x600',
			location: location,
			key: keyData.key,
		};

		const urlImg = `https://maps.googleapis.com/maps/api/streetview?size=${params.size}&location=${params.location}&key=${params.key}`;

		container.style.backgroundImage = `url("${urlImg}")`;
	}

	/**
	 * Get average ratings and number of comment of each restaurant and add it of restaurant object
	 * @return {object} - Restaurant object with new value (average rating and nb rating)
	 */
	static getAverageStars() {
		// average stars
		restaurants.forEach((restaurant) => {
			let averageRatingRestaurant = 0;
			let nbRatings = 0;

			if (restaurant.ratings.length > 0) {
				restaurant.ratings.forEach((ratingRestaurant) => {
					nbRatings++;
					averageRatingRestaurant += ratingRestaurant.stars;
				});

				averageRatingRestaurant = averageRatingRestaurant / nbRatings;
			}

			if (averageRatingRestaurant % 1 !== 0) {
				averageRatingRestaurant = averageRatingRestaurant.toFixed(1);
			}

			restaurant.averageRatings = averageRatingRestaurant;
			restaurant.nbRatings = nbRatings;
		});
	}

	/**
	 * Set the all marker inside objet of google maps
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {array} arrayOfAllMarkers - Array of all markers
	 */
	static setMapOnAll(map, arrayOfAllMarkers) {
		for (let i = 0; i < arrayOfAllMarkers.length; i++) {
			arrayOfAllMarkers[i].setMap(map);
		}
	}

	/**
	 * clear the all markers inside object of google maps
	 * @param {array} arrayOfAllMarkers - Array of all markers
	 */
	static clearMarkers(arrayOfAllMarkers) {
		MyMap.setMapOnAll(null, arrayOfAllMarkers);
		arrayOfAllMarkers.splice(0, arrayOfAllMarkers.length);
	}

	/**
	 * delete all markers from array of all markers
	 * @param {array} arrayOfAllMarkers - Array of all markers
	 */
	static deleteMarkers(arrayOfAllMarkers) {
		MyMap.clearMarkers(arrayOfAllMarkers);
		arrayOfAllMarkers = [];
		return arrayOfAllMarkers;
	}

	/**
	 * Filter marker of google map with differents filters (limite of the map, reviews)
	 * @param {*} listeRestaurants
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {*} limiteMap
	 */
	static filterMarker(listrestaurants, map, limiteMap) {
		MyMap.deleteMarkers(map.allMarkers);
		for (const restaurant of listrestaurants) {
			const latLngRestaurant = { lat: restaurant.lat, lng: restaurant.lng };
			const rangeStars = document.querySelector('input#stars').value;
			const restaurantStars = restaurant.averageRatings;

			if (
				limiteMap.contains(latLngRestaurant) &&
				restaurantStars >= 0 &&
				restaurantStars <= rangeStars
			) {
				MyMap.addMarker(
					map.newMap,
					latLngRestaurant,
					restaurant.restaurantName,
					restaurant.averageRatings,
					map.allMarkers
				);

				Front.displayRestaurant(
					restaurant.restaurantName,
					restaurant.averageRatings,
					restaurant.address,
					restaurant.lat,
					restaurant.lng
				);
			}
		}
	}

	/**
	 * Controller method which display all markers of the maps under conditions
	 * @return {map} - Map with all markers displayed
	 */
	boundsChanged() {
		const containerControl = document.querySelector('.control');
		const thisMap = this;
		const thisFront = new Front();
		const arrayOfMarker = this.allMarkers;
		let limite;

		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			if (!containerControl.classList.contains('comment')) {
				limite = thisMap.newMap.getBounds();
				MyMap.getAverageStars();
				thisFront.reloadContentRestaurant();
				MyMap.filterMarker(restaurants, thisMap, limite);
				thisFront.enableScrollContent();
				Front.changeColorMarkerOnHover(arrayOfMarker);
				thisFront.displayCommentRestaurant();
			}
		});

		const rangeStars = document.querySelector('input#stars');
		const outputStars = document.querySelector('.output-stars .nb');

		if (rangeStars) {
			rangeStars.oninput = () => {
				if (!containerControl.classList.contains('comment')) {
					outputStars.innerHTML = rangeStars.value;
					thisFront.reloadContentRestaurant();
					MyMap.filterMarker(restaurants, thisMap, limite);
					thisFront.enableScrollContent();
					Front.changeColorMarkerOnHover(arrayOfMarker);
					thisFront.displayCommentRestaurant();
				}
			};
		}
	}

	/**
	 * Display modal add restaurant when right clicking inside the google map
	 * @return {modal} - Display modal add restaurant
	 */
	displayModalAddRestaurant() {
		const map = this.newMap;
		const bg = document.querySelector('.bg');
		const containerMap = document.querySelector('.container-map');
		const thisMap = this;

		map.addListener('click', function(e) {
			const latLngClick = e.latLng;
			const latClick = latLngClick.lat();
			const lngClick = latLngClick.lng();

			bg.classList.remove('hide');

			// container modal
			const modalAddRestaurant = document.createElement('div');
			modalAddRestaurant.classList.add('modal');
			modalAddRestaurant.classList.add('modal-add-restaurant');

			// left content
			const leftColumn = document.createElement('div');
			leftColumn.classList.add('left-column');

			// titre column left
			const containerTitleColumnLeft = document.createElement('div');
			containerTitleColumnLeft.classList.add('container-title');
			const title = document.createElement('h3');
			title.textContent = 'Ajouter un restaurant';
			const subTitle = document.createElement('span');
			subTitle.textContent = 'à cette adresse';

			title.appendChild(subTitle);
			containerTitleColumnLeft.appendChild(title);

			// input fields
			const inputFields = document.createElement('div');
			inputFields.classList.add('input-fields');

			// create form
			const formInputFields = document.createElement('form');

			// name of restaurant
			const containerNameRestaurant = document.createElement('div');
			containerNameRestaurant.classList.add('container-name-restaurant');
			const labelNameRestaurant = document.createElement('label');
			labelNameRestaurant.setAttribute('for', 'name-restaurant');
			labelNameRestaurant.textContent = 'Rentrez le nom de votre restaurant : ';
			const inputNameRestaurant = document.createElement('input');
			inputNameRestaurant.type = 'text';
			inputNameRestaurant.setAttribute('required', '');
			inputNameRestaurant.setAttribute('maxLength', '50');
			inputNameRestaurant.id = 'name-restaurant';

			containerNameRestaurant.appendChild(labelNameRestaurant);
			containerNameRestaurant.appendChild(inputNameRestaurant);
			inputFields.appendChild(containerNameRestaurant);

			// address of restaurant
			const containerAddressRestaurant = document.createElement('div');
			containerAddressRestaurant.classList.add('container-address-restaurant');
			const labelAddressRestaurant = document.createElement('label');
			labelAddressRestaurant.setAttribute('for', 'address-restaurant');
			labelAddressRestaurant.textContent = "Rentrez l'adresse de votre restaurant : ";
			const inputAddressRestaurant = document.createElement('input');
			inputAddressRestaurant.type = 'text';
			inputAddressRestaurant.setAttribute('required', '');
			inputAddressRestaurant.setAttribute('maxLength', '100');
			inputAddressRestaurant.setAttribute('disabled', '');
			inputAddressRestaurant.id = 'address-restaurant';

			MyMap.displayReverseGeocoding(latClick, lngClick, inputAddressRestaurant, true);

			containerAddressRestaurant.appendChild(labelAddressRestaurant);
			containerAddressRestaurant.appendChild(inputAddressRestaurant);
			inputFields.appendChild(containerAddressRestaurant);

			// btn submit
			const containerBtnSubmit = document.createElement('div');
			containerBtnSubmit.classList.add('submit-comment');
			const btnSubmit = document.createElement('input');
			btnSubmit.type = 'submit';

			containerBtnSubmit.appendChild(btnSubmit);
			inputFields.appendChild(containerBtnSubmit);

			formInputFields.appendChild(inputFields);

			// right content
			const rightColumn = document.createElement('div');
			rightColumn.classList.add('right-column');
			// get image street view
			import('./myMap').then((MyMap) => {
				MyMap.MyMap.getImgStreetView(latLngClick.lat(), latLngClick.lng(), rightColumn);
			});

			leftColumn.appendChild(containerTitleColumnLeft);
			leftColumn.appendChild(formInputFields);

			modalAddRestaurant.appendChild(leftColumn);
			modalAddRestaurant.appendChild(rightColumn);
			containerMap.appendChild(modalAddRestaurant);

			bg.addEventListener('click', () => {
				const modalAddRestaurant = document.querySelectorAll('.modal-add-restaurant');
				modalAddRestaurant.forEach((modal) => {
					modal.remove();
				});
			});

			MyMap.addRestaurant(thisMap.newMap, latClick, lngClick, thisMap.allMarkers);
		});
	}

	/**
	 * Add restaurant after clicking of submit button from the modal add restaurant
	 * @param {object} map - Map object create from Google Maps Api
	 * @param {number} latClick - lat position of the right click
	 * @param {number} lngClick - lng position of the right click
	 * @param {*} arrayOfAllMarkers - array of all markers
	 */
	static addRestaurant(map, latClick, lngClick, arrayOfAllMarkers) {
		const modalAddRestaurant = document.querySelector('.modal-add-restaurant');

		if (modalAddRestaurant) {
			const inputNameRestaurant = modalAddRestaurant.querySelector('input#name-restaurant');
			const inputAddressRestaurant = modalAddRestaurant.querySelector(
				'input#address-restaurant'
			);
			const btnSubmit = modalAddRestaurant.querySelector('input[type="submit"]');

			const thisMap = this;

			btnSubmit.addEventListener('click', (e) => {
				if (inputNameRestaurant.value !== '' && inputAddressRestaurant.value !== '') {
					e.preventDefault();

					const nameRestaurant = inputNameRestaurant.value;
					const addressRestaurant = inputAddressRestaurant.value;
					const latRestaurant = latClick;
					const lngRestaurant = lngClick;
					const latLngRestaurant = { lat: latRestaurant, lng: lngRestaurant };
					const averageRatingsDefault = 1;

					const jsonDataRestaurant = {
						restaurantName: nameRestaurant,
						address: addressRestaurant,
						lat: latRestaurant,
						lng: lngRestaurant,
						averageRatings: averageRatingsDefault,
						nbRatings: 0,
						ratings: [],
					};

					restaurants.push(jsonDataRestaurant);

					MyMap.addMarker(
						map,
						latLngRestaurant,
						nameRestaurant,
						averageRatingsDefault,
						arrayOfAllMarkers,
						true
					);

					modalAddRestaurant.remove();

					const bg = document.querySelector('.bg');
					bg.classList.add('hide');
				}
			});
		}
	}
}

export { MyMap };
