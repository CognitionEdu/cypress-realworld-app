import { createTheme, adaptV4Theme } from "@mui/material";

export const libertyMutualTheme = createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: "#FFD000",
      },
      secondary: {
        main: "#06748C", // Liberty Mutual authentic teal/blue (rgb(6, 116, 140))
      },
      background: {
        default: "#f5f5f5",
      },
    },
    typography: {
      fontSize: 14 * 0.875,
      body1: {
        lineHeight: 1.43,
        letterSpacing: "0.01071em",
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            padding: "6px 0 7px",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            padding: "6px 0 7px",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
    },
  })
);
