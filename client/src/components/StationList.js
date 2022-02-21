import {Button, Container, Input, MultiSelect} from "@mantine/core";
import DataTable from 'react-data-table-component';
import {getStationsForCity} from "../api";
import {CheckIcon, Cross1Icon, ExclamationTriangleIcon} from "@modulz/radix-icons";
import {useState} from "react";
import {useNotifications} from "@mantine/notifications";

const ExpandedComponent = (data) => {
    return (
        <>
            <h4>Services</h4>
            <ul>
                {
                    data.services ? data.services.map(function(d, idx){
                        return (<li key={idx}>{d}</li>)
                    }) : ""
                }
            </ul>
        </>
    );

};

const gasTypes = [
    { value: 'Gazole', label: 'Gazole' },
    { value: 'SP95', label: 'SP95' },
    { value: 'SP98', label: 'SP98' },
    { value: 'E10', label: 'E10' },
    { value: 'E85', label: 'E85' },
    { value: 'GPLc', label: 'GPLc' },
];

let columns = [
    {
        name: 'Adresse',
        selector: row => row.adresse,
    },
    {
        name: 'Gazole',
        selector: row => row.prix.find(p => p.nom === 'Gazole') ? row.prix.find(p => p.nom === 'Gazole').valeur + " €" : "-",
        sortable: true,
    },
    {
        name: 'SP95',
        selector: row => row.prix.find(p => p.nom === 'SP95') ? row.prix.find(p => p.nom === 'SP95').valeur + " €" : "-",
        sortable: true,
    },
    {
        name: 'SP98',
        selector: row => row.prix.find(p => p.nom === 'SP98') ? row.prix.find(p => p.nom === 'SP98').valeur + " €" : "-",
        sortable: true,
    },
    {
        name: 'E10',
        selector: row => row.prix.find(p => p.nom === 'E10') ? row.prix.find(p => p.nom === 'E10').valeur + " €" : "-",
        sortable: true,
    },
    {
        name: 'E85',
        selector: row => row.prix.find(p => p.nom === 'E85') ? row.prix.find(p => p.nom === 'E85').valeur + " €" : "-",
        sortable: true,
    },
    {
        name: 'GPLc',
        selector: row => row.prix.find(p => p.nom === 'GPLc') ? row.prix.find(p => p.nom === 'GPLc').valeur + " €" : "-",
        sortable: true,
    },
];

/*gasTypes.forEach(type => {
    columns.push({
        name: type,
        selector: row => row.prix.find(p => p.nom === type) ? row.prix.find(p => p.nom === type).valeur : "-",
        sortable: true,
    },)
})*/


export const StationList = () => {
    const notifications = useNotifications();
    const [loading, setLoading] = useState(false);
    const [stations, setStations] = useState([]);
    const [city, setCity] = useState("");
    const [selectedFuels, setSelectedFuels] = useState([]);

    const handleSearchClick = async () => {
        console.log(stations)
        setLoading(true);

        const notificationId = notifications.showNotification({
            loading: true,
            title: "Récupération des stations...",
            message:
                "Récupérération des stations alentours en cours ! Veuillez patienter...",
            autoClose: false,
            disallowClose: true,
        });
        console.log("City:", city)
        getStationsForCity(
            city,
            null
        ).then(
            (stations) => {
                setLoading(false);
                let stationsTemp = [];
                console.log(stations);
                console.log(selectedFuels)
                stations.forEach(s => {
                    for (let sf of selectedFuels) {
                        if(s.prix.find(p => p.nom === sf)) {
                            stationsTemp.push(s);
                            break;
                        }
                    }
                })
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
    };

    return (
        <Container size={"xl"}>
            <h3>Liste des stations</h3>
            <Input
                label="City / Postal Code"
                placeholder="City / Postal Code"
                radius="md"
                size="md"
                onChange={(event) => { setCity(event.target.value); }}
            />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <MultiSelect
                    data={gasTypes}
                    label="Selectionner les carburants"
                    placeholder="Carburants à afficher"
                    value={selectedFuels} onChange={setSelectedFuels}
                />
                <Button style={{alignSelf: 'self-end'}} radius="md" onClick={() => handleSearchClick()} loading={loading}>
                    Search
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={stations}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
            />
        </Container>
    );
};
