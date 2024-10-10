import { Box, Column, Row } from "@web-package/react-widgets";
import { render } from "preact";
import { ReactNode, useLayoutEffect, useRef } from "preact/compat";
import { TouchRipple } from "web-touch-ripple/jsx";
import { RenderIcon } from "../templates/RenderIcon";

export namespace PopupPage {
    export function open(component: ReactNode) {
        const wrapper = document.createElement("div");
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.position = "fixed";
        wrapper.style.zIndex = "999";
        wrapper.style.backgroundColor = "rgb(0, 0, 0, 0.5)";
        wrapper.style.backdropFilter = "blur(2px)"
        wrapper.style.opacity = "0";
        wrapper.style.transitionProperty = "opacity, backdrop-filter";
        wrapper.style.transitionDuration = "0.3s";
        document.body.appendChild(wrapper);

        requestAnimationFrame(() => {
            wrapper.style.opacity = "1";
            wrapper.onclick = event => {
                if (event.target == wrapper) {
                    wrapper.style.opacity = "0";
                    wrapper.style.pointerEvents = "none";
                    wrapper.addEventListener('transitionend', (event) => {
                        // Ignores other elements except for the wrapper.
                        if (event.target === wrapper) {
                            wrapper.remove();
                        }
                    });
                }
            }
        });

        render(<Body children={component} />, wrapper);
    }

    export function Body({children}: {children: ReactNode}) {
        const wrapperRef = useRef<HTMLDivElement>(null);

        const onClose = () => {
            const inner = wrapperRef.current;
            const outer = inner.parentElement;
            outer.click();
        }

        return (
            <Box
                ref={wrapperRef}
                height="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding="var(--padding-df)"
                pointerEvents="none"
            >
                <Column
                    borderRadius="20px"
                    backgroundColor="var(--popup-background)"
                    pointerEvents="auto"
                >
                    <Row align="centerRight">
                        <TouchRipple onTap={onClose}>
                            <Box padding="var(--padding-df)" borderRadius="1e10px">
                                <RenderIcon.Name name="close" size="18px" />
                            </Box>
                        </TouchRipple>
                    </Row>
                    <Box padding="var(--padding-df)" paddingTop="0px" children={children} />
                </Column>
            </Box>
        )
    }
}