import {
  CheckIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  ReaderIcon,
} from "@modulz/radix-icons";
import { useNotifications } from "@mantine/notifications";
import { Icon, Point } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getStations } from "../../api";
import { getStationGazolePrice } from "../../utils/map.util";
import { MapListener } from "../MapListener";
import {
  ActionIcon,
  Drawer,
  Group,
  List,
  Space,
  useMantineColorScheme,
} from "@mantine/core";
import "./map.scss";
import { Form } from "./Form";
import { ConditionalWrapper } from "../ConditionalWrapper";

const icon = new Icon({
  iconUrl: "assets/gaz_station_icon.png",
  iconRetinaUrl: "assets/gaz_station_icon.png",
  iconSize: new Point(40, 40),
});

const iconCheapest = new Icon({
  iconUrl: "assets/gaz_station_icon_cheap.png",
  iconRetinaUrl: "assets/gaz_station_icon_cheap.png",
  iconSize: new Point(40, 40),
});

export const Map = () => {
  const notifications = useNotifications();

  const [distance, setDistance] = useState(2.75);
  const [gas, setGas] = useState("");

  const [isClustering, setIsClustering] = useState(true);

  const [opened, setOpened] = useState(false);

  const [stations, setStations] = useState([]);
  const [position, setPosition] = useState({
    latitude: 43.6194637,
    longitude: 7.0820007,
  });
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
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

  const getCheapestStation = () => {
    let minGasPrice = 99;
    if (gas !== "") {
      stations.forEach((s) => {
        const prixGas = s.prix.find((p) => p.nom === gas);
        if (prixGas) {
          if (minGasPrice > prixGas.valeur) {
            minGasPrice = prixGas.valeur;
          }
        }
      });
    }
    return minGasPrice;
  };

  return (
    <>
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
        <ConditionalWrapper
          condition={isClustering}
          wrapper={(children) => (
            <MarkerClusterGroup>{children}</MarkerClusterGroup>
          )}
        >
          {stations.map((station, index) => (
            <Marker
              key={index}
              icon={
                getCheapestStation() === getStationGazolePrice(station, gas)
                  ? iconCheapest
                  : icon
              }
              position={[station.position.latitude, station.position.longitude]}
            >
              <Popup>
                <div className={`leaflet-popup-content-${colorScheme}`}>
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
                </div>
              </Popup>
            </Marker>
          ))}
        </ConditionalWrapper>
        <MapListener
          position={position}
          setPosition={setPosition}
          radius={distance}
        />
      </MapContainer>
      <Drawer
        position="right"
        opened={opened}
        onClose={() => setOpened(false)}
        size="30%"
        padding="sm"
        noOverlay
        noFocusTrap
      >
        <Form
          distance={distance}
          setDistance={setDistance}
          gas={gas}
          setGas={setGas}
          isClustering={isClustering}
          setIsClustering={setIsClustering}
        />
      </Drawer>

      <Group
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 2,
          display: opened ? "none" : "flex",
        }}
      >
        <ActionIcon
          onClick={() => setOpened(true)}
          variant="filled"
          radius="xl"
          size="xl"
          color={isDark ? "yellow" : "blue"}
        >
          <ReaderIcon />
        </ActionIcon>
      </Group>
    </>
  );
};
