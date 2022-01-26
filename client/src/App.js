import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon, Point } from 'leaflet';
import { useEffect, useState } from 'react';
import Slider from 'rc-slider';

import './App.css';
import 'rc-slider/assets/index.css';

import { getStationsAtDistance } from './api';

function App() {
    const icon = new Icon({
        iconUrl: 'assets/gaz_station_icon.png',
        iconRetinaUrl: 'assets/gaz_station_icon.png',
        iconSize: new Point(40, 40),
    });

    const [distance, setDistance] = useState(10);
    const [stations, setStations] = useState([]);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (map) {
            onMapLoaded();  
        }
    }, [map]);

    const updateStations = () => {
        console.log(map)
        getStationsAtDistance({
            'position': {
                'latitude': map.getCenter().lat,
                'longitude': map.getCenter().lng
            },
            'distance': distance * 1000 // In Meters
        }).then((resp) => {
            setStations(resp.data);
        })
    };

    const onSliderChange = (value) => {
        setDistance(value);
        updateStations();
    };

    const onMapLoaded = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('Latitude is :', position.coords.latitude);
            console.log('Longitude is :', position.coords.longitude);
            map.setView([position.coords.latitude, position.coords.longitude]);
            updateStations();
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
                        <Slider min={0} max={1000} value={distance} onChange={onSliderChange}/>
                        <p>{stations.length} stations found</p>

                    </div>
                </div>
                <MapContainer style={{ width: '100%', height: '100vh' }} center={[43.6194637, 7.0820007]}
                              zoom={10}
                              scrollWheelZoom={ true }
                              whenCreated={ setMap }
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {stations.map((el, key) => <Marker key={key} icon={icon}
                                                       position={[el.position.latitude, el.position.longitude]}>
                        <Popup>
                            <b>{el.adresse}</b><br/>
                            {el.services.map((service, key) => <li key={key}>{service}</li>)}
                        </Popup>
                    </Marker>)}
                </MapContainer>
            </div>
        </>
    );
}

export default App;
