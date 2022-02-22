const baseURL = process.env.REACT_APP_API_URL;

export const getStationsAtDistance = async (locationDto, signal) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    url: `${baseURL}v1/gas/point-de-vente/near`,
    body: JSON.stringify(locationDto, signal),
  };
  return (
    await fetch(`${baseURL}v1/gas/point-de-vente/near`, requestOptions)
  ).json();
};

export const getStations = async (dto, signal) => {
  return (
    await fetch(
      `${baseURL}v1/gas/point-de-vente?query=filter={"position":{"$near":{"$geometry":{"type":"Point","coordinates":[${dto.position.longitude},${dto.position.latitude}]},"$maxDistance":${dto.distance}}}}&prix.nom=${dto.gas}`,
      { signal }
    )
  ).json();
};

export const getStationsForCity = async (city, signal) => {
  return (
    await fetch(`${baseURL}v1/gas/point-de-vente?query=ville%3D${city}`, {
      signal,
    })
  ).json();
};
