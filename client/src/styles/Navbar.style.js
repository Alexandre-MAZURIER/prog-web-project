import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  navbar: {
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      width: "20%",
      // left: "-280px",

      "&:hover": {
        width: "200px",
      },
    },

    section: {},
  },
}));
