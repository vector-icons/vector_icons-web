import { render } from "preact";
import { ReactNode } from "preact/compat";

export namespace PopupPage {
    export function open(component: ReactNode) {
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.position = "fixed";
        wrapper.style.zIndex = "999";
        wrapper.style.backgroundColor = "rgb(0, 0, 0, 0.5)";
        wrapper.style.opacity = "0";
        wrapper.style.transitionProperty = "opacity";
        wrapper.style.transitionDuration = "0.5s";
        document.body.appendChild(wrapper);

        requestAnimationFrame(() => {
            wrapper.style.opacity = "1";
            wrapper.onclick = event => {
                if (event.target == wrapper) {
                    wrapper.style.opacity = "0";
                    wrapper.ontransitionend = () => wrapper.remove();
                }
            }
        });

        render(<Body children={component} />, wrapper);
    }

    export function Body({children}: {children: ReactNode}) {
        return <>{children}</>;
    }
}