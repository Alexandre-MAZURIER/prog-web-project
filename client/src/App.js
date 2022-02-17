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

import "./App.scss";
import { useStyles } from "./styles/Navbar.style";

export const App = () => {
  const { classes } = useStyles();

  const [distance, setDistance] = useState(2.75);
  const [gas, setGas] = useState("");

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorageValue({
    key: "programmable-web-client-theme",
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
            navbar={
              <Navbar
                className={classes.navbar}
                padding="md"
                hiddenBreakpoint="sm"
                width={{ lg: 300 }}
              >
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
