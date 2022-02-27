import PropTypes from "prop-types";

import { Select, Slider, Switch } from "@mantine/core";

const gas = ["Gazole", "SP95", "E85", "GPLc", "E10", "SP98"];

export const Form = (props) => {
  return (
    <div>
      <h3>Distance : {props.distance} km</h3>
      <Slider
        label={(value) => `${value} km`}
        min={0.5}
        max={5}
        step={0.25}
        marks={[{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]}
        value={props.distance}
        onChange={props.setDistance}
      />
      <h3>Type d&apos;essence :</h3>
      <Select
        placeholder="Type d'essence disponible"
        data={gas}
        value={props.gas}
        onChange={props.setGas}
        clearable
        clearButtonLabel="Supprimer"
      />
      <h3>Clustering :</h3>
      <Switch
        size="lg"
        onLabel="ON"
        offLabel="OFF"
        checked={props.isClustering}
        onChange={(event) => props.setIsClustering(event.currentTarget.checked)}
      />
    </div>
  );
};

Form.propTypes = {
  distance: PropTypes.number,
  setDistance: PropTypes.func,
  gas: PropTypes.string,
  setGas: PropTypes.func,
  isClustering: PropTypes.bool,
  setIsClustering: PropTypes.func,
};
