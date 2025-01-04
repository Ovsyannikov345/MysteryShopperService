import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { NotificationsProvider } from "@toolpad/core/useNotifications";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb";
import AppRouter from "./router/AppRouter";

const App = () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: "#e3bf00",
                dark: "#c7a700e6",
            },
            secondary: {
                main: "#000000",
            },
            text: {
                main: "#000000",
            },
        },
    });

    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
            <ThemeProvider theme={theme}>
                <NotificationsProvider>
                    <BrowserRouter>
                        <AppRouter />
                    </BrowserRouter>
                </NotificationsProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
};

export default App;
