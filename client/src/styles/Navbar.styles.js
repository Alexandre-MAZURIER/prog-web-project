import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  navbar: {
    [`@media (max-width: ${theme.breakpoints.md}px)`]: {
      width: "75px",
    },
  },
}));
