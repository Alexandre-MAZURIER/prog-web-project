/* eslint-disable no-useless-catch */
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000/";

export const getStationsAtDistance = async (locationDto) => {
  try {
    const data = await axios.post(
      `${baseURL}v1/gas/point-de-vente/near`,
      locationDto
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getStationsWithSpecificGas = async (gasName) => {
  try {
    const data = await axios.get(
      `${baseURL}v1/gas/point-de-vente/query=prix.nom=${gasName}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const getStations = async (dto) => {
  try {
    const data = await axios.get(
      `${baseURL}v1/gas/point-de-vente?query=filter={"position":{"$near":{"$geometry":{"type":"Point","coordinates":[${dto.position.longitude},${dto.position.latitude}]},"$maxDistance":${dto.distance}}}}&prix.nom=${dto.gas}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};
