import { AppShell, Navbar } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useState } from 'react';

import { BurgerMenu } from './components/BurgerMenu';
import { Map } from './components/Map';

import './App.css';
import { Form } from './components/Form';

export const App = () => {

    const [opened, setOpened] = useState(false);

    const [distance, setDistance] = useState(2.75);
    const [gas, setGas] = useState('');
    
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
                    <Form distance={distance} setDistance={setDistance} gas={gas} setGas={setGas}/>
                </Navbar>
            }
        >
            <Map distance={distance} gas={gas}/>
        </AppShell>
        </NotificationsProvider>
    );
}