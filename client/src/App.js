import { AppShell, Navbar, MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useHotkeys, useLocalStorageValue } from '@mantine/hooks';
import { useState } from 'react';

import { BurgerMenu } from './components/BurgerMenu';
import { Map } from './components/Map';

import './App.css';
import { Form } from './components/Form';
import { DarkThemeIcon } from './components/DarkThemeIcon';

export const App = () => {

    const [opened, setOpened] = useState(false);

    const [distance, setDistance] = useState(2.75);
    const [gas, setGas] = useState('');

    const [colorScheme, setColorScheme] = useLocalStorageValue({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
      });
    const toggleColorScheme = (value) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }}>
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
                                {/* <BurgerMenu opened={!opened} setOpened={setOpened} /> */}

                                <Navbar.Section grow>
                                    <Form distance={distance} setDistance={setDistance} gas={gas} setGas={setGas} />
                                </Navbar.Section>

                                <Navbar.Section>
                                    <DarkThemeIcon/>
                                </Navbar.Section>
                                
                            </Navbar>
                        }
                    >
                        <Map distance={distance} gas={gas} />
                    </AppShell>
                </NotificationsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}