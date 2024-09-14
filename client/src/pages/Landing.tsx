import Logo from "../assets/favicon.svg";

import { AnimatedFoldable, Box, Column, Row, Scrollable } from "react-widgets";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Button } from "../templates/Button";
import { ReactNode, useState } from "preact/compat";
import { RouterBinding } from "react-widgets-router";
import { l10n } from "../localization/localization";
import { RenderIcon } from "../templates/RenderIcon";

export function LandingPage() {
    return (
        <Scrollable.Vertical>
            <Column>
                <Box
                    position="relative"
                    display="flex"
                    width="100%"
                    height="100vh"
                    justifyContent="center"
                    flexDirection="column"
                >
                    <Column
                        align="center"
                        margin="auto"
                        gap="15px"
                        padding="15px"
                    >
                        <Logo width="100px" />
                        <Column align="center">
                            <h1>{l10n["landing_title"]}</h1>
                            <span>{l10n["landing_introduction"]}</span>
                        </Column>
                        <Button.Primary text={l10n["landing_get_started"]} onTap={() => RouterBinding.instance.push("/app")} />
                    </Column>
                    <Box position="absolute" size="100%" zIndex="-1">
                        {/** @ts-ignore */}
                        <landing-background />
                    </Box>
                    <Box 
                        position="absolute"
                        width="100%"
                        height="100%"
                        zIndex="-1"
                        background="linear-gradient(0deg, var(--background-shadow) 20%, transparent)"
                    />
                </Box>
                <Column gap="15px" padding="15px">
                    <Footer
                        title="What is it?"
                        description="This is a curated library of high-quality vector icons designed to enhance your web and mobile applications. Whether you're building a sleek website or a sophisticated app, our icons provide a professional and consistent look."
                    >
                        <FooterBlockquote title="Why use it?">
                            <ul style={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: "10px",
                                gap: "5px",
                                color: "var(--foreground3)"
                            }}>
                                <li>Save time: No need to design icons from scratch. Our ready-to-use icons save you valuable development time.</li>
                                <li>Enhance your design: Our icons are carefully crafted to complement various design styles, adding a touch of elegance to your projects.</li>
                            </ul>
                        </FooterBlockquote>
                        <FooterBlockquote title="About Contributing">
                            <span>We welcome contributions from the community. Whether you want to fix a bug, add a new icon, or improve the documentation, your help is appreciated.</span>
                        </FooterBlockquote>
                    </Footer>
                </Column>
            </Column>
        </Scrollable.Vertical>
    )
}

function Footer({title, description, children}: {
    title: string,
    description: string,
    children?: ReactNode
}) {
    const [isOpen, setOpen] = useState(false);

    return (
        <TouchRipple onTap={() => setOpen(!isOpen)}>
            <Box
                display="flex"
                flexDirection="column"
                gap="10px"
                maxWidth="1200px"
                margin="auto"
                padding="30px"
                background="var(--rearground)"
                border="2px solid var(--rearground-border)"
                borderRadius="15px"
            >
                <h2>{title}</h2>
                <span>{description}</span>
                <AnimatedFoldable.Vertical visible={isOpen} duration="0.3s">
                    <Box width="100%" height="1px" backgroundColor="var(--rearground-border)" marginTop="15px" />
                    {children}
                </AnimatedFoldable.Vertical>
                <span>Click to {isOpen ? "close" : "more"}</span>
            </Box>
        </TouchRipple>
    )
}

function FooterBlockquote({title, children}: {
    title: string,
    children: ReactNode,
}) {
    return (
        <Column
            gap="5px"
            opacity="0.75"
            padding="15px"
            borderLeft="5px solid var(--foreground4)"
            margin="15px 0px"
        >
            <h3>{title}</h3> {children}
        </Column>
    )
}

function SearchInput() {
    return (
        <Row
            align="center"
            backgroundColor="var(--rearground)"
            borderRadius="1e10px"
            border="2px solid var(--rearground-border)"
            paddingLeft="var(--padding-df)"
        >
            <RenderIcon.Name name="search" size="16px" />
            <input placeholder={l10n["landing_search_placeholder"]} style={{width: "300px", padding: "var(--padding-df)"}} />
        </Row>
    )
}