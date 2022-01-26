import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/';

export const getStationsAtDistance = async (locationDto) => {
    console.log(locationDto);
    try {
        const data = await axios.post(baseURL + "v1/gas/point-de-vente/location", locationDto);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
