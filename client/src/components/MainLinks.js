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
        <CustomButton icon={<ImageIcon />} label="Carte" />
      </CustomLink>
      <CustomLink to="list">
        <CustomButton icon={<ListBulletIcon />} label="List" />
      </CustomLink>
      <CustomLink to="chart">
        <CustomButton icon={<BarChartIcon />} label="Graphique" />
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

const ButtonIcon = ({ icon }) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeIcon
      variant={isDark ? "filled" : "light"}
      size={30}
      color={isDark ? "yellow" : "blue"}
    >
      {icon}
    </ThemeIcon>
  );
};

ButtonIcon.propTypes = {
  icon: PropTypes.node,
};

const ResponsiveText = ({ label }) => {
  const { classes } = useCommonStyles();

  return <Text className={classes.showLarge}>{label}</Text>;
};

ResponsiveText.propTypes = {
  label: PropTypes.string,
};

const CustomButton = ({ icon, label }) => {
  return (
    <Group>
      <ButtonIcon icon={icon} />
      <ResponsiveText label={label} />
    </Group>
  );
};

CustomButton.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
};
