import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb";
import AppRouter from "./router/AppRouter";

const App = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#DDC12C",
            },
            text: {
                main: "#000000",
            }
        },
        typography: {
            h1: {
                fontSize: "36px",
            },
            h2: {
                fontSize: "24px",
            },
            h3: {
                fontSize: "16px",
            },
        },
    });

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </ThemeProvider>
        </LocalizationProvider>
    );
};

export default App;
