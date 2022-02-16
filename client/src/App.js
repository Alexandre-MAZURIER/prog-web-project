import { AppShell, Navbar, Slider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useState } from 'react';

import { BurgerMenu } from './components/BurgerMenu';
import { Map } from './components/Map';

import './App.css';

export const App = () => {

    const [opened, setOpened] = useState(false);

    const [distance, setDistance] = useState(2.75);
    
    return (
        <NotificationsProvider>
        <AppShell
            padding={0}
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={
                <Navbar
                    className='navbar'
                    padding="md"
                    hiddenBreakpoint="sm"
                    hidden={!opened}
                    width={{ sm: 300, lg: 400 }}
                >
                    <BurgerMenu opened={!opened} setOpened={setOpened}/>
                    <div>
                        <h3>Distance : {distance} km</h3>
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
                            value={distance}
                            onChange={setDistance}    
                        />
                    </div>
                </Navbar>
            }
        >
            <Map distance={distance}/>
        </AppShell>
        </NotificationsProvider>
    );
}