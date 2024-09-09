import { render } from "preact";
import { ReactNode, useLayoutEffect, useRef } from "preact/compat";
import { Box } from "react-widgets";
import { Overlay, OverlayAlignment, OverlayDirection, OverlayElement } from "web-overlay-layout";

export function Tooltip({message, children}: {
    message: string;
    children: ReactNode;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    
    // This value defines an overlay element added to the current DOM.
    let activeOverlay: OverlayElement = null;
    let delayTimerIds: NodeJS.Timeout;

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;

        wrapper.onmouseleave = () => {
            delayTimerIds && clearTimeout(delayTimerIds);
            activeOverlay?.detach();
        }
        wrapper.onmouseenter = () => {
            delayTimerIds = setTimeout(() => {
                const overlay = document.createElement("div");

                // Renders a JSX components into document to an overlay element attaching.
                render(<TooltipOverlay message={message} />, overlay);

                activeOverlay = Overlay.attach({
                    element: overlay,
                    target: wrapper,
                    parent: document.body,
                    behavior: {
                        direction: OverlayDirection.BOTTOM_CENTER,
                        alignment: OverlayAlignment.ALL,
                        animation: {
                            fadein: "tooltip-fadein 0.2s",
                            fadeout: "tooltip-fadeout 0.2s"
                        },
                        targetGap: 5,
                        viewportPadding: 15
                    }
                });
            }, 200); // delay 0.2s
        }
    });

    return (
        <Box refer={wrapperRef} children={children} />
    )
}

export function TooltipOverlay({message}: {message: string}) {
    return (
        <Box
            className="tooltip"
            backgroundColor="var(--background-overlay)"
            padding="var(--padding-sm)"
            border="2px solid var(--rearground-border)"
            borderRadius="10px"
            fontSize="14px"
            children={message}
        />
    )
}