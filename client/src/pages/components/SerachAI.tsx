import { Box, Row } from "@web-package/react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { useLayoutEffect, useRef } from "preact/hooks";
import { Tooltip } from "../../templates/Tooltip";
import { OverlayDirection } from "web-overlay-layout";
import { TouchRipple } from "web-touch-ripple/jsx";

export function SearchAI() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const icon = wrapper.getElementsByTagName("svg")[0];

        wrapper.onmouseenter = () => {
            icon.style.animation = null;
            icon.getBoundingClientRect(); // reflow
            icon.style.animation = "bottle-shaking 0.8s";
        };
    }, []);

    return (
        <Tooltip message="Not support yet" direction={OverlayDirection.TOP_CENTER}>
            <Box ref={wrapperRef}>
                <TouchRipple onTap={() => {}}>
                    <Row
                        gap="var(--padding-sm)"
                        padding="var(--padding-df)"
                        backgroundColor="var(--rearground)"
                        borderRadius="1e10px"
                        border="2px solid var(--rearground-border)"
                        cursor="pointer"
                    >
                        <RenderIcon.Name name="test_bottle" size="16px" filled={true} />
                        AI Search
                    </Row>
                </TouchRipple>
            </Box>
        </Tooltip>
    )
}