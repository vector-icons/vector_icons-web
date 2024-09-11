import * as home from "./home/Switch";
import { LandingPage } from "./Landing";
import { Route, Router } from "react-widgets-router";

export type IconType = {
    name: string;
    path: {normal: string, filled: string};
    content: {normal: string, filled: string};
}

export const Icons: IconType[] = require("../../../assets/icons-dist.json");

export function App() {
    return (
        <Router>
            <Route path="/" component={LandingPage} />
            <Route path="/app" component={home.SwitchPage} />
        </Router>
    )
}