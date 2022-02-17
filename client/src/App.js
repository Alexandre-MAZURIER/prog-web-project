import {
  AppShell,
  Navbar,
  MantineProvider,
  ColorSchemeProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import {
  useHotkeys,
  useLocalStorageValue,
  useColorScheme,
} from "@mantine/hooks";
import { useState } from "react";

import { Map } from "./components/Map";
import { Form } from "./components/Form";
import { DarkThemeButton } from "./components/DarkThemeButton";

import "./App.css";

export const App = () => {
  const [opened, setOpened] = useState(false);

  const [distance, setDistance] = useState(2.75);
  const [gas, setGas] = useState("");

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorageValue({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
        <NotificationsProvider>
          <AppShell
            padding={0}
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={
              <Navbar
                className="navbar"
                padding="md"
                hiddenBreakpoint="sm"
                hidden={!opened}
                width={{ sm: 300, lg: 400 }}
              >
                {/* <BurgerMenu opened={!opened} setOpened={setOpened} /> */}

                <Navbar.Section grow>
                  <Form
                    distance={distance}
                    setDistance={setDistance}
                    gas={gas}
                    setGas={setGas}
                  />
                </Navbar.Section>

                <Navbar.Section>
                  <DarkThemeButton />
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
};
