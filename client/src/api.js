import axios from 'axios';

const baseURL = "http://"+process.env.REACT_APP_API_URL+"/";


export const getStationsAtDistance = (locationDto) => {
    console.log(locationDto)
    return axios.post(baseURL+"v1/gas/point-de-vente/location", locationDto)
        .then((data) => data)
        .catch((error) => console.log(error))
}
