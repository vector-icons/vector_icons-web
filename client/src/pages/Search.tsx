import { AnimatedFoldable, Box, Column, Row, Text } from "react-widgets";
import Icon from "../assets/favicon.svg";
import { RenderIcon } from "../templates/RenderIcon";
import { Icons } from "./App";

export function SearchPage() {
    return (
        <Row size="100%">
            <SideBar />
            <Column size="100%" flexShrink="1">
                {/** Top Navgiation And Search Bar */}
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
                            <Column center gap="5px">
                                {
                                    Object.entries(icon.content).map(innerHTML => {
                                        return (
                                            <Box
                                                padding="var(--padding-df)"
                                                backgroundColor="var(--rearground)"
                                                borderRadius="10px"
                                            >
                                                <RenderIcon size="32px" innerHTML={innerHTML[1]} />
                                            </Box>
                                        )
                                    })
                                }
                                <Text.span
                                    fontSize="12px"
                                    maxWidth="50px"
                                    textOverflow="ellipsis"
                                >{icon.name}</Text.span>
                            </Column>
                        )
                    })
                }</Box>
            </Column>
        </Row>
    )
}

function SideBar() {
    return (
        <Column padding="var(--padding-df)" backgroundColor="var(--rearground)" borderRight="2px solid var(--rearground-border)">
            <Row center gap="var(--padding-sm)">
                <Icon width="50px" />
                <AnimatedFoldable.Horizontal visible={true} duration="0.3">
                    <Text.h1 fontSize="24px">Icons Search</Text.h1>
                </AnimatedFoldable.Horizontal>
            </Row>
        </Column>
    )
}