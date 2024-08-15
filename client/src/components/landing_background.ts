
export class LandingBackgroundElement extends HTMLElement {
    connectedCallback() {
        console.log("hello world");
    }
}

customElements.define("landing-background", LandingBackgroundElement)