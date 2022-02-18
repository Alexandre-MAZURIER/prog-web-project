import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  showLarge: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "none",
    },
  },
  showSmall: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      display: "flex",
    },

    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      display: "none",
    },
  },
}));
