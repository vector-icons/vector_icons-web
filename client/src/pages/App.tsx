import Router, { Route } from "preact-router";
import { LandingPage } from "./Landing";
import { PreviewPage } from "./Preview";

export type IconType = {
    path: {normal: string, filled: string}
    content: {normal: string, filled: string}
}

export const Icons: IconType[] = require("../../../assets/icons-dist.json");

export function App() {
    return (
        <Router>
            <Route path="/"        component={LandingPage} />
            <Route path="/preview" component={PreviewPage} />
        </Router>
    )
}