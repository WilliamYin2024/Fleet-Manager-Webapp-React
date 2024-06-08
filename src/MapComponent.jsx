import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import VehicleOverlayComponent from "./VehicleOverlayComponent.jsx";

let DefaultIcon = L.icon({
	iconUrl: icon,
	shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
	return (
		<MapContainer center={L.latLng(43.652364, -79.383614)} zoom={16} style={{ height: "100vh", width: "100vw" }}>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<VehicleOverlayComponent></VehicleOverlayComponent>
		</MapContainer>
	);
}

export default MapComponent;
