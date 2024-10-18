import React, { useEffect } from 'react';

const Map = () => {
    useEffect(() => {
        const initMap = () => {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
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
