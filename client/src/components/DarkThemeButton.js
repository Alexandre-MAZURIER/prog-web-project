import {
  ActionIcon,
  ThemeIcon,
  Button,
  useMantineColorScheme,
  Center,
} from "@mantine/core";
import { SunIcon, MoonIcon } from "@modulz/radix-icons";
import { useStyles } from "../styles/common.styles";

export const DarkThemeButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { classes } = useStyles();

  return (
    <Center>
      <Button
        className={classes.showLarge}
        radius="xl"
        color="dark"
        variant={dark ? "white" : "filled"}
        rightIcon={
          <ThemeIcon
            variant="filled"
            color={dark ? "yellow" : "blue"}
            radius="lg"
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
      <ActionIcon
        className={classes.showSmall}
        variant="filled"
        color={dark ? "yellow" : "blue"}
        radius="lg"
        onClick={() => toggleColorScheme()}
      >
        {dark ? (
          <SunIcon style={{ width: 18, height: 18 }} />
        ) : (
          <MoonIcon style={{ width: 18, height: 18 }} />
        )}
      </ActionIcon>
    </Center>
  );
};
