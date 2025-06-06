import React, {useEffect, useState} from "react";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import L from "leaflet"; // Import Leaflet to handle icons
import {FaBus} from "react-icons/fa"; // Import the bus icon from react-icons
import "leaflet/dist/leaflet.css";
import ReactDOMServer from "react-dom/server"; // To render JSX as string for custom icon

const CurrenLocation = () => {
    // Fixed origin and destination coordinates
    const origin = {latitude: 37.4219983, longitude: -122.084}; // Origin: Google HQ
    const destination = {latitude: 37.774929, longitude: -122.419418}; // Destination: San Francisco

    // Dynamic state for current location and driver/vehicle name
    const [location, setLocation] = useState({
        latitude: 37.5,
        longitude: -122.25,
        name: "Unknown Driver",
    });

    // Create a custom bus icon using react-icons
    const busMarkerIcon = L.divIcon({
        html: ReactDOMServer.renderToString(<FaBus size={32} color="blue"/>), // Render the bus icon as a string
        className: "custom-bus-icon", // Custom class for styling
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
    });

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new SockJS("http://localhost:8888/ws");
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log("Connected: " + frame);
            stompClient.subscribe("/topic/locations", (message) => {
                console.log("Message received: ", message);
                const locationData = JSON.parse(message.body);
                setLocation({
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    name: locationData.name, // Assuming name comes from WebSocket
                });
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);

    // Define the route as an array of [latitude, longitude] pairs including origin, current, and destination
    const route = [
        [origin.latitude, origin.longitude], // Origin
        [location.latitude, location.longitude], // WebSocket location (intermediate point)
        [destination.latitude, destination.longitude], // Destination
    ];

    return (
        <div>
            <h2>Live Tracking for {location.name}</h2>
            <MapContainer center={[location.latitude, location.longitude]} zoom={10}
                          style={{height: "500px", width: "100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Marker for origin */}
                <Marker position={[origin.latitude, origin.longitude]}>
                    <Popup>
                        Origin: <br/> Latitude: {origin.latitude}, Longitude: {origin.longitude}
                    </Popup>
                </Marker>
                {/* Marker for WebSocket location (intermediate point) */}
                <Marker position={[location.latitude, location.longitude]} icon={busMarkerIcon}>
                    <Popup>
                        {location.name}'s Current Location: <br/> Latitude: {location.latitude},
                        Longitude: {location.longitude}
                    </Popup>
                </Marker>
                {/* Marker for destination */}
                <Marker position={[destination.latitude, destination.longitude]}>
                    <Popup>
                        Destination: <br/> Latitude: {destination.latitude}, Longitude: {destination.longitude}
                    </Popup>
                </Marker>
                {/* Polyline to draw a route between origin, current location, and destination */}
                <Polyline positions={route} color="blue"/>
            </MapContainer>
        </div>
    );
};

export default CurrenLocation;
