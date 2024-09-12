import Logo from "../../assets/icons/logo.svg";

import { SearchPage } from "./Search";
import { AnimatedFoldable, Box, Column, Row, Scrollable, TabNavigation, Text } from "react-widgets";
import { useEffect, useRef, useState } from "preact/hooks";
import { Tooltip } from "../../templates/Tooltip";
import { RenderIcon } from "../../templates/RenderIcon";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Route, Router, RouterBinding, useLocation } from "react-widgets-router";
import { SettingsPage } from "./Settings";
import { l10n } from "../../localization/localization";

export function SwitchPage() {
    return (
        <Row size="100%">
            <SideBar.Body />
            <Column size="100%" flexShrink="1">
                <Router>
                    <Route path="/" component={SearchPage} />
                    <Route path="/settings" component={SettingsPage} />
                </Router>
            </Column>
        </Row>
    )
}

export namespace SideBar {
    export function Body() {
        const [close, setClose] = useState(window.innerWidth < 1400);
        const closeUserRef = useRef(false);
        const location = useLocation();
        const index = location.relPath == "/" ? 0
                    : location.relPath == "/settings" ? 3
                    : 0;

        useEffect(() => {
            let callback = null;
            window.addEventListener("resize", callback = () => {
                if (!closeUserRef.current) {
                    setClose(window.innerWidth < 1400);
                }
            });

            return () => window.removeEventListener("resize", callback);
        }, []);

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
                        <Text.h1 fontSize="22px" padding="0px var(--padding-df)">QUARK ICONS</Text.h1>
                    </AnimatedFoldable.Horizontal>
                </Row>
                <Box paddingLeft="3px">
                    <PrimaryButton
                        close={close}
                        text={l10n["app_download"]}
                        iconName="import"
                        onTap={() => window.open("https://github.com/vector-icons/vector_icons-assets")}
                    />
                </Box>
                <Scrollable.Vertical>
                    <TabNavigation.Vertical
                        index={index}
                        duration="0.3s"
                        style={{borderRadius: "1e10px", backgroundColor: "var(--foreground2)", width: "50%"}}
                    >
                        <Tooltip message={close ? l10n["app_home"] : null}>
                            <Item closed={close} selected={index == 0} onTap={() => {}} iconName="home" title={l10n["app_home"]} />
                        </Tooltip>
                        <Tooltip message={close ? l10n["app_request"] : null}>
                            <Item closed={close} selected={false} onTap={() => {}} iconName="add_circle" title={l10n["app_request"]} />
                        </Tooltip>
                        <Tooltip message={close ? l10n["app_community"] : null}>
                            <Item closed={close} selected={false} onTap={() => {}} iconName="community" title={l10n["app_community"]} />
                        </Tooltip>
                        <Tooltip message={close ? l10n["app_storage"] : null}>
                            <Item closed={close} selected={false} onTap={() => {}} iconName="storage" title={l10n["app_storage"]} />
                        </Tooltip>
                        <Tooltip message={close ? l10n["app_settings"] : null}>
                            <Item closed={close} selected={index == 3} onTap={() => {}} iconName="settings" title={l10n["app_settings"]} />
                        </Tooltip>
                    </TabNavigation.Vertical>
                </Scrollable.Vertical>
                <Column marginTop="auto">
                    <Button close={close} text={l10n["close"]} iconName={close ? "arrow_right" : "arrow_left"} onTap={() => {closeUserRef.current = !close; setClose(!close)}} />
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
                        backgroundColor="var(--primary)"
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