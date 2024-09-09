import { render } from "preact";
import { App } from "./pages/App";
import { SettingsBinding } from "./settings/settings_binding";

import "./styles/main";
import "./styles/font";
import "./styles/variables";
import "./styles/templates";
import "./styles/keyframes";

import "./components/landing_background";

import "web-touch-ripple";

// Insert className dark theme into body element when a user is dark mode.
if (SettingsBinding.getValue("theme") == null) {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.body.className = "dark";
    }
} else {
    document.body.className = SettingsBinding.getValue("theme");
}

addEventListener("load", () => {render(<App />, document.body)});
addEventListener("DOMContentLoaded", () => {
    document.body.style.animation = "page-fadein 0.3s";
});

addEventListener("beforeunload", () => {
    document.body.style.animation = "page-fadeout 0.3s";
});