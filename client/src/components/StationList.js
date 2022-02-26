import {
    Button, Checkbox,
    Container,
    MultiSelect,
    Space,
    TextInput, useMantineColorScheme,
} from "@mantine/core";
import DataTable, {createTheme} from "react-data-table-component";
import { getStationsForCity } from "../api";
import {
  Cross1Icon,
  ExclamationTriangleIcon,
} from "@modulz/radix-icons";
import { useState } from "react";
import { useNotifications } from "@mantine/notifications";
import {Ri24HoursLine, RiGasStationFill, RiRestaurantFill} from "react-icons/ri";
import {ImManWoman} from "react-icons/im";
import {FiShoppingCart} from "react-icons/fi";

createTheme(
    'solarized',
    {
      text: {
        primary: '#dedede',
        secondary: '#dedede',
      },
      background: {
        default: '#2C2E33',
      },
      context: {
        background: '#cb4b16',
        text: '#FFFFFF',
      },
      divider: {
        default: '#073642',
      },
      button: {
        default: '#dedede',
        hover: 'rgba(0,0,0,.08)',
        focus: 'rgba(255,255,255,.12)',
        disabled: 'rgba(255, 255, 255, .34)',
      },
      sortFocus: {
        default: '#2aa198',
      },
    },
    'dark',
);

const ExpandedComponent = (data) => {
  return (
    <div style={{marginLeft: '2em'}}>
      <h4>Services</h4>
      <ul>
        {(data.data.services && data.data.services.length) > 0 ? data.data.services.map(function (d, idx) {
              return <li key={idx}>{d}</li>;
            }) : ""}
      </ul>
    </div>
  );
};

const gasTypes = [
  { value: "Gazole", label: "Gazole" },
  { value: "SP95", label: "SP95" },
  { value: "SP98", label: "SP98" },
  { value: "E10", label: "E10" },
  { value: "E85", label: "E85" },
  { value: "GPLc", label: "GPLc" },
];

const columns = [
  {
    name: "Adresse",
    selector: (row) => row.adresse,
      width: "25%"
  },
  {
    name: "Gazole",
    selector: (row) =>
      row.prix.find((p) => p.nom === "Gazole")
        ? row.prix.find((p) => p.nom === "Gazole").valeur + " €"
        : "-",
    sortable: true,
      display: false
  },
  {
    name: "SP95",
    selector: (row) =>
      row.prix.find((p) => p.nom === "SP95")
        ? row.prix.find((p) => p.nom === "SP95").valeur + " €"
        : "-",
    sortable: true,
  },
  {
    name: "SP98",
    selector: (row) =>
      row.prix.find((p) => p.nom === "SP98")
        ? row.prix.find((p) => p.nom === "SP98").valeur + " €"
        : "-",
    sortable: true,
  },
  {
    name: "E10",
    selector: (row) =>
      row.prix.find((p) => p.nom === "E10")
        ? row.prix.find((p) => p.nom === "E10").valeur + " €"
        : "-",
    sortable: true,
  },
  {
    name: "E85",
    selector: (row) =>
      row.prix.find((p) => p.nom === "E85")
        ? row.prix.find((p) => p.nom === "E85").valeur + " €"
        : "-",
    sortable: true,
  },
  {
    name: "GPLc",
    selector: (row) =>
      row.prix.find((p) => p.nom === "GPLc")
        ? row.prix.find((p) => p.nom === "GPLc").valeur + " €"
        : "-",
    sortable: true,
  },
  {
    name: "Services",
    selector: (row) => {
        // To show icons max 1 time (eg 'boutique alimentaire & boutique non alimentaire'
        let catShown = {restaurant: false, toilet: false, shop: false, self: false}
        return <>
            {
                    row.services.map((s) => {
                        if(s.toLowerCase().includes("restauration") && !catShown.restaurant) {
                            catShown.restaurant = true;
                            return <RiRestaurantFill style={{marginLeft: ".5em"}} title={s.toString()}/>
                        }
                        if(s.toLowerCase().includes("toilette") && !catShown.toilet) {
                            catShown.toilet = true;
                            return <ImManWoman style={{marginLeft: ".5em"}} title={s.toString()} />
                        }
                        if(s.toLowerCase().includes("boutique") && !catShown.shop) {
                            catShown.shop = true;
                            return <FiShoppingCart style={{marginLeft: ".5em"}} title={s.toString()} />
                        }
                        if(s.toLowerCase().includes("24/24") && !catShown.shop) {
                            catShown.shop = true;
                            return <Ri24HoursLine style={{marginLeft: ".5em"}} title={s.toString()} />
                        }
                    })

                }
        </>

    }


  },
];

export const StationList = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const notifications = useNotifications();
  const [loading, setLoading] = useState(false);
  const [allStations, setAllStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [filterStatusCB, setFilterStatusCB] = useState(false);
  const [filterStatusGonflage, setFilterStatusGonflage] = useState(false);
  const [filterStatusLavage, setFilterStatusLavage] = useState(false);
  const [city, setCity] = useState("");
  const [selectedFuels, setSelectedFuels] = useState([]);

  const handleSearchClick = async () => {
    setLoading(true);

    getStationsForCity(city, null).then(
      (stations) => {
        setLoading(false);
        const stationsTemp = [];
        stations.forEach((s) => {
          for (let sf of selectedFuels) {
            if (s.prix.find((p) => p.nom === sf)) {
              stationsTemp.push(s);
              break;
            }
          }
        });
        setAllStations([...stationsTemp]);
        setFilteredStations([...stationsTemp]);
        if(stations?.length === 0) {
          setTimeout(() => {
          notifications.showNotification({
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
            notifications.showNotification({
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
  };

    function filterStations(filters) {
        console.log(filters)
        let stations = [...allStations];
        if(filters.cb) {
            stations = stations.filter(s => {
                let res = false
                s.services.forEach(service => {
                    if(service.toLowerCase().includes("24/24")) {
                        res = true;
                    }
                })
                return res;
         })
        }
        if(filters.gonflage) {
            stations = stations.filter(s => {
                let res = false
                s.services.forEach(service => {
                    if(service.toLowerCase().includes("gonflage")) {
                        res = true;
                    }
                })
                return res;
            })
        }
        if(filters.lavage) {
            stations = stations.filter(s => {
                let res = false
                s.services.forEach(service => {
                    if(service.toLowerCase().includes("lavage")) {
                        res = true;
                    }
                })
                return res;
            })
        }
        setFilteredStations(stations);
    }

    return (
    <Container size="xl">
      <h3>Liste des stations</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
      <TextInput
          style={{width: '50%'}}
        label="Ville"
        placeholder="Ville souhaitée pour les stations à afficher"
        radius="md"
        size="md"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
            <MultiSelect
                style={{width: '25%'}}
                icon={<RiGasStationFill/>}
                data={gasTypes}
                size="md"
                label="Stations proposant :"
                placeholder="Station proposant ces carburants à afficher"
                value={selectedFuels}
                onChange={setSelectedFuels}
            />
        <Button
            style={{ alignSelf: "self-end" }}
            radius="md"
            onClick={() => handleSearchClick()}
            loading={loading}
        >
            Chercher
        </Button>
        </div>
        <Space h="xs" />
        {
            allStations.length > 0 ?
                <div style={{border: "1px #E3DFDE solid", borderRadius: '5px', padding: '15px'}}>
                    <h3 style={{margin: '0'}}>Filtres</h3>
                    <Space h="sm" />
                    <div style={{display: "flex"}}>

                        <Checkbox className={'filter-checkboxes'}
                                  label="Automate CB 24/24" onChange={(event) => {setFilterStatusCB(event.currentTarget.checked); filterStations({cb: event.currentTarget.checked, gonflage: filterStatusGonflage, lavage: filterStatusLavage})}}
                        />
                        <Checkbox className={'filter-checkboxes'}
                                  label="Station de gonflage" onChange={(event) => {setFilterStatusGonflage(event.currentTarget.checked); filterStations({cb: filterStatusCB, gonflage: event.currentTarget.checked, lavage: filterStatusLavage})}}
                        />
                        <Checkbox className={'filter-checkboxes'}
                                  label="Station de lavage" onChange={(event) => {setFilterStatusLavage(event.currentTarget.checked); filterStations({cb: filterStatusCB, gonflage: filterStatusGonflage, lavage: event.currentTarget.checked})}}
                        />
                    </div>

                </div>: ''
        }



      <Space h="xs" />

      <DataTable
          theme={isDark ? "solarized" : ""}
        columns={columns}
          style={{height: "50px"}}
        data={filteredStations}
          pagination
        noDataComponent={
          <div style={{ padding: 24 }}>Pas de stations trouvées</div>
        }
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandableCloseAllOnExpand
      />
    </Container>
  );
};
