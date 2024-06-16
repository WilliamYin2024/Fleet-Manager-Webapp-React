import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import VehicleOverlayComponent from "./VehicleOverlayComponent.jsx";
import {useEffect, useState} from "react";
import {Menu, MenuItem, Sidebar} from "react-pro-sidebar";
import API_URL from "./Config.js";

const MapComponent = () => {
	const [trackVehicle, setTrackVehicle] = useState({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${API_URL}:8080/vehicles/`);
				const json = await response.json();
				setTrackVehicle(prevData => {
					const updatedData = {...prevData};
					json.forEach((item) => {
						if (!Object.prototype.hasOwnProperty.call(updatedData, item.name)) {
							updatedData[item.name] = true;
						}
					});
					return updatedData;
				});
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		const intervalId = setInterval(fetchData, 100);
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div key={"map"} style={{ display: 'flex', justifyContent: 'space-between' }}>
			<Sidebar style={{width: '20%', height: '100vh'}}>
				<Menu>
					{Object.entries(trackVehicle).map(([key, value]) => {
						return (
							<MenuItem key={key}>
								<label>
									{key}
									<input type={"checkbox"} checked={value} onChange={() => {
										const updatedData = {...trackVehicle};
										updatedData[key] = !updatedData[key];
										setTrackVehicle(updatedData);
									}}/>
								</label>
							</MenuItem>
						)
					})}
				</Menu>
			</Sidebar>
			<MapContainer center={L.latLng(43.652364, -79.383614)} zoom={11} style={{width: '80%', height: '100vh'}}>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<VehicleOverlayComponent trackVehicle={trackVehicle}></VehicleOverlayComponent>
			</MapContainer>
		</div>
	);
};

export default MapComponent;
