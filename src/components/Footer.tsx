import React from "react";
import { Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Container maxWidth="sm" style={{ marginTop: 50 }}>
      <Typography variant="body2" color="textSecondary" align="center">
        Powered by Liberty Mutual Financial Services
      </Typography>
    </Container>
  );
}
