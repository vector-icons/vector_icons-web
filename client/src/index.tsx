import { render } from "preact";
import { App } from "./pages/App";

import "./styles/main";
import "./styles/font";
import "./styles/variables";
import "./styles/templates";
import "./styles/keyframes";
import "./styles/animation";

import "./components/landing_background";

import "web-touch-ripple";

addEventListener("load", () => render(<App />, document.body));
addEventListener("DOMContentLoaded", () => {
    document.body.style.animation = "page-fadein 0.3s";
});

addEventListener("beforeunload", () => {
    document.body.style.animation = "page-fadeout 0.3s";
    document.body.style.animationFillMode = "backward";
});