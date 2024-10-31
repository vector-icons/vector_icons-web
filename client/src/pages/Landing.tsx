import Logo from "../assets/favicon.svg";

import { AnimatedTransition, Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { Button } from "../templates/Button";
import { RouterBinding } from "@web-package/react-widgets-router";
import { l10n } from "../localization/localization";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { Animation, AnimationStatus, Curve } from "animatable-js";

export function LandingPage() {
    return (
        <Scrollable.Vertical>
            <Column>
                <Column
                    position="relative"
                    width="100%"
                    height="100vh"
                >
                    <Box position="absolute" size="100%" zIndex="-1">
                        {/** @ts-ignore */}
                        <landing-background />
                    </Box>
                    <Box position="absolute" size="100%" zIndex="-1" overflow="clip" children={<Background />} />
                    <Box
                        position="absolute"
                        size="100%"
                        zIndex="-1"
                        background="linear-gradient(0deg, var(--background-shadow), transparent, var(--background-shadow))"
                    />
                    <Row align="centerSpaceBetween" paddingAndGap="var(--padding-df)">
                        <Row align="center" gap="var(--padding-df)">
                            <Logo width="40px" />
                            <Row gap="var(--padding-sm)">
                                <Text.h2>QUARK ICONS</Text.h2>
                                <Text.span>OC</Text.span>
                            </Row>
                        </Row>
                        <Row gap="var(--padding-sm)">
                            <Button.Primary text={l10n["sign_in"]} onTap={() => RouterBinding.instance.push("/sign-in")} />
                            <Button.Secondary text={l10n["sign_up"]} onTap={() => RouterBinding.instance.push("/sign-up")} />
                        </Row>
                    </Row>
                    <Box padding="200px var(--padding-df)" maxWidth="1000px" margin="0px auto">
                        <Text fontWeight="bold" fontSize="50px">WELCOME!</Text>
                        <Text color="var(--foreground3)" fontSize="18px">{l10n["landing_introduction"]}</Text>
                        <Row marginTop="var(--padding-lg)">
                            <Button.Primary text={l10n["landing_get_started"]} onTap={() => RouterBinding.instance.push("/app")} />
                        </Row>
                    </Box>
                </Column>
            </Column>
        </Scrollable.Vertical>
    )
}

function Background() {
    const iconsRef = useRef(Icons.slice(0, 220));
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [iconsFilled, setIconsFilled] = useState(0);

    useLayoutEffect(() => {
        iconsRef.current.forEach((_, index) => {
            const item = wrapperRef.current.children[index] as HTMLElement;
            item.style.transitionDuration = "1s";
            item.style.transitionProperty = "transform, scale";
            item.style.transform = "translate(0px)";
            item.style.scale = "1";
            item.getBoundingClientRect();

            setTimeout(() => {
                item.style.transform = `translate(-${index / 2}px)`;
                item.style.scale = "1.1";

                setIconsFilled(index);
            }, index * 10);
        });
    }, []);

    return (
        <Box
            ref={wrapperRef}
            display="flex"
            flexWrap="wrap"
            maxWidth="900px"
            boxSizing="border-box"
            gap="var(--padding-df)"
            padding="var(--padding-df)"
            backgroundColor="var(--rearground)"
            borderRadius="15px"
            border="1px solid var(--rearground-border)"
            marginLeft="auto"
            marginTop="300px"
            transform="skew(-20deg, -15deg)"
            boxShadow="10px 10px 20px var(--rearground-border)"
        >{
            Icons.slice(0, 220).map((icon, index) => {
                const isFilled = iconsFilled >= index;

                return (
                    <AnimatedTransition value={isFilled} animation={{
                        duration: "1s",
                        fadeIn : {from: {opacity: "0"}, to: {opacity: "1"}},
                        fadeOut: {from: {opacity: "1"}, to: {opacity: "0"}}
                    }}>
                        <RenderIcon.Name name={icon.name} filled={isFilled} size="32px" color={
                            index % 2 == 0 ? "var(--foreground2)" : "var(--foreground4)"
                        } />
                    </AnimatedTransition>
                )
            })
        }</Box>
    )
}