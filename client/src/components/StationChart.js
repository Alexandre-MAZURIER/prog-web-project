import { MultiSelect, Container } from "@mantine/core";
import { useState, useEffect } from "react";
import { useNotifications } from "@mantine/notifications";
import {
  CheckIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
} from "@modulz/radix-icons";
import { getStationsForCity } from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const gasTypes = [
  { value: "Gazole", label: "Gazole" },
  { value: "SP95", label: "SP95" },
  { value: "SP98", label: "SP98" },
  { value: "E10", label: "E10" },
  { value: "E85", label: "E85" },
  { value: "GPLc", label: "GPLc" },
];

const gasTypesColor = {
  Gazole: "rgba(146, 43, 33, 0.5)",
  SP95: "rgba(108, 52, 131, 0.5)",
  SP98: "rgba(40, 116, 166, 0.5)",
  E10: "rgba(17, 122, 101, 0.5)",
  E85: "rgba(185, 119, 14, 0.5)",
  GPLc: "rgba(97, 106, 107, 0.5)",
};
const stationList = [
  "Paris",
  "Lyon",
  "Marseille",
  "Aix-en-Provence",
  "Toulouse",
  "Bordeaux",
];

export const StationChart = () => {
  const [selectedFuels, setSelectedFuels] = useState([]);
  const notifications = useNotifications();
  const [stations, setStations] = useState([]);

  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    console.debug(stations);

    const notificationId = notifications.showNotification({
      loading: true,
      title: "Récupération des stations...",
      message:
        "Récupérération des stations alentours en cours ! Veuillez patienter...",
      autoClose: false,
      disallowClose: true,
    });

    const stationsTemp = [];
    stationList.forEach((station) => {
      getStationsForCity(station, signal).then(
        (stations) => {
          const stationsTempCity = [];
          console.debug(selectedFuels);
          stations.forEach((s) => {
            for (let sf of selectedFuels) {
              if (s.prix.find((p) => p.nom === sf)) {
                stationsTempCity.push(s);
                break;
              }
            }
          });
          stationsTemp.push(stationsTempCity);
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
    });
    setStations(stationsTemp);
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
    } else if (selectedFuels.length < 1) {
      setTimeout(() => {
        notifications.updateNotification(notificationId, {
          id: notificationId,
          color: "orange",
          icon: <ExclamationTriangleIcon />,
          title: "Indication",
          message: "Vous devez sélectionner des carburants",
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
          message: "Pas de stations trouvées !",
          autoClose: 3000,
        });
      }, 500);
    }
    return () => {
      controller.abort();
      notifications.clean();
    };
  }, [selectedFuels]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Comparatif du prix des carburants par ville",
      },
    },
  };

  const labels = stationList;
  console.log("stations : ");
  console.log(stations);

  const buildData = (fuel) => {
    const cityIndex = stations.map((a) => {
      const cityName = a.length > 0 ? a[0].ville : "No City";
      return cityName;
    });
    console.log(cityIndex);
    let notFuelFound = 0;
    const chartData = {
      label: fuel,
      data: labels.map((city) => {
        notFuelFound = 0;
        const index = cityIndex.indexOf(city);
        console.log(city, index);
        return index > -1 && stations[index].length > 0
          ? stations[index].reduce(
              (a, b) =>
                a +
                (b.prix.filter((p) => p.nom === fuel).length > 0
                  ? b.prix.filter((p) => p.nom === fuel)[0].valeur
                  : ((notFuelFound += 1), 0)),
              0
            ) /
              (stations[index].length - notFuelFound)
          : 0;
      }),
      backgroundColor: gasTypesColor[fuel],
    };
    console.log("f :", fuel);
    console.log("notF :", notFuelFound);
    return chartData;
  };
  let data = {};
  if (stations.length > 0) {
    const test = selectedFuels.map((s) => buildData(s));
    data = {
      labels,
      datasets: test,
    };
  } else {
    data = {
      labels,
      datasets: [
        {
          label: "Pas de carburants sélectionnées",
          data: labels.map(() => 0),
        },
      ],
    };
  }

  return (
    <Container size="xl">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <MultiSelect
          data={gasTypes}
          label="Sélectionner les carburants"
          placeholder="Carburants à afficher"
          value={selectedFuels}
          onChange={setSelectedFuels}
        />
      </div>
      <Bar options={options} data={data} />
    </Container>
  );
};
