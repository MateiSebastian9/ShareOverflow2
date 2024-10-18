import React, { useEffect } from 'react';

const Map = () => {
    useEffect(() => {
        const initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 44.4268, lng: 26.1025 },
                zoom: 12,
                styles: [
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#444444"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#a69aba"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#d4d1d5"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#d4cae3"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    }
                ],
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
            });
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        // Set the map center to user's location
                        map.setCenter(userLocation);

                        // Optional: Add a marker for user's location
                        new window.google.maps.Marker({
                            position: userLocation,
                            map: map,
                            title: 'You are here!',
                        });
                    },
                    () => {
                        // Handle error
                        handleLocationError(true, map.getCenter());
                    }
                );
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, map.getCenter());
            }
        };

        const handleLocationError = (browserHasGeolocation, pos) => {
            const infoWindow = new window.google.maps.InfoWindow({
                map: window.map,
                position: pos,
                content: browserHasGeolocation
                    ? 'Error: The Geolocation service failed.'
                    : 'Error: Your browser doesn\'t support geolocation.',
            });
        };
            if (window.google) {
                initMap();
            } else {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}&callback=initMap`;
                script.async = true;
                script.defer = true;
                window.initMap = initMap;
                document.body.appendChild(script);
            }
    }, []);

    return <div id="map" style={{ height: '100vh', width: '100%' }} />;
};

export default Map;