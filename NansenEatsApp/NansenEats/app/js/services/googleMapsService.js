(function () {
	'use strict';

	angular
		.module('app')
		.factory('googleMapsService', googleMapsService);

	googleMapsService.$inject = ['$http', '$location', 'exception'];

	function googleMapsService($http, $location, exception) {
		var office = {
			name: 'Office',
			lat: 41.8894833,
			lng: -87.6517529
		}

		var service = {};

		function _load(markers) {
			_loadScript();

			function _loadScript() {
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=initializeMap';

				//so google maps can find the callback
				window.initializeMap = _initializeMap;

				document.body.appendChild(script);
			}

			function _initializeMap() {
				var officeMarker = [office.name, office.lat, office.lng];
				markers.unshift(officeMarker);

				var map;
				var mapOptions = {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: false
				};

				// Display a map on the page
				map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

				// Display multiple markers on a map
				var infoWindow = new google.maps.InfoWindow(), marker, i;
				var bounds = new google.maps.LatLngBounds();


				// Loop through our array of markers & place each one on the map  
				for (i = 0; i < markers.length; i++) {
					var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
					bounds.extend(position);
					marker = new google.maps.Marker({
						position: position,
						map: map,
						title: markers[i][0]
					});
					// Automatically center the map fitting all markers on the screen
					map.fitBounds(bounds);
				}
			}
		}

		service.load = _load;
		return service;

	}
})();