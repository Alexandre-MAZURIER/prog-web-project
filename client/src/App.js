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
import { Routes, Route } from "react-router-dom";

import { Map } from "./components/Map/Map";
import { DarkThemeButton } from "./components/DarkThemeButton";
import { StationChart } from "./components/StationChart";

import "./App.scss";
import { useStyles } from "./styles/Navbar.styles";
import { MainLinks } from "./components/MainLinks";
import { StationList } from "./components/StationList";

export const App = () => {
  const { classes } = useStyles();

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
                width={{ md: 200 }}
              >
                <Navbar.Section grow>
                  <MainLinks />
                </Navbar.Section>

                <Navbar.Section>
                  <DarkThemeButton />
                </Navbar.Section>
              </Navbar>
            }
          >
            <Routes>
              <Route index path="/" element={<Map />} />
              <Route path="list" element={<StationList />} />
              <Route path="chart" element={<StationChart />} />
            </Routes>
          </AppShell>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
