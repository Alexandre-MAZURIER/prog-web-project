import { Group, ThemeIcon, Text, useMantineColorScheme } from "@mantine/core";
import { BarChartIcon, ImageIcon, ListBulletIcon } from "@modulz/radix-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useStyles as useMainLinksStyles } from "../styles/MainLinks.styles";
import { useStyles as useCommonStyles } from "../styles/common.styles";
import PropTypes from "prop-types";

export const MainLinks = () => {
  return (
    <>
      <CustomLink to="">
        <Group>
          <ButtonIcon>
            <ImageIcon />
          </ButtonIcon>
          <ResponsiveText>Map</ResponsiveText>
        </Group>
      </CustomLink>
      <CustomLink to="list">
        <Group>
          <ButtonIcon>
            <ListBulletIcon />
          </ButtonIcon>
          <ResponsiveText>Liste</ResponsiveText>
        </Group>
      </CustomLink>
      <CustomLink to="chart">
        <Group>
          <ButtonIcon>
            <BarChartIcon />
          </ButtonIcon>
          <ResponsiveText>Graphiques</ResponsiveText>
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

const ButtonIcon = ({ children }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeIcon
      variant={isDark ? "filled" : "light"}
      size={30}
      color={isDark ? "yellow" : "blue"}
    >
      {children}
    </ThemeIcon>
  );
};

ButtonIcon.propTypes = {
  children: PropTypes.node,
};

const ResponsiveText = ({ children }) => {
  const { classes } = useCommonStyles();

  return <Text className={classes.showLarge}>{children}</Text>;
};

ResponsiveText.propTypes = {
  children: PropTypes.string,
};
