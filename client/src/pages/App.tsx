import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { LandingPage } from "./Landing";

export type IconType = {
    content: {normal: string, filled: string}
}

export const Icons: IconType[] = require("../../../assets/icons-dist.json");

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" Component={LandingPage} />
            </Routes>
        </BrowserRouter>
    )
}