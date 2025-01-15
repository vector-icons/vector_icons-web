import Logo from "../assets/favicon.svg";
import Part1Background1 from "../assets/images/landing_part1-background1.png";
import Part1Background2 from "../assets/images/landing_part1-background2.png";
import Part1Background3 from "../assets/images/landing_part1-background3.png";

import { Box, Column, Constraint, ConstraintBuilder, Row, Scrollable, SizeBuilder, Text } from "@web-package/react-widgets";
import { Button } from "../templates/Button";
import { RouterBinding } from "@web-package/react-widgets-router";
import { l10n } from "../localization/localization";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { MutableRef, useLayoutEffect, useRef, useState } from "preact/hooks";
import { CSSProperties } from "react-dom/src";

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
                    <Box position="relative" height="300vh" borderTop="3px double var(--rearground-border)">
                        <Part1.Body parentRef={parentRef} />
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
                    <RenderIcon.Name name={icon.name} filled={isFilled} size="32px" color={
                        index % 2 == 0 ? "var(--foreground2)" : "var(--foreground4)"
                    } />
                )
            })
        }</Box>
    )
}

namespace Part1 {
    export function Body({parentRef}: {parentRef: MutableRef<HTMLDivElement>}) {
        const wrapperRef = useRef<HTMLDivElement>();
        const circleRef = useRef<HTMLDivElement>();
        const title1Ref = useRef<HTMLDivElement>();
        const title2Ref = useRef<HTMLDivElement>();
        const title3Ref = useRef<HTMLDivElement>();
        const [index, setIndex] = useState<number>();

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
                const relIndex = Math.max(1, Math.round(absScrollTop));
                setIndex(relIndex - 1);

                switch (relIndex) {
                    case 1: title1.style.opacity = "1"; title2.style.opacity = "0.5"; title3.style.opacity = "0.5"; break;
                    case 2: title2.style.opacity = "1"; title1.style.opacity = "0.5"; title3.style.opacity = "0.5"; break;
                    case 3: title3.style.opacity = "1"; title1.style.opacity = "0.5"; title2.style.opacity = "0.5"; break;
                }

                const threshold = 0.5; // 0 transparency up to 0.5 scroll position.
                const maxOpacity = 1;
                wrapper.style.opacity = `${Math.min(maxOpacity, Math.max(0, (absScrollTop - threshold) / (1 - threshold)))}`;
                circle.style.transform = `translateY(${columnHeight * relScrollTop}px)`;
            }

            layout();
            scroll.addEventListener("scroll", layout);
            window.addEventListener("resize", layout);
    
            return () => {
                scroll.removeEventListener("scroll", layout);
                window.removeEventListener("resize", layout);
            };
        }, []);

        return (
            <Box
                position="sticky"
                ref={wrapperRef}
                height="100vh"
                top="0px"
            >
                <ConstraintBuilder<Boolean>
                    constraints={[
                        new Constraint(700, Infinity, true),
                        new Constraint(0, 700, false),
                    ]}
                    usememo={false}
                    builder={isVisible => {
                        const style: CSSProperties = {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transitionProperty: "opacity",
                            transitionDuration: "0.5s"
                        }

                        return (
                            <Box position="absolute" size="100%" display={isVisible ? undefined : "none"}>
                                <Box position="relative" size="100%">
                                    <img src={Part1Background1} style={{...style, opacity: index == 0 ? "1" : "0"}} />
                                    <img src={Part1Background2} style={{...style, opacity: index == 1 ? "1" : "0"}} />
                                    <img src={Part1Background3} style={{...style, opacity: index == 2 ? "1" : "0"}} />
                                </Box>
                            </Box>
                        )
                    }}
                />
                <Box
                    position="absolute"
                    size="100%"
                    background="linear-gradient(to right, var(--background) 30%, transparent 70%)"
                />
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
                            <Item refer={title1Ref} title={l10n["landing_part1"]["item1"]["title"]} description={l10n["landing_part1"]["item1"]["description"]} />
                            <Item refer={title2Ref} title={l10n["landing_part1"]["item2"]["title"]} description={l10n["landing_part1"]["item2"]["description"]} />
                            <Item refer={title3Ref} title={l10n["landing_part1"]["item3"]["title"]} description={l10n["landing_part1"]["item3"]["description"]} />
                        </Column>
                    </Row>
                </Row>
            </Box>
        )
    }

    function Item({refer, title, description}: {
        refer: MutableRef<HTMLDivElement>;
        title: string;
        description: string;
    }) {
        return (
            <Box
                ref={refer}
                transitionDuration="0.5s"
                transitionProperty="opacity"
            >
                <Text.h2 fontSize="32px">{title}</Text.h2>
                <Text.span>{description}</Text.span>
            </Box>
        )
    }
}