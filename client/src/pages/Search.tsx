import { AnimatedFoldable, Box, Column, Row, Scrollable, Text } from "react-widgets";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { TouchRipple } from "web-touch-ripple/jsx";

import Logo from "../assets/icons/logo.svg";
import { Container } from "../templates/Container";

export function SearchPage() {
    return (
        <Row size="100%">
            <SideBar />
            <Column size="100%" flexShrink="1">
                <SearchHeader />
                <SearchBody />
            </Column>
        </Row>
    )
}

function SideBar() {
    return (
        <Column flexShrink="0" padding="var(--padding-df)" backgroundColor="var(--rearground)" borderRight="1px solid var(--rearground-border)">
            <Row center gap="var(--padding-sm)" padding="0px var(--padding-df)">
                <Logo width="20px" />
                <AnimatedFoldable.Horizontal visible={true} duration="0.3">
                    <Text.h1 fontSize="22px">Icons Search</Text.h1>
                </AnimatedFoldable.Horizontal>
            </Row>
        </Column>
    )
}

function SearchHeader() {
    return (
        <Row padding="var(--padding-df)" borderBottom="1px solid var(--rearground-border)">
            <SearchBar />
        </Row>
    )
}

function SearchBar() {
    return (
        <input
            type="text"
            placeholder="Enter a name of icons and keywords or alias"
            style={{
                width: "100%",
                padding: "15px",
                fontSize: "16px",
                fontFamily: "Pretendard"
            }}
        />
    )
}

function SearchBody() {
    return (
        <Scrollable.Vertical>
            <Column>
                <Column padding="30px" gap="var(--padding-df)" borderBottom="1px solid var(--rearground-border)">
                    <Column gap="5px">
                        <Text.p fontSize="24px">Get Started</Text.p>
                        <Text.span>Try a contributing, would you like to contribute to icon creation? Detailed guidelines are provided below!</Text.span>
                    </Column>
                    <Row gap="var(--padding-df)">
                        <TouchRipple onTap={() => {}}>
                            <Container>
                                <Column gap="5px">
                                    <Text.p fontSize="18px">Style Guide</Text.p>
                                    <Text.span fontSize="14px">This open-source project aims to create and maintain icons with a consistent design! Therefore, please refer to the guide to ensure a cohesive icon style.</Text.span>
                                </Column>
                            </Container>
                        </TouchRipple>
                        <TouchRipple onTap={() => {}}>
                            <Container>
                                <Column gap="5px">
                                    <Text.p fontSize="18px">Github</Text.p>
                                    <Text.span fontSize="14px">To complete the icon creation and officially integrate it into the project, you will need to use GitHub!</Text.span>
                                </Column>
                            </Container>
                        </TouchRipple>
                    </Row>
                </Column>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    alignContent="start"
                    alignItems="start"
                    flexShrink="1"
                    columnGap="5px"
                    rowGap="var(--padding-df)"
                    padding="var(--padding-df)"
                >{
                    Icons.map(icon => {
                        return (
                            <Column center className="icon-grid_item" gap="5px">
                                <Column gap="5px">
                                    {Object.entries(icon.content).map(innerHTML => {
                                        return (
                                            <TouchRipple onTap={() => {}}>
                                                <Box
                                                    padding="var(--padding-df)"
                                                    backgroundColor="var(--rearground)"
                                                    borderRadius="15px"
                                                >
                                                    <RenderIcon size="32px" innerHTML={innerHTML[1]} />
                                                </Box>
                                            </TouchRipple>
                                        )
                                    })}
                                </Column>
                                <Text.span
                                    fontSize="12px"
                                    maxWidth="50px"
                                    textOverflow="ellipsis"
                                    children={icon.name}
                                />
                            </Column>
                        )
                    })
                }</Box>
            </Column>
        </Scrollable.Vertical>
    )
}