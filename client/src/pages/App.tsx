import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { LandingPage } from "./Landing";

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" Component={LandingPage} />
            </Routes>
        </BrowserRouter>
    )
}