import { Dispatch, StateUpdater, useState } from "preact/hooks";
import * as home from "./home/Switch";
import { LandingPage } from "./Landing";
import { Route, Router } from "@web-package/react-widgets-router";
import { createContext } from "preact";
import { SettingsBinding } from "../settings/settings_binding";
import { SignInPage } from "./sign-in/SignIn";
import { SignUpPage } from "./sign-up/SignUp";

export type IconType = {
    name: string;
    path: {normal: string, filled: string};
    content: {normal: string, filled: string};
}

export const Icons: IconType[] = require("../../../assets/icons-dist.json");

/** This context is used to change the state of all components globally. */
export const AppContext = createContext<Dispatch<StateUpdater<string>>>(null);

export function App() {
    const [_, setState] = useState<string>("");

    // Insert className dark theme into body element when a user is dark mode.
    if (SettingsBinding.getValue("theme") == null) {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.body.className = "dark";
        }
    } else {
        document.body.className = SettingsBinding.getValue("theme");
    }

    return (
        <AppContext.Provider value={setState}>
            <Router>
                <Route path="/" component={LandingPage} />
                <Route path="/app" component={home.SwitchPage} />
                <Route path="/sign-in" component={SignInPage} />
                <Route path="/sign-up" component={SignUpPage} />
            </Router>
        </AppContext.Provider>
    )
}