import Logo from "../assets/favicon.svg";
import LogoIcon from "../assets/icons/logo.svg";
import Part1Background1 from "../assets/images/landing_part1-background1.png";
import Part1Background2 from "../assets/images/landing_part1-background2.png";
import Part1Background3 from "../assets/images/landing_part1-background3.png";

import { AnimatedFoldable, Box, Column, Constraint, ConstraintBuilder, Row, Scrollable, Text } from "@web-package/react-widgets";
import { Button } from "../templates/Button";
import { RouterBinding } from "@web-package/react-widgets-router";
import { l10n } from "../localization/localization";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { MutableRef, useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { CSSProperties } from "react-dom/src";
import { TouchRipple } from "web-touch-ripple/jsx";

export function LandingPage() {
    const parentRef = useRef<HTMLDivElement>();

    return (
        <Box size="100%" ref={parentRef}>
            <Scrollable.Vertical>
                <Column>
                    <PartHeader.Body parentRef={parentRef} />
                    <Box position="relative" height="300vh" borderTop="3px double var(--rearground-border)">
                        <Part1.Body parentRef={parentRef} />
                    </Box>
                    <Box position="relative" height="300vh" borderTop="3px double var(--rearground-border)">
                        <Part2.Body parentRef={parentRef} />
                    </Box>
                    <Footer />
                </Column>
            </Scrollable.Vertical>
        </Box>
    )
}

namespace PartHeader {
    export function Body({parentRef}: {parentRef: MutableRef<HTMLDivElement>}) {
        const bottomTooltipRef = useRef<HTMLDivElement>();
        const [isTooltipHover, setTooltipHover] = useState(false);

        useEffect(() => {
            const parent = parentRef.current;
            const scroll = parent.firstElementChild;
            const tooltip = bottomTooltipRef.current;

            setTimeout(() => {
                const tooltip = bottomTooltipRef.current;
                tooltip.style.opacity = "1";
                tooltip.onclick = () => scroll.scroll({behavior: "smooth", top: window.innerHeight});
                tooltip.onmouseenter = () => setTooltipHover(true);
                tooltip.onmouseleave = () => setTooltipHover(false);
            }, 1000);

            scroll.addEventListener("scroll", () => {
                if (scroll.scrollTop == 0) {
                    tooltip.style.display = "unset";
                    tooltip.style.opacity = "1";
                } else {
                    tooltip.style.opacity = "0";
                    scroll.removeEventListener("scroll", this);
                }
            });
        }, []);

        return (
            <ConstraintBuilder
                constraints={[
                    new Constraint(600, Infinity, false),
                    new Constraint(-Infinity, 600, true),
                ]}
                usememo={false}
                builder={isMobile => {
                    return (
                        <Column
                            position="relative"
                            width="100%"
                            height="100vh"
                        >
                            <Box position="absolute" size="100%" zIndex="-1">
                                {/** @ts-ignore */}
                                <landing-background />
                            </Box>
                            <Box
                                position="absolute"
                                size="100%"
                                zIndex="-1"
                                background="linear-gradient(to top, var(--background-shadow), transparent, transparent 80%, var(--background-shadow))"
                            />
                            <Row align="centerSpaceBetween" paddingAndGap="var(--padding-df)">
                                <Row align="center" gap="var(--padding-sm)">
                                    <Logo width="32px" />
                                    {
                                        !isMobile ?
                                            <Row gap="var(--padding-sm)">
                                                <Text.h2 fontSize="20px" fontWeight="normal">QUARK ICONS</Text.h2>
                                            </Row>
                                        : <></>
                                    }
                                </Row>
                                <Row gap="var(--padding-sm)">
                                    <Button.Primary text={l10n["sign_in"]} onTap={() => RouterBinding.instance.push("/sign-in")} />
                                    <Button.Secondary text={l10n["sign_up"]} onTap={() => RouterBinding.instance.push("/sign-up")} />
                                </Row>
                            </Row>
                            <Box padding="200px var(--padding-lg)" maxWidth="1000px" margin="0px auto">
                                <Text fontWeight="bold" fontSize={isMobile ? "40px" : "60px"}>WELCOME!</Text>
                                <Text color="var(--foreground2)" fontSize={isMobile ? "16px" : "18px"}>{l10n["landing_introduction"]}</Text>
                                <Row gap="var(--padding-sm)" marginTop="var(--padding-lg)">
                                    <Button.Primary icon="compass" text={l10n["landing_get_started"]} onTap={() => RouterBinding.instance.push("/app")} />
                                    <Button.Secondary text={l10n["app_settings_title"]} onTap={() => RouterBinding.instance.push("/app/settings")} />
                                </Row>
                            </Box>
                            <Column align="center" position="absolute" width="100%" bottom="0px" padding="var(--padding-df)">
                                <Box
                                    ref={bottomTooltipRef}
                                    opacity="0"
                                    transitionProperty="opacity"
                                    transitionDuration="0.5s"
                                    userSelect="none"
                                    cursor="pointer"
                                >
                                    <Box
                                        opacity={isTooltipHover ? "1" : "0.5"}
                                        transitionProperty="opacity"
                                        transitionDuration="0.3s"
                                    >
                                        <Column align="center" gap="var(--padding-df)" margin="auto" padding="var(--padding-df)">
                                            <Row align="center">
                                                <RenderIcon.Name name="mouse" size="24px" />
                                                <AnimatedFoldable.Horizontal visible={isTooltipHover} duration="0.3s">
                                                    <Text.span marginLeft="var(--padding-sm)" color="var(--foreground)">{l10n["landing_click_down"]}</Text.span>
                                                </AnimatedFoldable.Horizontal>
                                            </Row>
                                            <Box
                                                animationName="landing-scrollable-tooltip"
                                                animationDuration="0.5s"
                                                animationDirection="alternate"
                                                animationIterationCount="infinite"
                                            >
                                                <RenderIcon.Name name="arrow_bottom" size="14px" color="var(--foreground)" />
                                            </Box>
                                        </Column>
                                    </Box>
                                </Box>
                            </Column>
                        </Column>
                    )
                }}
            />
        )
    }
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

                const threshold = 0.3; // 0 transparency up to 0.3 scroll position.
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

namespace Part2 {
    export function Body({parentRef}: {parentRef: MutableRef<HTMLDivElement>}) {
        const wrapperRef = useRef<HTMLDivElement>(null);
        const progressRef = useRef<HTMLDivElement>(null);

        useLayoutEffect(() => {
            const wrapper = wrapperRef.current;
            const progress = progressRef.current;
            const parent = parentRef.current;
            const scroll = parent.firstElementChild;

            const layout = () => {
                const absScrollTop = Math.max(0, (scroll.scrollTop - window.innerHeight * 3) / window.innerHeight);
                const relScrollTop = Math.min(1, Math.max(0, Math.max(absScrollTop - 1) / 2));

                const threshold = 0.3; // 0 transparency up to 0.3 scroll position.
                const maxOpacity = 1;
                wrapper.style.opacity = `${Math.min(maxOpacity, Math.max(0, (absScrollTop - threshold) / (1 - threshold)))}`;
                progress.style.height = `${relScrollTop * 100}%`;
            }

            scroll.addEventListener("scroll", layout);
            window.addEventListener("resize", layout);

            return () => {
                scroll.removeEventListener("scroll", layout);
                window.removeEventListener("resize", layout);
            }
        });

        return (
            <Box ref={wrapperRef} position="sticky" top="0px" height="100vh">
                <Row size="100%">
                    <Box ref={progressRef} width="5px" backgroundColor="var(--foreground)" />
                    <Column
                        className="body"
                        position="relative"
                        gap="var(--padding-lg)"
                        align="center"
                        size="100%"
                        margin="auto"
                        maxWidth="var(--content-max-width)"
                        padding="var(--padding-df)"
                        boxSizing="border-box"
                    >
                        <Column gap="3px">
                            <Text.h2 fontSize="32px" textShadow="0px 0px 5px black" color="white">애플리케이션을 더 위대하게!</Text.h2>
                            <Text.span fontSize="18px" textShadow="0px 0px 5px black" color="rgb(200, 200, 200)">Quark Icons와 함께 하십시오!</Text.span>
                        </Column>
                        <Box padding="var(--padding-df)" backgroundColor="var(--container)" borderRadius="30px">
                            <Row gap="var(--padding-df)">
                                <Item title={l10n["landing_part2"]["item1"]["title"]} description={l10n["landing_part2"]["item1"]["description"]} />
                                <Item title={l10n["landing_part2"]["item2"]["title"]} description={l10n["landing_part2"]["item2"]["description"]} />
                                <Item title={l10n["landing_part2"]["item3"]["title"]} description={l10n["landing_part2"]["item3"]["description"]} />
                            </Row>
                        </Box>
                        <LogoIcon
                            width="300px"
                            height="300px"
                            style={{
                                position: "absolute",
                                fill: "#E33223",
                                size: "300px",
                                zIndex: "-1",
                                filter: "drop-shadow(0px 0px 150px #E33223)"
                            }}
                        />
                    </Column>
                </Row>
            </Box>
        )
    }

    function Item({title, description}: {
        title: string;
        description: string;
    }) {
        return (
            <TouchRipple>
                <Column padding="var(--padding-df)" gap="3px" backgroundColor="var(--rearground)" borderRadius="15px" border="2px solid var(--rearground-border">
                    <Text.h3>{title}</Text.h3>
                    <Text.span>{description}</Text.span>
                </Column>
            </TouchRipple>
        )
    }
}

function Footer() {
    return (
        <Box width="100%" padding="var(--padding-lg)" borderTop="3px double var(--rearground-border)">
            <Column gap="var(--padding-df)" maxWidth="var(--content-max-width)" margin="auto">
                <Row gap="var(--padding-df)">
                    <TouchRipple onTap={() => window.open("https://github.com/MTtankkeo")}><Text.h3>GitHub</Text.h3></TouchRipple>
                    <TouchRipple onTap={() => window.open("https://discord.gg/EebbVXgstb")}><Text.h3>Discord</Text.h3></TouchRipple>
                </Row>
                <Text.span>Copyright 2025. <a href="https://github.com/MTtankkeo">장천룡(Dev Ttangkong)</a> All rights reserved.</Text.span>
            </Column>
        </Box>
    )
}