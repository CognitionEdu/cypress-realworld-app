import React from "react";
import { createRoot } from "react-dom/client";
import { Router } from "react-router-dom";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";

import AppCognito from "./containers/AppCognito";
import { history } from "./utils/historyUtils";
import { libertyMutualTheme } from "./theme/libertyMutualTheme";

const root = createRoot(document.getElementById("root")!);

if (process.env.VITE_AWS_COGNITO) {
  /* istanbul ignore next */
  root.render(
    <Router history={history}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={libertyMutualTheme}>
          <AppCognito />
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>
  );
} else {
  console.error("Cognito is not configured.");
}
