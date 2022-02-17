import { useMap, useMapEvents } from 'react-leaflet';

import { getDistanceFromLatLonInKm } from '../utils/map.util';

export const MapListener = ({ position, setPosition, radius }) => {
    const map = useMap();

    useMapEvents({
        dragend: () => {
            const d = getDistanceFromLatLonInKm(map.getCenter().lat, map.getCenter().lng, position.latitude, position.longitude);
            if (d >= radius / 2) {
                setPosition({ latitude: map.getCenter().lat, longitude: map.getCenter().lng });
            }
        },
        zoomend: () => {
            const d = getDistanceFromLatLonInKm(map.getCenter().lat, map.getCenter().lng, position.latitude, position.longitude)
            if (d >= radius) {
                setPosition({ latitude: map.getCenter().lat, longitude: map.getCenter().lng });
            }
        },
    });

    return null;
}