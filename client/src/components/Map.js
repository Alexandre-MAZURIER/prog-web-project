import { CheckIcon, Cross1Icon } from '@modulz/radix-icons';
import { useNotifications } from '@mantine/notifications';
import { Icon, Point } from 'leaflet';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { getStationsAtDistance } from '../api';

const icon = new Icon({
    iconUrl: 'assets/gaz_station_icon.png',
    iconRetinaUrl: 'assets/gaz_station_icon.png',
    iconSize: new Point(40, 40),
});

const notificationId = 'map-notification';

export const Map = ({distance}) => {
    
    const notifications = useNotifications();

    const [stations, setStations] = useState([]);
    const [position, setPosition] = useState(undefined);

    useEffect(() => {
        if (position && distance) {
            notifications.updateNotification(notificationId, {
                id: notificationId,
                loading: true,
                title: 'Récupération des stations...',
                message: 'Récupérération des stations alentours en cours ! Veuillez patienter...',
                autoClose: false,
                disallowClose: true,
            });

            getStationsAtDistance({
                position,
                distance: distance * 1000,
            }).then(
                (stations) => {
                    setStations(stations);
                    notifications.updateNotification(notificationId, {
                        id: notificationId,
                        title: 'Récupération des stations terminée !',
                        message: 'Récupération des stations alentours terminée !',
                        icon: <CheckIcon />,
                        autoClose: 3000,
                    });
                },
                (error) => {
                    notifications.updateNotification(notificationId, {
                        id: notificationId,
                        color: 'red',
                        icon: <Cross1Icon />,
                        title: 'Échec de la récupération des stations !',
                        message: 'Une erreur est survenue lors de la récupération des stations alentours: ' + error.message,
                        autoClose: false,
                    });  
                }
            );
        } else {
            notifications.updateNotification(notificationId, {
                id: notificationId,
                color: 'red',
                icon: <Cross1Icon />,
                title: 'Échec de la récupération des stations !',
                message: 'Une erreur est survenue lors de la récupération des stations alentours',
                autoClose: false,
            });  
        }
    }, [position, distance]);

    const setMap = (map) => {
        if (map) {
            navigator.geolocation.getCurrentPosition(
                ({coords}) => {
                    setPosition({ latitude: coords.latitude, longitude: coords.longitude });
                    map.setView([coords.latitude, coords.longitude]);
                });
        } else {
            notifications.showNotification({
                icon: <Cross1Icon />,
                autoClose: 5000,
                title: 'Une erreur est survenue !',
                color: 'red',
                message: 'Impossible de charger la carte !',
            });
        }
    }

    return (
        <MapContainer
            center={[43.6194637, 7.0820007]}
            zoom={ 10 }
            scrollWheelZoom={ true }
            whenCreated={ setMap }
            style={{ height: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup>
            {stations.map((el, index) =>
                <Marker key={index} icon={icon} position={[el.position.latitude, el.position.longitude]}>
                    <Popup>
                        <b>{el.adresse}</b><br/>
                        {el.services.map((service, index) => <li key={index}>{service}</li>)}
                    </Popup>
                </Marker>
            )}
            </MarkerClusterGroup>
        </MapContainer>
    );
};