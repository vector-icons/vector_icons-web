import { AnimatedFoldable, Box, Column, Expanded, Row, Scrollable, TabNavigation, Text } from "react-widgets";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { TouchRipple } from "web-touch-ripple/jsx";

import Logo from "../assets/icons/logo.svg";
import { Container } from "../templates/Container";
import { useState } from "preact/hooks";

export function SearchPage() {
    return (
        <Row size="100%">
            <SideBar.Body />
            <Column size="100%" flexShrink="1">
                <SearchHeader />
                <Expanded direction="vertical">
                    <Row size="100%">
                        <SearchBody />
                        <SearchBodySideBar />
                    </Row>
                </Expanded>
            </Column>
        </Row>
    )
}

export namespace SideBar {
    export function Body() {
        const [index, setIndex] = useState(0); // temp
        const [close, setClose] = useState(false);

        return (
            <Column
                flexShrink="0"
                gap="var(--padding-df)"
                padding="var(--padding-df)"
                backgroundColor="var(--rearground)"
                borderRight="1px solid var(--rearground-border)"
            >
                <Row>
                    <AnimatedFoldable.Horizontal visible={close} duration="0.3s" transition={{opacity: true}} overflow="visible">
                        <Box marginLeft="15px"><Logo width="24px" /></Box>
                    </AnimatedFoldable.Horizontal>
                    <AnimatedFoldable.Horizontal visible={!close} duration="0.3s" transition={{opacity: true}}>
                        <Text.h1 fontSize="22px" padding="0px var(--padding-df)">VECTOR ICONS</Text.h1>
                    </AnimatedFoldable.Horizontal>
                </Row>
                <Box paddingLeft="3px">
                    <PrimaryButton close={close} text="Download All" iconName="import" onTap={() => {}} />
                </Box>
                <Scrollable.Vertical>
                    <TabNavigation.Vertical
                        index={index}
                        duration="0.3s"
                        style={{borderRadius: "1e10px", backgroundColor: "var(--foreground2)", width: "50%"}}
                    >
                        <Item closed={close} selected={index == 0} onTap={() => setIndex(0)} iconName="home" title="Home" />
                        <Item closed={close} selected={index == 1} onTap={() => setIndex(1)} iconName="community" title="Community" />
                        <Item closed={close} selected={index == 2} onTap={() => setIndex(2)} iconName="storage" title="Storage" />
                        <Item closed={close} selected={index == 3} onTap={() => setIndex(3)} iconName="settings" title="Settings" />
                    </TabNavigation.Vertical>
                </Scrollable.Vertical>
                <Column marginTop="auto">
                    <Button close={close} text="Close" iconName="arrow_left" onTap={() => setClose(!close)} />
                </Column>
            </Column>
        )
    }

    export function Item({selected, closed, iconName, title, onTap}: {
        selected: boolean;
        iconName: string;
        closed: boolean;
        title: string;
        onTap: VoidFunction;
    }) {
        return (
            <TouchRipple onTap={onTap}>
                <Row align="centerLeft" padding="var(--padding-df)" borderRadius="10px">
                    <RenderIcon.Name filled={selected} size="18px" name={iconName} />
                    <AnimatedFoldable.Horizontal visible={!closed} duration="0.3s" transition={{opacity: true}} overflow="visible">
                        <Box
                            marginLeft="var(--padding-df)"
                            color={selected ? "var(--foreground)" : "var(--foreground3)"}
                            transitionProperty="color"
                            transitionDuration="0.3s"
                            children={title}
                        />
                    </AnimatedFoldable.Horizontal>
                </Row>
            </TouchRipple>
        )
    }

    export function Button({text, close, iconName, onTap}: {
        text: string;
        close: boolean;
        iconName: string;
        onTap: VoidFunction;
    }) {
        return (
            <TouchRipple onTap={onTap}>
                <Row padding="var(--padding-sm) var(--padding-df)" borderRadius="1e10px">
                    <RenderIcon.Name name={iconName} size="18px" />
                    <AnimatedFoldable.Horizontal visible={!close} duration="0.3s" transition={{opacity: true}} overflow="visible">
                        <Box paddingLeft="var(--padding-df)">{text}</Box>
                    </AnimatedFoldable.Horizontal>
                </Row>
            </TouchRipple>
        )
    }

    export function PrimaryButton({text, close, iconName, onTap}: {
        text: string;
        close: boolean;
        iconName: string;
        onTap: VoidFunction;
    }) {
        return (
            <Box maxWidth="max-content">
                <TouchRipple onTap={onTap}>
                    <Row
                        backgroundColor="var(--primary2)"
                        color="white"
                        fill="white"
                        padding="var(--padding-sm) var(--padding-df)"
                        borderRadius="1e10px"
                    >
                        <RenderIcon.Name name={iconName} size="18px" />
                        <AnimatedFoldable.Horizontal visible={!close} duration="0.3s" transition={{opacity: true}} overflow="visible">
                            <Box paddingLeft="10px">{text}</Box>
                        </AnimatedFoldable.Horizontal>
                    </Row>
                </TouchRipple>
            </Box>
        )
    }
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
                            <Column align="center" className="icon-grid_item" gap="5px">
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

function SearchBodySideBar() {
    return (
        <Box flexShrink="0" borderLeft="1px solid var(--rearground-border)">
            <Scrollable.Vertical>
                <Box padding="var(--padding-df)">
                    <div>Right SideBar</div>
                </Box>
            </Scrollable.Vertical>
        </Box>
    )
}