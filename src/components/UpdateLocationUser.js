    import React, { useState, useEffect } from 'react';
    import { auth, db } from '../firebase';
    import { doc, getDoc, updateDoc } from 'firebase/firestore';
    import { useNavigate } from 'react-router-dom';
    import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
    import 'leaflet/dist/leaflet.css';

    const UpdateLocationUser = () => {
        const navigate = useNavigate();
        const [locationData, setLocationData] = useState({
            latitude: '',
            longitude: ''
        });
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const [isMapPopupOpen, setIsMapPopupOpen] = useState(false);
        const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default center

        useEffect(() => {
            const fetchLocationData = async () => {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setLocationData({
                            latitude: userData.latitude || '',
                            longitude: userData.longitude || ''
                        });
                    } else {
                        console.error('No such document in Firestore!');
                        setError('User location data not found.');
                    }
                } else {
                    setError('No user is currently logged in.');
                }
            };

            fetchLocationData();
            getCurrentLocation(); // Get the user's current location on component mount
        }, []);

        const handleChange = (e) => {
            const { name, value } = e.target;
            setLocationData(prevData => ({ ...prevData, [name]: value }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');

            try {
                const user = auth.currentUser;
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    await updateDoc(userDocRef, {
                        latitude: locationData.latitude,
                        longitude: locationData.longitude
                    });
                    alert('Location updated successfully!');
                    navigate('/editaccount'); // Navigate back to EditAccount after update
                } else {
                    setError('No user is currently logged in.');
                }
            } catch (error) {
                console.error('Error updating location:', error);
                setError('Error updating location. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setMapCenter([latitude, longitude]); // Set map center to user's location
                        setLocationData({
                            latitude,
                            longitude
                        });
                    },
                    (err) => {
                        console.error(err);
                        setError('Unable to retrieve your location.');
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        const openMapToSelectLocation = () => {
            setIsMapPopupOpen(true); // Open the map popup
        };

        const handleCloseMapPopup = (lat, lon) => {
            setLocationData({ latitude: lat, longitude: lon });
            setIsMapPopupOpen(false); // Close the map popup
        };

        return (
            <div style={containerStyle}>
                <h2>Update Location</h2>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <h3>Current Location:</h3>
                <p>Latitude: {locationData.latitude}</p>
                <p>Longitude: {locationData.longitude}</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="latitude">Latitude:</label>
                    <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={locationData.latitude}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <label htmlFor="longitude">Longitude:</label>
                    <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={locationData.longitude}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />

                    <button type="submit" style={buttonStyle}>Update Location</button>
                    <button type="button" onClick={getCurrentLocation} style={buttonStyle}>Get Current Location</button>
                    <button type="button" onClick={openMapToSelectLocation} style={buttonStyle}>Select Location on Map</button>
                </form>

                {isMapPopupOpen && (
                    <MapPopup
                        onSelectLocation={handleCloseMapPopup} // Pass function to get the selected location
                        onClose={() => setIsMapPopupOpen(false)} // Function to close the popup
                        mapCenter={mapCenter} // Pass the current map center
                    />
                )}
            </div>
        );
    };

    const MapPopup = ({ onClose, onSelectLocation, mapCenter }) => {
        const [position, setPosition] = useState(null);

        useEffect(() => {
            // Center the map on user's location
            if (mapCenter) {
                setPosition(mapCenter);
            }
        }, [mapCenter]);

        const LocationMarker = () => {
            useMapEvents({
                click(event) {
                    const { lat, lng } = event.latlng;
                    setPosition([lat, lng]); // Update position to clicked location
                },
            });
            return null; // No need to render anything here
        };

        const handleSaveLocation = () => {
            if (position) {
                onSelectLocation(position[0], position[1]); // Call the function to update the location
                onClose(); // Close the popup
            }
        };

        return (
            <div style={popupStyle}>
                <h3>Select Location</h3>
                <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={mapStyle}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker /> {/* Component to handle clicks */}
                    {position && (
                        <Marker position={position}>
                            <Popup>You are here!</Popup>
                        </Marker>
                    )}
                </MapContainer>
                <button onClick={handleSaveLocation} disabled={!position} style={saveButtonStyle}>
                    Save Location
                </button>
                <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            </div>
        );
    };

    // Styles for the UpdateLocation component
    const containerStyle = {
        width: '300px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        borderRadius: '10px',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    };

    const popupStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
    };

    const mapStyle = {
        height: '600px',  // Increased height for the map
        width: '600px',   // Increased width for the map
    };

    const saveButtonStyle = {
        margin: '10px 5px',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    };

    const cancelButtonStyle = {
        margin: '10px 5px',
        padding: '10px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    };

    export default UpdateLocationUser;
