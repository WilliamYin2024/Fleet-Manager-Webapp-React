import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Marker, Polyline, Popup} from "react-leaflet";
import {useEffect, useState} from "react";
import API_URL from "./Config.js";

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
	iconSize: [35, 46],
	iconAnchor: [17, 46]
});

L.Marker.prototype.options.icon = DefaultIcon;

const VehicleOverlayComponent = (trackVehicle) => {
	const [vehicleData, setVehicleData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${API_URL}:8080/vehicles/`);
				const json = await response.json();
				const vehicleHistories = {};
				for (const item of json) {
					const historyResponse = await fetch(`${API_URL}:8080/history/${item.name}`);
					vehicleHistories[item.name] = await historyResponse.json();
				}
				setVehicleData(prevData => {
					const updatedData = [...prevData];
					json.forEach((item) => {
						for (const i in updatedData) {
							if (updatedData[i].name === item.name) {
								updatedData[i] = {...item, history: vehicleHistories[item.name]};
								return;
							}
						}
						updatedData.push({...item, history: vehicleHistories[item.name]});
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

	return vehicleData.map((vehicle) => {
		return (
			trackVehicle.trackVehicle[vehicle.name] && <div key={vehicle.name}>
				<Marker position={[vehicle.lat, vehicle.lng]}>
					<Popup>
						{vehicle.name}
					</Popup>
				</Marker>
				<Polyline positions={Array.from(vehicle.history)} color='green'/>
			</div>
		);
	});
};

export default VehicleOverlayComponent;
