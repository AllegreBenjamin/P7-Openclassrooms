import loadGoogleMapsApi from 'load-google-maps-api';
import keyData from '../assets/data/key.json';
import restaurants from '../assets/data/restaurants.json';
import { Front } from './front.js';

class MyMap {
	constructor(mapElement, lat, lng) {
		this.newMap;
		this.allMarkers = [];
		this.mapElement = mapElement;
		this.lat = lat;
		this.lng = lng;
	}
	loadGoogleMapsApi() {
		return loadGoogleMapsApi({ key: keyData.key });
	}

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

	static addMarker(map, latLng, title, stars, arrayOfAllMarkers) {
		const marker = new google.maps.Marker({
			position: latLng,
			map: map,
			title: title,
			stars: stars,
			icon: '../../assets/img/marker-food.png',
		});

		marker.setMap(map);

		arrayOfAllMarkers.push(marker);

		return arrayOfAllMarkers;
	}

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

	getAverageStars() {
		// average stars
		restaurants.forEach((restaurant) => {
			let averageRatingRestaurant = 0;
			let nbRatings = 0;

			restaurant.ratings.forEach((ratingRestaurant) => {
				nbRatings++;
				averageRatingRestaurant += ratingRestaurant.stars;
			});

			averageRatingRestaurant = averageRatingRestaurant / nbRatings;

			restaurant.averageRatings = averageRatingRestaurant;
			restaurant.nbRatings = nbRatings;
		});
	}

	static setMapOnAll(map, arrayOfAllMarkers) {
		for (let i = 0; i < arrayOfAllMarkers.length; i++) {
			arrayOfAllMarkers[i].setMap(map);
		}
	}

	static clearMarkers(arrayOfAllMarkers) {
		MyMap.setMapOnAll(null, arrayOfAllMarkers);
		arrayOfAllMarkers.splice(0, arrayOfAllMarkers.length);
	}

	static deleteMarkers(arrayOfAllMarkers) {
		MyMap.clearMarkers(arrayOfAllMarkers);
		arrayOfAllMarkers = [];
		return arrayOfAllMarkers;
	}

	static filterMarker(listrestaurants, map, limiteMap) {
		MyMap.deleteMarkers(map.allMarkers);
		for (const restaurant of listrestaurants) {
			const latLngRestaurant = { lat: restaurant.lat, lng: restaurant.lng };
			const rangeStars = document.querySelector('input#stars').value;
			const restaurantStars = restaurant.averageRatings;

			if (
				limiteMap.contains(latLngRestaurant) &&
				restaurantStars > 0 &&
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

	boundsChanged() {
		const containerControl = document.querySelector('.control');
		const thisMap = this;
		const thisFront = new Front();
		const arrayOfMarker = this.allMarkers;
		let limite;

		google.maps.event.addListener(thisMap.newMap, 'idle', function() {
			if (!containerControl.classList.contains('comment')) {
				limite = thisMap.newMap.getBounds();
				thisMap.getAverageStars();
				thisFront.reloadContentRestaurant();
				MyMap.filterMarker(restaurants, thisMap, limite);
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
					Front.changeColorMarkerOnHover(arrayOfMarker);
					thisFront.displayCommentRestaurant();
				}
			};
		}
	}

	// displayCommentRestaurant() {
	// 	const dataRestaurants = restaurants;
	// 	const containerControl = document.querySelector('.container-map .control');
	// 	const listrestaurants = document.querySelector('.list-restaurants');

	// 	if (listrestaurants) {
	// 		const restaurants = listrestaurants.querySelectorAll('.restaurant');
	// 		const thisFront = new Front();
	// 		restaurants.forEach((restaurant) => {
	// 			restaurant.addEventListener('click', () => {
	// 				containerControl.classList.add('comment');
	// 				thisFront.reloadContentRestaurant();
	// 				const restaurantId = restaurant.dataset.id;

	// 				dataRestaurants.forEach((dataRestaurant) => {
	// 					if (restaurantId === dataRestaurant.restaurantName) {
	// 						const latRestaurant = dataRestaurant.lat;
	// 						const lngRestaurant = dataRestaurant.lng;
	// 						const nameRestaurant = dataRestaurant.restaurantName;
	// 						const averageRatingsRestaurant = dataRestaurant.averageRatings;
	// 						const nbRatings = dataRestaurant.nbRatings;
	// 						const addressRestaurant = dataRestaurant.address;
	// 						const allComments = dataRestaurant.ratings;

	// 						const containerRestaurant = document.createElement('div');
	// 						containerRestaurant.classList.add('container-restaurant');

	// 						// btn back to list of restaurants
	// 						const btnBack = document.createElement('div');
	// 						btnBack.classList.add('back-to-list');
	// 						const iconBack = document.createElement('img');
	// 						iconBack.src = '../../assets/img/chevron-left.png';
	// 						btnBack.appendChild(iconBack);

	// 						btnBack.addEventListener('click', () => {
	// 							this.backToList();
	// 						});

	// 						const containerInfRestaurant = document.createElement('div');
	// 						containerInfRestaurant.classList.add('container-inf-restaurant');

	// 						// image restaurant
	// 						const containerImgRestaurant = document.createElement('div');
	// 						containerImgRestaurant.classList.add('img-restaurant');
	// 						MyMap.getImgStreetView(
	// 							latRestaurant,
	// 							lngRestaurant,
	// 							containerImgRestaurant
	// 						);

	// 						// name restaurant
	// 						const containerTitleRestaurant = document.createElement('div');
	// 						containerTitleRestaurant.classList.add('name-restaurant');
	// 						const titleRestaurant = document.createElement('h3');
	// 						titleRestaurant.textContent = nameRestaurant;
	// 						containerTitleRestaurant.appendChild(titleRestaurant);

	// 						// address restaurant
	// 						const containerAddressRestaurant = document.createElement('div');
	// 						containerAddressRestaurant.classList.add('address-restaurant');
	// 						containerAddressRestaurant.textContent = addressRestaurant;

	// 						// average ratings restaurant
	// 						const containerAverageRatings = document.createElement('div');
	// 						containerAverageRatings.classList.add('average-ratings');
	// 						const titleAverageRatings = document.createElement('div');
	// 						const containerRatings = document.createElement('div');
	// 						containerRatings.classList.add('ratings');
	// 						titleAverageRatings.classList.add('title-average');
	// 						titleAverageRatings.textContent = 'Moyenne des avis';
	// 						const averageRatings = document.createElement('span');
	// 						averageRatings.classList.add('average');
	// 						const containerStars = document.createElement('div');
	// 						containerStars.classList.add('stars');
	// 						const containerNbRatings = document.createElement('span');
	// 						containerNbRatings.classList.add('nb-ratings');

	// 						averageRatings.textContent = averageRatingsRestaurant;

	// 						for (let i = 1; i <= 5; i++) {
	// 							const star = document.createElement('span');
	// 							star.classList.add(`star-${i}`);

	// 							if (i <= averageRatingsRestaurant) {
	// 								star.classList.add('active');
	// 							}
	// 							containerStars.appendChild(star);
	// 						}

	// 						containerNbRatings.textContent = `${nbRatings} avis`;

	// 						containerRatings.appendChild(averageRatings);
	// 						containerRatings.appendChild(containerStars);
	// 						containerRatings.appendChild(containerNbRatings);
	// 						containerAverageRatings.appendChild(titleAverageRatings);
	// 						containerAverageRatings.appendChild(containerRatings);

	// 						// display all comments of restaurant (and note)
	// 						const containerCommentsRestaurant = document.createElement('div');
	// 						containerCommentsRestaurant.classList.add('comments-restaurant');

	// 						allComments.forEach((comment) => {
	// 							const containerComment = document.createElement('div');
	// 							containerComment.classList.add('container-comment');
	// 							const containerAvatar = document.createElement('div');
	// 							containerAvatar.classList.add('container-avatar');

	// 							const avatar = document.createElement('div');
	// 							avatar.classList.add('avatar');
	// 							avatar.style.backgroundImage = `url("../../assets/img/unknow.png")`;

	// 							const nameAuthor = document.createElement('div');
	// 							nameAuthor.classList.add('name-author');
	// 							nameAuthor.textContent = 'unknow';

	// 							const note = document.createElement('div');
	// 							note.classList.add('note');

	// 							for (let i = 1; i <= 5; i++) {
	// 								const star = document.createElement('span');
	// 								star.classList.add(`star-${i}`);

	// 								if (i <= comment.stars) {
	// 									star.classList.add('active');
	// 								}
	// 								note.appendChild(star);
	// 							}

	// 							const commentText = document.createElement('div');
	// 							commentText.classList.add('comment');
	// 							commentText.textContent = comment.comment;

	// 							containerAvatar.appendChild(avatar);
	// 							containerAvatar.appendChild(nameAuthor);
	// 							containerComment.appendChild(containerAvatar);
	// 							containerComment.appendChild(note);
	// 							containerComment.appendChild(commentText);
	// 							containerCommentsRestaurant.appendChild(containerComment);
	// 						});

	// 						// multiple insertion in HTML
	// 						containerRestaurant.appendChild(btnBack);
	// 						containerRestaurant.appendChild(containerImgRestaurant);
	// 						containerInfRestaurant.appendChild(containerTitleRestaurant);
	// 						containerInfRestaurant.appendChild(containerAddressRestaurant);
	// 						containerInfRestaurant.appendChild(containerAverageRatings);
	// 						containerInfRestaurant.appendChild(containerCommentsRestaurant);
	// 						containerRestaurant.appendChild(containerInfRestaurant);
	// 						containerControl.appendChild(containerRestaurant);
	// 					}
	// 				});
	// 			});
	// 		});
	// 	}
	// }

	// backToList() {
	// 	const control = document.querySelector('.control');
	// 	control.classList.remove('comment');
	// 	control.querySelector('.container-restaurant').remove();
	// 	this.boundsChanged();
	// }
}

export { MyMap };
