import { defineStyle } from "@chakra-ui/react";

const primary = defineStyle({
  color: "white",
  bg: "theme.primary",
  _hover: {
    bg: "theme.primaryDark",
  },
  _disabled: {
    bg: "theme.primaryDark",
  },
});

const buttonTheme = {
  variants: {
    primary,
  },
  defaultProps: {
    variant: "primary"
  },
};

export default buttonTheme;