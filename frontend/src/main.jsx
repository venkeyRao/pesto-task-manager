import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ContextProvider } from './context/ContextProvider';
import router from "./router";

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f0f0'
    },
    text: {
      primary: '#333333'
    }
  },
  typography: {
    fontFamily: 'Arial, sans-serif'
  }
});

const rootElement = document.getElementById("root");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ContextProvider>
  </React.StrictMode>
);

