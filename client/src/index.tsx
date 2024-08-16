import { render } from "preact";
import { App } from "./pages/App";

import "./styles/main";
import "./styles/font";
import "./styles/variables";
import "./styles/templates";

import "./components/landing_background";
import "web-touch-ripple";

render(<App />, document.body);