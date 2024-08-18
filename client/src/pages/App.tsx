
import { Route, Switch } from "wouter";
import { LandingPage } from "./Landing";
import { SearchPage } from "./Search";

export type IconType = {
    name: string;
    path: {normal: string, filled: string};
    content: {normal: string, filled: string};
}

export const Icons: IconType[] = require("../../../assets/icons-dist.json");

export function App() {
    return (
        <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/search" component={SearchPage} />
        </Switch>
    )
}