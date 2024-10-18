import React, { useEffect, useState, useRef } from 'react';

const Map = () => {
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        // Load Roboto font
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        const initMap = () => {
            if (!window.google) {
                console.error('Google Maps JavaScript API not loaded');
                return;
            }
            const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: 44.4268, lng: 26.1025 },
                zoom: 12,
                zoomControl: false, // Disable zoom control buttons
                styles: [
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#444444" }]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [{ "color": "#f2f2f2" }]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            { "saturation": -100 },
                            { "lightness": 45 }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [{ "visibility": "simplified" }]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road.local",
                        "elementType": "labels.icon",
                        "stylers": [{ "visibility": "off" }]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "geometry.fill",
                        "stylers": [
                            { "visibility": "on" },
                            { "color": "#d4d1d5" }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            { "color": "#d4cae3" },
                            { "visibility": "on" }
                        ]
                    }
                ],
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false
            });

            setMap(mapInstance);

            // Add custom styled pins
            addCustomStyledPins(mapInstance);
        };

        const createCustomPin = (color, scale = 1) => {
            return {
                path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                fillColor: color,
                fillOpacity: 1,
                strokeWeight: 0,
                rotation: 0,
                scale: scale,
                anchor: new window.google.maps.Point(12, 24),
            };
        };

        const addCustomStyledPins = (mapInstance) => {
            const pins = [
                { lat: 44.4268, lng: 26.1025, title: 'Pin 1', color: '#FF0000', scale: 1.5 },
                { lat: 44.4368, lng: 26.1125, title: 'Pin 2', color: '#00FF00', scale: 1.2 },
                { lat: 44.4168, lng: 26.0925, title: 'Pin 3', color: '#0000FF', scale: 1.8 },
            ];

            pins.forEach(pin => {
                const marker = new window.google.maps.Marker({
                    position: { lat: pin.lat, lng: pin.lng },
                    map: mapInstance,
                    title: pin.title,
                    icon: createCustomPin(pin.color, pin.scale),
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div style="font-family: 'Roboto', sans-serif;"><h3>${pin.title}</h3><p>Custom info here</p></div>`
                });

                marker.addListener('click', () => {
                    infoWindow.open(mapInstance, marker);
                });
            });
        };

        const loadGoogleMapsApi = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAPS_API_KEY}&callback=initMap`;
            script.async = true;
            script.defer = true;
            document.body.appendChild(script);
        };

        // Define the global initMap function
        window.initMap = initMap;

        // Load the API if it's not already loaded
        if (!window.google) {
            loadGoogleMapsApi();
        } else {
            initMap();
        }

        // Cleanup function
        return () => {
            const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
            if (script) script.remove();
            if (link) link.remove();
        };
    }, []);

    return (
        <div style={styles.container}>
            <div id="map" style={styles.map} />
        </div>
    );
};

// Styles for the Map component
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Full height of the viewport
        overflow: 'hidden', // Prevent overflow
    },
    map: {
        flexGrow: 1, // Allow map to grow and fill available space
        width: '100%',
    },
};

export default Map;
