import Logo from "../assets/favicon.svg";

import { AnimatedTransition, Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { Button } from "../templates/Button";
import { RouterBinding } from "@web-package/react-widgets-router";
import { l10n } from "../localization/localization";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { MutableRef, useLayoutEffect, useRef, useState } from "preact/hooks";

export function LandingPage() {
    const parentRef = useRef<HTMLDivElement>();

    return (
        <Box size="100%" ref={parentRef}>
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
                        <Box padding="200px var(--padding-lg)" maxWidth="1000px" margin="0px auto">
                            <Text fontWeight="bold" fontSize="50px">WELCOME!</Text>
                            <Text color="var(--foreground3)" fontSize="18px">{l10n["landing_introduction"]}</Text>
                            <Row marginTop="var(--padding-lg)">
                                <Button.Primary text={l10n["landing_get_started"]} onTap={() => RouterBinding.instance.push("/app")} />
                            </Row>
                        </Box>
                    </Column>
                    <Box position="relative" width="100vw" height="300vh" borderTop="3px double var(--rearground-border)">
                        <Part1 parentRef={parentRef} />
                    </Box>
                </Column>
            </Scrollable.Vertical>
        </Box>
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

function Part1({parentRef}: {parentRef: MutableRef<HTMLDivElement>}) {
    const wrapperRef = useRef<HTMLDivElement>();
    const circleRef = useRef<HTMLDivElement>();
    const title1Ref = useRef<HTMLDivElement>();
    const title2Ref = useRef<HTMLDivElement>();
    const title3Ref = useRef<HTMLDivElement>();

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        const parent = parentRef.current;
        const scroll = parent.firstElementChild;
        const circle = circleRef.current;
        const title1 = title1Ref.current;
        const title2 = title2Ref.current;
        const title3 = title3Ref.current;
        const column = wrapper.getElementsByClassName("items")[0];

        const layout = () => {
            const columnHeight = column.clientHeight - circle.clientHeight;
            const absScrollTop = scroll.scrollTop / window.innerHeight;
            const relScrollTop = Math.min(1, Math.max(0, absScrollTop - 1) / 2);
            const title1Top = title1.getBoundingClientRect().top;
            const title2Top = title2.getBoundingClientRect().top;
            const title3Top = title3.getBoundingClientRect().top;
            console.log(relScrollTop);

            wrapper.style.opacity = `${Math.min(1, absScrollTop)}`;
            circle.style.transform = `translateY(${columnHeight * relScrollTop}px)`;
        }

        layout();
        scroll.addEventListener("scroll", layout);

        return () => scroll.removeEventListener("scroll", layout);
    }, []);

    return (
        <Box
            position="sticky"
            ref={wrapperRef}
            height="100vh"
            top="0px"
        >
            <Row
                align="center"
                height="100%"
                maxWidth="1200px"
                margin="auto"
                padding="var(--padding-df)"
                boxSizing="border-box"
            >
                <Row position="relative" gap="var(--padding-lg)" width="100%">
                    <Box
                        position="absolute"
                        width="2px"
                        height="calc(100% - 64px)"
                        backgroundColor="var(--rearground-border)"
                        transform="translateX(32px)"
                        margin="32px 0px"
                    />
                    <Column height="fit-content">
                        <Box ref={circleRef} borderRadius="1e10px" border="2px solid var(--rearground-border)" padding="var(--padding-df)">
                            <Box size="30px" borderRadius="1e10px" backgroundColor="var(--rearground-border)" />
                        </Box>
                    </Column>
                    <Column className="items" gap="100px" width="100%">
                        <Box ref={title1Ref}>
                            <Text.h2 fontSize="32px">오픈소스</Text.h2>
                            <Text.span>오픈적이고 Quark Icons는 항상 노력하고 있습니다.</Text.span>
                        </Box>
                        <Box ref={title2Ref}>
                            <Text.h2 fontSize="32px">현대적인</Text.h2>
                            <Text.span>현대적인 디자인으로 세련함을 더합니다.</Text.span>
                        </Box>
                        <Box ref={title3Ref}>
                            <Text.h2 fontSize="32px">퀄리티</Text.h2>
                            <Text.span>높은 퀄리티를 위해서 Quark Icons는 항상 노력하고 있습니다.</Text.span>
                        </Box>
                    </Column>
                </Row>
            </Row>
        </Box>
    )
}