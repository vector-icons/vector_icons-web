import { AnimatedFoldable, Box, Column, Expanded, Row, Scrollable, Text } from "react-widgets";
import Icon from "../assets/favicon.svg";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";
import { TouchRipple } from "web-touch-ripple/jsx";

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
            <Row center gap="var(--padding-sm)">
                <Icon width="40px" />
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
            placeholder="Enter a name of an icon you want"
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
                                                borderRadius="10px"
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
        </Scrollable.Vertical>
    )
}