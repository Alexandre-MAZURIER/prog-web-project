import { Select, Slider } from '@mantine/core';

const gas = [ 'Gazole', 'SP95', 'E85', 'GPLc', 'E10',  'SP98' ];

export const Form = (props) => {
    return (
        <div>
            <h3>Distance : {props.distance} km</h3>
            <Slider
                label={(value) => `${value} km`}
                min={0.5}
                max={5}
                step={0.25}
                marks={[
                    { value: 1 },
                    { value: 2 },
                    { value: 3 },
                    { value: 4 },
                ]}
                value={props.distance}
                onChange={props.setDistance}    
            />
            <h3>Type d'essence :</h3>
            <Select
                placeholder="Type d'essence disponible"
                data={gas}
                value={props.gas}
                onChange={props.setGas}
                clearable
                clearButtonLabel="Supprimer"
            />
        </div>
    );
};