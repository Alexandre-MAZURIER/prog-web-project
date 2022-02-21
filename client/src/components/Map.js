import {
  CheckIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
} from "@modulz/radix-icons";
import { useNotifications } from "@mantine/notifications";
import { Icon, Point } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getStations } from "../api";
import { MapListener } from "./MapListener";
import { List, Space } from "@mantine/core";
import PropTypes from "prop-types";

const icon = new Icon({
  iconUrl: "assets/gaz_station_icon.png",
  iconRetinaUrl: "assets/gaz_station_icon.png",
  iconSize: new Point(40, 40),
});

export const Map = ({ distance, gas }) => {
  const notifications = useNotifications();

  const [stations, setStations] = useState([]);
  const [position, setPosition] = useState({
    latitude: 43.6194637,
    longitude: 7.0820007,
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const notificationId = notifications.showNotification({
      loading: true,
      title: "Récupération des stations...",
      message:
        "Récupérération des stations alentours en cours ! Veuillez patienter...",
      autoClose: false,
      disallowClose: true,
    });

    if (distance) {
      getStations(
        {
          position,
          distance: distance * 1000,
          gas,
        },
        signal
      ).then(
        (stations) => {
          setStations(stations);
          if (stations?.length > 0) {
            setTimeout(() => {
              notifications.updateNotification(notificationId, {
                id: notificationId,
                title: "Récupération des stations terminée !",
                message: "Récupération des stations alentours terminée !",
                icon: <CheckIcon />,
                autoClose: 3000,
              });
            }, 500);
          } else {
            setTimeout(() => {
              notifications.updateNotification(notificationId, {
                id: notificationId,
                color: "orange",
                icon: <ExclamationTriangleIcon />,
                title: "Attention !",
                message: "Pas de stations trouvées dans cette zone !",
                autoClose: 3000,
              });
            }, 500);
          }
        },
        (error) => {
          setTimeout(() => {
            notifications.updateNotification(notificationId, {
              id: notificationId,
              color: "red",
              icon: <Cross1Icon />,
              title: "Échec de la récupération des stations !",
              message:
                "Une erreur est survenue lors de la récupération des stations alentours: " +
                error.message,
              autoClose: false,
            });
          }, 500);
        }
      );
    }

    return () => {
      controller.abort();
      notifications.clean();
    };
  }, [position, distance, gas]);

  const setMap = (map) => {
    if (map) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setPosition({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          map.setView([coords.latitude, coords.longitude]);
        },
        (error) => {
          notifications.showNotification({
            color: "red",
            icon: <Cross1Icon />,
            title: "Une erreur est survenue !",
            message:
              "Impossible de récupérer votre position actuelle: " +
              error.message,
            autoClose: 5000,
          });
        }
      );
    } else {
      notifications.showNotification({
        icon: <Cross1Icon />,
        color: "red",
        autoClose: 5000,
        title: "Une erreur est survenue !",
        message: "Impossible de charger la carte !",
      });
    }
  };

  return (
    <MapContainer
      center={[position.latitude, position.longitude]}
      zoom={15}
      scrollWheelZoom={true}
      whenCreated={setMap}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {stations.map((station, index) => (
          <Marker
            key={index}
            icon={icon}
            position={[station.position.latitude, station.position.longitude]}
          >
            <Popup>
              <b>{station.adresse}</b>
              {station.prix ? (
                <>
                  <Space h="xs" />
                  <List id="gasPrice" size="sm">
                    {station.prix.map((gasObj, index) => (
                      <List.Item key={index}>
                        {gasObj.nom}: {gasObj.valeur}€
                      </List.Item>
                    ))}
                  </List>
                </>
              ) : (
                <></>
              )}
              {station.services ? (
                <>
                  <Space h="xs" />
                  <List id="services" size="sm">
                    {station.services.map((service, index) => (
                      <List.Item key={index}>{service}</List.Item>
                    ))}
                  </List>
                </>
              ) : (
                <></>
              )}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <MapListener
        position={position}
        setPosition={setPosition}
        radius={distance}
      />
    </MapContainer>
  );
};

Map.propTypes = {
  distance: PropTypes.number,
  gas: PropTypes.string,
};
