import PropTypes from "prop-types";

import { Burger, MediaQuery } from "@mantine/core";

export const BurgerMenu = (props) => {
  return (
    <MediaQuery largerThan="sm" styles={{ display: "none" }}>
      <Burger
        opened={!props.opened}
        onClick={() => props.setOpened((o) => !o)}
        size="sm"
      />
    </MediaQuery>
  );
};

BurgerMenu.propTypes = {
  opened: PropTypes.bool,
  setOpened: PropTypes.func,
};
