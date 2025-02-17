import Logo from "../../assets/icons/logo.svg";

import { SearchPage } from "./Search";
import { AnimatedFoldable, AnimatedTransition, Box, Column, Row, Scrollable, TabNavigation, Text } from "@web-package/react-widgets";
import { useEffect, useRef, useState } from "preact/hooks";
import { Tooltip } from "../../templates/Tooltip";
import { RenderIcon } from "../../templates/RenderIcon";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Route, Router, RouterBinding, useLocation } from "@web-package/react-widgets-router";
import { SettingsPage } from "./Settings";
import { l10n } from "../../localization/localization";
import { Unactive } from "../../templates/Unactive";
import { CreditsPage } from "./Credits";
import { StyleGuidePage } from "./StyleGuide";
import { Storage } from "../../components/storage";
import { User } from "../../components/user";
import { List } from "../../templates/List";
import { PopupPage } from "../../components/popup_page";
import { IconPopup } from "./Search-popup";
import { Icons } from "../App";

export function SwitchPage() {
    return (
        <Row size="100%">
            <SideBar.Body />
            <Column size="100%" flexShrink="1">
                <Router>
                    <Route path="/" component={SearchPage} />
                    <Route path="/style_guide" component={StyleGuidePage} />
                    <Route path="/settings" component={SettingsPage} />
                    <Route path="/credits" component={CreditsPage} />
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
                    : location.relPath == "/style_guide" ? 4
                    : location.relPath == "/credits" ? 5
                    : location.relPath == "/settings" ? 6
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

        const homeTapCallback = () => {
            if (index != 0) RouterBinding.instance.move("/app");
        }

        const styleGuideTapCallback = () => {
            if (index != 4) RouterBinding.instance.move("/app/style_guide");
        }

        const creditsTapCallback = () => {
            if (index != 5) RouterBinding.instance.move("/app/credits");
        }

        const settingsTapCallback = () => {
            if (index != 6) RouterBinding.instance.move("/app/settings");
        }

        return (
            <Column
                flexShrink="0"
                gap="var(--padding-df)"
                padding="var(--padding-df)"
            >
                <div onClick={() => RouterBinding.instance.push("/")}>
                    <Row cursor="pointer" userSelect="none">
                        <AnimatedFoldable.Horizontal visible={close} duration="0.3s" transition={{opacity: true}} overflow="visible">
                            <Box marginLeft="15px"><Logo width="24px" /></Box>
                        </AnimatedFoldable.Horizontal>
                        <AnimatedFoldable.Horizontal visible={!close} duration="0.3s" transition={{opacity: true}}>
                            <Text.h1 fontSize="22px" padding="0px var(--padding-df)">QUARK ICONS</Text.h1>
                        </AnimatedFoldable.Horizontal>
                    </Row>
                </div>
                <Box paddingLeft="3px">
                    <PrimaryButton
                        close={close}
                        text={l10n["app_download"]}
                        iconName="import"
                        onTap={() => window.open("https://github.com/vector-icons/vector_icons-assets")}
                    />
                </Box>
                <Scrollable.Vertical>
                    <Column gap="var(--padding-df)">
                        <TabNavigation.Vertical
                            index={index}
                            duration="0.3s"
                            style={{borderRadius: "1e10px", backgroundColor: "var(--foreground2)", width: "50%"}}
                        >
                            <Tooltip message={close ? l10n["app_home"] : null}>
                                <Item closed={close} selected={index == 0} onTap={homeTapCallback} iconName="home" title={l10n["app_home"]} />
                            </Tooltip>
                            <Unactive>
                                <Tooltip message={close ? l10n["app_request"] : null}>
                                    <Item closed={close} selected={false} onTap={() => {}} iconName="add_circle" title={l10n["app_request"]} />
                                </Tooltip>
                            </Unactive>
                            <Unactive>
                                <Tooltip message={close ? l10n["app_community"] : null}>
                                    <Item closed={close} selected={false} onTap={() => {}} iconName="community" title={l10n["app_community"]} />
                                </Tooltip>
                            </Unactive>
                            <Unactive>
                                <Tooltip message={close ? l10n["app_storage"] : null}>
                                    <Item closed={close} selected={false} onTap={() => {}} iconName="storage" title={l10n["app_storage"]} />
                                </Tooltip>
                            </Unactive>
                            <Tooltip message={close ? l10n["app_style_guide"] : null}>
                                <Item closed={close} selected={index == 4} onTap={styleGuideTapCallback} iconName="image" title={l10n["app_style_guide"]} />
                            </Tooltip>
                            <Tooltip message={close ? l10n["app_credits"] : null}>
                                <Item closed={close} selected={index == 5} onTap={creditsTapCallback} iconName="users" title={l10n["app_credits"]} />
                            </Tooltip>
                            <Tooltip message={close ? l10n["app_settings"] : null}>
                                <Item closed={close} selected={index == 6} onTap={settingsTapCallback} iconName="settings" title={l10n["app_settings"]} />
                            </Tooltip>
                        </TabNavigation.Vertical>
                        <History closed={close} />
                    </Column>
                </Scrollable.Vertical>
                <Column marginTop="auto">
                    <Button close={close} reverse={close} text={l10n["close"]} iconName={"arrow_left"} onTap={() => {closeUserRef.current = !close; setClose(!close)}} />
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
                    <AnimatedTransition value={selected} animation={{
                        duration: "0.3s",
                        fadeIn: {from: {opacity: 0}, to: {opacity: 1}},
                        fadeOut: {from: {opacity: 1}, to: {opacity: 0}}
                    }}>
                        <RenderIcon.Name filled={selected} size="18px" name={iconName} />
                    </AnimatedTransition>
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

    export function Button({text, close, iconName, reverse, onTap}: {
        text: string;
        close: boolean;
        iconName: string;
        reverse: boolean;
        onTap: VoidFunction;
    }) {
        return (
            <TouchRipple onTap={onTap}>
                <Row padding="var(--padding-sm) var(--padding-df)" borderRadius="1e10px">
                    <Box
                        transform={reverse ? "rotate(0.5turn)" : undefined}
                        transitionProperty="transform"
                        transitionDuration="0.3s"
                        children={<RenderIcon.Name name={iconName} size="18px" />}
                    />
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
                        align="center"
                        backgroundColor="var(--primary)"
                        color="white"
                        fill="white"
                        padding="var(--padding-sm) var(--padding-df)"
                        borderRadius="1e10px"
                    >
                        <RenderIcon.Name name={iconName} size="18px" />
                        <AnimatedFoldable.Horizontal visible={!close} duration="0.3s" transition={{opacity: true}}>
                            <Box paddingLeft="10px">{text}</Box>
                        </AnimatedFoldable.Horizontal>
                    </Row>
                </TouchRipple>
            </Box>
        )
    }

    function History({closed}: {closed: boolean}) {
        const downloadedIcons = User.downloadedIcons ?? [];
        const isNotDownloaded = downloadedIcons.length == 0;
        const isEmpty = downloadedIcons.length == 0;

        return (
            <Column>
                <AnimatedFoldable.Horizontal visible={!closed} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                    <AnimatedFoldable.Vertical visible={!closed} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                        <Text.span marginLeft="var(--padding-df)" paddingBottom="var(--padding-df)">{l10n["app_downloaded_history"]}</Text.span>
                    </AnimatedFoldable.Vertical>
                </AnimatedFoldable.Horizontal>
                <AnimatedFoldable.Horizontal visible={isEmpty ? !closed : true} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                    <AnimatedFoldable.Vertical visible={isEmpty ? !closed : true} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                        <List.Vertical
                            width="100%"
                            maxWidth="200px"
                            backgroundColor="var(--rearground-in-background)"
                            borderRadius="15px"
                            overflow="hidden"
                        >
                            {
                                isNotDownloaded ?
                                    <Row gap="var(--padding-sm)" padding="var(--padding-df)">
                                        <RenderIcon.Name name="folder" size="18px" color="var(--foreground2)" />
                                        <Text.span>{l10n["app_downloaded_history_none"]}</Text.span>
                                    </Row> :
                                    (downloadedIcons.slice(0, 3)).map((name) => <HistoryItem iconName={name} closed={closed} />)
                            }
                        </List.Vertical>
                    </AnimatedFoldable.Vertical>
                </AnimatedFoldable.Horizontal>
            </Column>
        )
    }

    function HistoryItem({iconName, closed}: {iconName: string, closed: boolean}) {
        const iconNormal = iconName.replace("-filled", "");
        const iconFilled = iconName.endsWith("filled");
        const icon = Icons.find(e => e.name == iconNormal);

        return (
            <TouchRipple onTap={() => PopupPage.open(<IconPopup icon={icon} filled={iconFilled} />)}>
                <Row width="100%" padding="var(--padding-df)">
                    <RenderIcon.Name name={iconNormal} filled={iconFilled} size="18px" />
                    <AnimatedFoldable.Horizontal visible={!closed} duration="0.3s" overflow="visible" transition={{opacity: true}}>
                        <Text.span marginLeft="var(--padding-df)">{iconFilled ? `${iconNormal} filled` : iconName}</Text.span>
                    </AnimatedFoldable.Horizontal> 
                </Row>
            </TouchRipple>
        )
    }
}