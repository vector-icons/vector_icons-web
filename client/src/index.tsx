import { render } from "preact";
import { App } from "./pages/App";

import "./styles/main";
import "./styles/font";
import "./styles/variables";
import "./styles/templates";

import "./components/landing_background";
import "web-touch-ripple";

// Insert className dark theme into body element when a user is dark mode.
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.className = "dark";
}

addEventListener("load", () => render(<App />, document.body));