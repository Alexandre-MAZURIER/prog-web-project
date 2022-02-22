import { Group, ThemeIcon, Text, useMantineColorScheme } from "@mantine/core";
import { BarChartIcon, ImageIcon, ListBulletIcon } from "@modulz/radix-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useStyles as useMainLinksStyles } from "../styles/MainLinks.styles";
import { useStyles as useCommonStyles } from "../styles/common.styles";
import PropTypes from "prop-types";

export const MainLinks = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const { classes } = useCommonStyles();

  return (
    <>
      <CustomLink to="">
        <Group>
          <ThemeIcon
            variant={isDark ? "filled" : "light"}
            size={30}
            color={isDark ? "yellow" : "blue"}
          >
            <ImageIcon />
          </ThemeIcon>
          <Text className={classes.showLarge}>Map</Text>
        </Group>
      </CustomLink>
      <CustomLink to="list">
        <Group>
          <ThemeIcon
            variant={isDark ? "filled" : "light"}
            size={30}
            color={isDark ? "yellow" : "blue"}
          >
            <ListBulletIcon />
          </ThemeIcon>
          <Text className={classes.showLarge}>List</Text>
        </Group>
      </CustomLink>
      <CustomLink to="form">
        <Group>
          <ThemeIcon
            variant={isDark ? "filled" : "light"}
            size={30}
            color={isDark ? "yellow" : "blue"}
          >
            <BarChartIcon />
          </ThemeIcon>
          <Text className={classes.showLarge}>Chart</Text>
        </Group>
      </CustomLink>
    </>
  );
};

const CustomLink = ({ children, to, ...props }) => {
  const { classes } = useMainLinksStyles();

  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link
      className={
        match ? `${classes.mainLink} ${classes.active}` : classes.mainLink
      }
      to={to}
      {...props}
    >
      {children}
    </Link>
  );
};

CustomLink.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
};
