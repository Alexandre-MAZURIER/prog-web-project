import { Icon, Point } from 'leaflet';
import Slider from 'rc-slider';
import { useEffect, useState } from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMapEvents} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import './App.css';
import 'rc-slider/assets/index.css';

import { getStationsAtDistance } from './api';

function App() {


    let onChangeValue = (event) => {
        console.log(event.target.value);
        // setGasType(event.target.value)
        updateStations(gasType);
    };


    const MyComponent = ({pos, ray, gasType}) => {
        const map = useMapEvents({
            dragend: (e) => {
                let d = getDistanceFromLatLonInKm(map.getCenter().lat, map.getCenter().lng, pos[0], pos[1])
                if(d >= ray/2) {
                    console.log("REFRESHING")
                    updateStations(gasType);
                }
            },
            zoomend: () => {
                let d = getDistanceFromLatLonInKm(map.getCenter().lat, map.getCenter().lng, pos[0], pos[1])
                if(d >= ray) {
                    console.log("REFRESHING")
                    updateStations(gasType);
                }
            },
        });
        return null;
    }

    const icon = new Icon({
        iconUrl: 'assets/gaz_station_icon.png',
        iconRetinaUrl: 'assets/gaz_station_icon.png',
        iconSize: new Point(40, 40),
    });

    const [horaire, setHoraire] = useState(false);

    const [distance, setDistance] = useState(10);
    const [stations, setStations] = useState([]);

    const [gasType, setGasType] = useState("All");

    const [lastModifiedPos, setLastModifiedPos] = useState([43.6194637, 7.0820007]);
    //const [position, setPosition] = useState([43.6194637, 7.0820007]);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map) {
            onMapLoaded();
        }
    }, [map]);

    const updateStations = (gt) => {
        console.log(gt)
        if(gt){
            setGasType(gt)
        }
        setLastModifiedPos([map.getCenter().lat, map.getCenter().lng]);
        // console.info(map)
        getStationsAtDistance({
            'position': {
                'latitude': map.getCenter().lat,
                'longitude': map.getCenter().lng
            },
            'distance': distance * 1000 // In Meters
        }).then((resp) => {
            setStations(resp.data.filter((st) => {
                if(gt === "All" || gt === undefined || st.prix.length === 0){
                    return true;
                }
                for(let po of st.prix){
                    if(po.nom === gt){
                        return true;
                    }
                }
            }));
        })
    };

    const onSliderChange = (value) => {
        setDistance(value);
        updateStations(gasType);
    };

    const onMapLoaded = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            // console.info('Latitude is :', position.coords.latitude);
            // console.info('Longitude is :', position.coords.longitude);
            let pos = [position.coords.latitude, position.coords.longitude];
            setLastModifiedPos(pos);
            map.setView(pos);
            updateStations(gasType);
        })
    };

    return (
        <>
            <div className={'App'}>
                <div className={'App-header'}>
                    <center>
                        <h1>Station Comparator</h1>
                    </center>
                    <div style={{marginLeft: '4em', marginRight: '8em'}}>
                        <h3>Distance: {distance} km</h3>
                        <Slider min={0} max={50} value={distance} onChange={onSliderChange}/>
                        <p>{stations.length} stations found</p>

                    </div>
                    <div style={{marginLeft: '4em', marginRight: '8em'}}>
                        <h3>Gas type</h3>
                        <div>
                            <input checked={gasType === "All"} type="radio"  onChange={() => updateStations("All")} name="gas" /> All
                            <input checked={gasType === "Gazole"} type="radio" onChange={() => updateStations("Gazole")} name="gas" /> Gazole
                            <input checked={gasType === "SP95"} type="radio" onChange={() => updateStations("SP95")} name="gas" /> SP95
                            <input checked={gasType === "E85"} type="radio" onChange={() => updateStations("E85")} name="gas" /> E85
                            <input checked={gasType === "GPLc"} type="radio" onChange={() => updateStations("GPLc")} name="gas" /> GPLc
                            <input checked={gasType === "E10"} type="radio" onChange={() => updateStations("E10")} name="gas" /> E10
                            <input checked={gasType === "SP98"} type="radio" onChange={() => updateStations("SP98")} name="gas" /> SP98
                        </div>

                    </div>
                    <button onClick={() => setHoraire(!horaire)}>{ horaire ? 'ON' : 'OFF' }</button>
                </div>
                <MapContainer style={{ width: '100%', height: '100vh' }}
                              zoom={ 16 }
                              scrollWheelZoom={ true }
                              whenCreated={ setMap }
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup>
                    {stations.map((el, key) =>
                        <Marker key={key} icon={icon} position={[el.position.latitude, el.position.longitude]}>
                            <Popup>
                                <b>{el.adresse}</b><br/>
                                {el.prix.map((po, key) =>
                                    (<div key={key}><h6>{po.nom}: {po.valeur}</h6></div>)
                                )}
                                {el.services.map((service, key) => <li key={key}>{service}</li>)}
                            </Popup>
                        </Marker>)
                    }
                    </MarkerClusterGroup>
                    <MyComponent pos={lastModifiedPos} ray={distance} gasType={gasType} />
                </MapContainer>
            </div>
        </>
    );

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1);
        var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }
}

export default App;
