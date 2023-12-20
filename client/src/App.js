import { BrowserRouter } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "moment/locale/en-gb";
import AppRouter from "./components/router/AppRouter";

const App = () => {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </LocalizationProvider>
    );
}

export default App;
