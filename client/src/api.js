import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/';

export const getStationsAtDistance = async (locationDto) => {
    try {
        const data = await axios.post(`${baseURL}v1/gas/point-de-vente/near`, locationDto);
        return data.data;
    } catch (error) {
        throw error;
    }
}
