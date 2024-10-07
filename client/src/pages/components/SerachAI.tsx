import { AnimatedSize, AnimatedTransition, Box, Column, Row, Text } from "@web-package/react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Input } from "../../templates/Input";
import { Button } from "../../templates/Button";

export function SearchAI() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

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
        <Box
            ref={wrapperRef}
            maxWidth="500px"
            padding="var(--padding-df)"
            backgroundColor="var(--rearground)"
            borderRadius={open ? "15px" : "30px"}
            border="2px solid var(--rearground-border)"
            cursor={!open ? "pointer" : undefined}
            onClick={!open ? () => setOpen(!open) : undefined}
            transitionProperty="border-radius"
            transitionDuration="0.3s"
        >
            <AnimatedSize duration="0.3s">
                <AnimatedTransition
                    value={open}
                    animation={{
                        duration: "0.3s",
                        fadeIn:  {from: {opacity: 0}, to: {opacity: 1}},
                        fadeOut: {from: {opacity: 1}, to: {opacity: 0}},
                    }}
                >
                    {open ? <Body /> : <OpenButton />}
                </AnimatedTransition>
            </AnimatedSize>
        </Box>
    )
}

function OpenButton() {
    return (
        <Row gap="var(--padding-sm)">
            <RenderIcon.Name name="test_bottle" size="16px" filled={true} />
            AI Search
        </Row>
    )
}

function Body() {
    return (
        <Column padding="var(--padding-sm)">
            <BodyEmpty />
            <Row
                align="centerSpaceBetween"
                backgroundColor="var(--background)"
                borderRadius="1e10px"
                paddingRight="5px"
            >
                <input placeholder="Enter the icon you want" style={{
                    width: "100%",
                    padding: "var(--padding-df)",
                    fontSize: "14px",
                }} />
                <Button.Primary text="Serach" onTap={() => {}} icon="search" />
            </Row>
        </Column>
    )
}

function BodyEmpty() {
    return (
        <Column>
            <Text.h3>Get started</Text.h3>
            <Text.span>Try a sample prompt or add your own input below</Text.span>
            <Row gap="var(--padding-df)" margin="var(--padding-df) 0px">
                <Container icon="navigation" title="Desktop icons recommendations" description="Recommend icons related to desktop." />
                <Container icon="shopping_bag" title="Shopping icons recommendations" description="Recommend icons related to shopping." />
            </Row>
        </Column>
    )
}

function Container({icon, title, description}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <TouchRipple onTap={() => {}}>
            <Row
                gap="var(--padding-df)"
                padding="var(--padding-df)"
                backgroundColor="var(--background)"
                borderRadius="10px"
            >
                <RenderIcon.Name name={icon} size="18px" color="var(--primary)" />
                <Column gap="5px" borderRadius="10px">
                    <Text.p fontSize="16px">{title}</Text.p>
                    <Text.span fontSize="14px">{description}</Text.span>
                </Column>
            </Row>
        </TouchRipple>
    )
}