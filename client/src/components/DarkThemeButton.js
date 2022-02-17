import {
  ThemeIcon,
  Button,
  useMantineColorScheme,
  Center,
} from "@mantine/core";
import { SunIcon, MoonIcon } from "@modulz/radix-icons";

export const DarkThemeButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Center>
      <Button
        radius="xl"
        color="dark"
        variant={dark ? "white" : "filled"}
        rightIcon={
          <ThemeIcon
            variant="filled"
            color={dark ? "yellow" : "blue"}
            radius="lg"
            title="Changer le thème"
          >
            {dark ? (
              <SunIcon style={{ width: 18, height: 18 }} />
            ) : (
              <MoonIcon style={{ width: 18, height: 18 }} />
            )}
          </ThemeIcon>
        }
        onClick={() => toggleColorScheme()}
      >
        {dark ? "Thème clair" : "Thème sombre"}
      </Button>
    </Center>
  );
};
