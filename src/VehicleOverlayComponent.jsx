import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import {Marker, Polyline, Popup} from "react-leaflet";
import {useEffect, useState} from "react";

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const VehicleOverlayComponent = () => {
	const [vehicleData, setVehicleData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:8080/vehicles/');
				const json = await response.json();
				setVehicleData(prevData => {
					const updatedData = [...prevData];
					json.forEach((item) => {
						for (const i in updatedData) {
							if (updatedData[i].name === item.name) {
								updatedData[i] = {...item, history: updatedData[i].history};
								if (!updatedData[i].history.find(coords => coords === [item.lat, item.lng])){
									updatedData[i].history.push([item.lat, item.lng]);
								}
								return;
							}
						}
						updatedData.push({...item, history: [[item.lat, item.lng]]});
					});
					return updatedData;
				});
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
		// const intervalId = setInterval(fetchData, 100);
		// return () => clearInterval(intervalId);
	}, []);

	const vehicleMarkers = vehicleData.map((vehicle) => {
		console.log(vehicle.history)
		return (
			<div key={vehicle.name}>
				<Marker position={[vehicle.lat, vehicle.lng]}>
					<Popup>
						{vehicle.name}
					</Popup>
				</Marker>
				<Polyline positions={[[43.678138448, -79.349298308], [43.67814288575, -79.34927715387501]]} color='green'/>
			</div>
		);
	});

	return vehicleMarkers;
};

export default VehicleOverlayComponent;
