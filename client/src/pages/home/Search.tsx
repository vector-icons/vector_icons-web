import { AnimatedFoldable, AnimatedTransition, Box, Column, Constraint, ConstraintBuilder, Expanded, Row, Scrollable, Text, Invisible } from "@web-package/react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { AppContext, Icons, IconType } from "../App";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Container } from "../../templates/Container";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { Input } from "../../templates/Input";
import { createContext } from "preact";
import * as Fuse from "fuse.js";
import { Button } from "../../templates/Button";
import { SettingsBinding } from "../../settings/settings_binding";
import { Tooltip } from "../../templates/Tooltip";
import { l10n } from "../../localization/localization";
import { PopupPage } from "../../components/popup_page";
import { IconPopup } from "./Search-popup";
import { User } from "../../components/user";

const PreviewControllerContext = createContext<PreviewController>(null);

type PreviewControllerListener = (id: number, type: PreviewControllerEvent) => void;
enum PreviewControllerEvent {
    iconSize,
    iconName,
    iconType,
    iconOnlyMarked,
}

enum PreviewIconType {
    all,
    normal,
    filled,
}

class PreviewController {
    _iconSize: number;
    _iconName: string;
    _iconType: PreviewIconType;
    _iconOnlyMarked: boolean;

    constructor(iconSize: number, iconName: string, iconType: PreviewIconType, iconOnlyMarked: boolean) {
        this._iconSize = iconSize;
        this._iconName = iconName;
        this._iconType = iconType;
        this._iconOnlyMarked = iconOnlyMarked;
    };

    count: number = 0;
    listeners: PreviewControllerListener[] = [];

    get iconSize() { return this._iconSize; }
    set iconSize(newValue: number) {
        if (this._iconSize != newValue) {
            this._iconSize = newValue;
            this.notifyListeners(PreviewControllerEvent.iconSize);
        }
    }

    get iconName() { return this._iconName; }
    set iconName(newValue: string) {
        if (this._iconName != newValue) {
            this._iconName = newValue;
            this.notifyListeners(PreviewControllerEvent.iconName);
        }
    }

    get iconType() { return this._iconType; }
    set iconType(newValue: PreviewIconType) {
        if (this._iconType != newValue) {
            this._iconType = newValue;
            this.notifyListeners(PreviewControllerEvent.iconType);
        }
    }

    get iconOnlyMarked() { return this._iconOnlyMarked; }
    set iconOnlyMarked(newValue: boolean) {
        if (this._iconOnlyMarked != newValue) {
            this._iconOnlyMarked = newValue;
            this.notifyListeners(PreviewControllerEvent.iconOnlyMarked);
        }
    }

    addListener(listener: PreviewControllerListener) {
        this.listeners.push(listener);
    }

    notifyListeners(event: PreviewControllerEvent) {
        this.listeners.forEach(listener => listener(this.count += 1, event));
    }
}

export function SearchPage() {
    const [controller, _] = useState(new PreviewController(32, "", PreviewIconType.all, false));

    return (
        <PreviewControllerContext.Provider value={controller}>
            <Column size="100%" flexShrink="1">
                <SearchHeader />
                <Expanded direction="vertical">
                    <Row size="100%">
                        <SearchBody />
                        <SearchBodySideBar />
                    </Row>
                </Expanded>
            </Column>
        </PreviewControllerContext.Provider>
    )
}

function SearchHeader() {
    return (
        <Row align="center" padding="var(--padding-df)" borderBottom="1px solid var(--rearground-border)">
            <SearchBar />
            <SearchHeaderThemeSwitch />
        </Row>
    )
}

function SearchHeaderThemeSwitch() {
    const setApp = useContext(AppContext);
    const isDark = document.body.className == "dark" ? true : false;

    return (
        <Tooltip message={isDark ? l10n["app_setting_to_light"] : l10n["app_setting_to_dark"]}>
            <TouchRipple onTap={() => {
                if (isDark) {
                    SettingsBinding.setValue("theme", "light");
                    setApp("Update theme to light");
                } else {
                    SettingsBinding.setValue("theme", "dark");
                    setApp("Update theme to dark");
                }
            }}>
                <Box position="relative" borderRadius="50%">
                    <Box
                        padding="var(--padding-df)"
                        opacity={isDark ? "0" : "1"}
                        transform={isDark ? "translate(0px, -100%)" : undefined}
                        transitionProperty="transform, opacity"
                        transitionDuration="0.3s"
                        children={<RenderIcon.Name name="sun" size="24px" />}
                    />
                    <Box
                        position="absolute"
                        padding="var(--padding-df)"
                        opacity={isDark ? "1" : "0"}
                        transform={isDark ? "translate(0px, -100%)" : undefined}
                        transitionProperty="transform, opacity"
                        transitionDuration="0.3s"
                        children={<RenderIcon.Name name="moon" size="24px" />}
                    />
                </Box>
            </TouchRipple>
        </Tooltip>
    )
}

function SearchBar() {
    const countState = useState(0);
    const wrapperRef = useRef<HTMLInputElement>(null);
    const controller = useContext(PreviewControllerContext);

    useLayoutEffect(() => {
        controller.addListener((id, type) => {
            if (type == PreviewControllerEvent.iconName) {
                if (controller.iconName == "") {
                    wrapperRef.current.value = "";
                }

                countState[1](id);
            }
        });
    });

    return (
        <Row align="centerLeft" width="100%">
            <Box marginLeft="var(--padding-df)">
                <RenderIcon.Name name="search" size="16px" color="var(--foreground3)" />
            </Box>
            <input
                ref={wrapperRef}
                type="text"
                placeholder={l10n["app_search_placeholder"]}
                onChange={() => controller.iconName = wrapperRef.current.value}
                style={{
                    width: "100%",
                    padding: "15px",
                    fontSize: "16px",
                    fontFamily: "Pretendard"
                }}
            />
            <Box pointerEvents={controller.iconName ? undefined : "none"}>
                <Tooltip message={l10n["app_search_reset"]}>
                    <TouchRipple onTap={() => controller.iconName = ""}>
                        <Box
                            padding="var(--padding-df)"
                            borderRadius="50%"
                            opacity={controller.iconName ? "1" : "0"}
                            transitionProperty="opacity"
                            transitionDuration="0.3s"
                            children={<RenderIcon.Name name="close" size="16px" />}
                        />
                    </TouchRipple>
                </Tooltip>
            </Box>
        </Row>
    )
}

function SearchBody() {
    const countState = useState(0);
    const controller = useContext(PreviewControllerContext);

    useEffect(() => {
        controller.addListener((id, event) => {
            if (event == PreviewControllerEvent.iconName) countState[1](id);
            if (event == PreviewControllerEvent.iconOnlyMarked) countState[1](id);
        })
    }, []);

    const iconSearchName = controller.iconName;
    const iconSearch = new Fuse.default(Icons, {
        keys: ["name"],
        threshold: 0.2
    });

    let icons: IconType[];
    if (iconSearchName == "") {
        icons = Icons;
    } else {
        icons = iconSearch.search(iconSearchName).map(result => result.item);
    }

    // 북마크된 아이콘만 표시
    if (controller.iconOnlyMarked) {
        icons = icons.filter(icon => User.markedIcons.some(name => name == icon.name));
    }

    return (
        <Scrollable.Vertical>
            <Column>
                <SearchBodyHeader />
                <AnimatedTransition
                    value={icons.length == 0}
                    animation={{
                        duration: "0.3s",
                        fadeIn:  {from: {opacity: 0}, to: {opacity: 1}},
                        fadeOut: {from: {opacity: 1}, to: {opacity: 0}},
                    }}
                    children={<SearchBodyContent icons={icons} />}
                />
            </Column>
        </Scrollable.Vertical>
    )
}

function SearchBodyHeader() {
    const [close, setClose] = useState(
        Boolean(SettingsBinding.getValue("app_home_header_close")) ?? false
    );

    const onClose = () => {
        SettingsBinding.setValue("app_home_header_close", !close ? "true" : null);
        setClose(!close);
    }

    return (
        <Column borderBottom="1px solid var(--rearground-border)">
            <AnimatedFoldable.Vertical visible={!close} duration="0.3s">
                <Column padding="30px 30px 15px 30px" gap="var(--padding-df)">
                    <Column gap="5px">
                        <Text.p fontSize="24px">{l10n["app_contributing_title"]}</Text.p>
                        <Text.span>{l10n["app_contributing_description"]}</Text.span>
                    </Column>
                    <Row gap="var(--padding-df)">
                        <TouchRipple onTap={() => {}}>
                            <Container expanded={true}>
                                <Column gap="5px">
                                    <Text.p fontSize="18px">{l10n["app_contributing_style_guide_title"]}</Text.p>
                                    <Text.span fontSize="14px">{l10n["app_contributing_style_guide_description"]}</Text.span>
                                </Column>
                            </Container>
                        </TouchRipple>
                        <TouchRipple wait={true} onTap={() => window.open("https://github.com/vector-icons/vector_icons")}>
                            <Container expanded={true}>
                                <Column gap="5px">
                                    <Text.p fontSize="18px">{l10n["app_contributing_github_title"]}</Text.p>
                                    <Text.span fontSize="14px">{l10n["app_contributing_github_description"]}</Text.span>
                                </Column>
                            </Container>
                        </TouchRipple>
                    </Row>
                </Column>
            </AnimatedFoldable.Vertical>
            <TouchRipple onTap={onClose}>
                <Row align="center" paddingAndGap="var(--padding-sm)">
                    <Box
                        transform={close ? "rotate(0.5turn)" : undefined}
                        transitionProperty="transform"
                        transitionDuration="0.3s"
                        children={<RenderIcon.Name name="arrow_top" size="14px" color="var(--foreground3)" />}
                    />
                    <Text.span color="var(--foreground3)" fontSize="14px">
                        {l10n["app_contributing_title"]}
                    </Text.span>
                </Row>
            </TouchRipple>
        </Column>
    )
}

function SearchBodyContent({icons}: {icons: IconType[]}) {
    const controller = useContext(PreviewControllerContext);

    if (icons.length != 0) {
        return (
            <Column gap="var(--padding-df)" padding="var(--padding-df)">
                <Text.span>{(l10n["app_search_results"] as string).replace("{0}", icons.length.toString())}</Text.span>
                <Scrollable.Horizontal scrollbar={false}>
                    <Row gap="var(--padding-sm)">
                        <SearchTag text="Users" icon="user" details="" iconCount={12} />
                        <SearchTag text="Sounds" icon="headphone" details="" iconCount={20} />
                        <SearchTag text="Navigations" icon="navigation" details="" iconCount={32} />
                        <SearchTag text="Messages" icon="chat2_line" details="" iconCount={42} />
                        <SearchTag text="Applications" icon="application" details="" iconCount={14} />
                    </Row>
                </Scrollable.Horizontal>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    alignContent="start"
                    alignItems="start"
                    flexShrink="1"
                    columnGap="5px"
                    rowGap="var(--padding-df)"
                    children={icons.map(icon => <SearchBodyContentItem icon={icon} />)}
                />
            </Column>
        )
    } else {
        return (
            <Column align="center" gap="var(--padding-df)" padding="30px">
                <RenderIcon.Name name="search" size="50px" color="var(--foreground2)" />
                <Column align="center">
                    <Text.h3>{l10n["app_search_results_none_title"]}</Text.h3>
                    <Text.span>{l10n["app_search_results_none_description"]}</Text.span>
                </Column>
                <Button.Secondary text={l10n["app_search_results_reset"]} wait={true} onTap={() => controller.iconName = ""} />
            </Column>
        )
    }
}

function SearchBodyContentItem({icon}: {icon: IconType}) {
    const controller = useContext(PreviewControllerContext);
    const countState = useState(0);
    const iconType = controller.iconType;
    const iconSize = controller.iconSize;

    const noneNormal = icon.content.normal == null;
    const noneFilled = icon.content.filled == null;

    if (iconType == PreviewIconType.normal && noneNormal) return <></>;
    if (iconType == PreviewIconType.filled && noneFilled) return <></>;
    
    useEffect(() => {
        controller.addListener((id, event) => {
            if (event == PreviewControllerEvent.iconType
             || event == PreviewControllerEvent.iconSize) countState[1](id);
        });
    });

    return (
        <Column align="center" className="icon-grid_item" gap="5px">
            <Column gap="5px">
                {Object.entries(icon.content).map(([key, innerHTML]) => {
                    if (iconType == PreviewIconType.normal && key != "normal") return;
                    if (iconType == PreviewIconType.filled && key != "filled") return;

                    const isNormal = key == "normal";
                    const isFilled = key == "filled";
                    const iconName = isNormal
                        ? icon.name
                        : icon.name + "-" + key;

                    return (
                        <Invisible size={`calc(${iconSize}px + var(--padding-df) * 2)`}>
                            <Box className="inner" position="relative">
                                <Tooltip message={iconName + ".svg"}>
                                    <TouchRipple onTap={() => PopupPage.open(<IconPopup icon={icon} filled={isFilled} />)}>
                                        <Box
                                            className="icon"
                                            padding="var(--padding-df)"
                                            backgroundColor="var(--rearground)"
                                            children={<RenderIcon size={`${iconSize}px`} innerHTML={innerHTML} />}
                                        />
                                    </TouchRipple>
                                </Tooltip>
                            </Box>
                        </Invisible>
                    )
                })}
            </Column>
            <Text.span
                fontSize="12px"
                maxWidth={`${iconSize + 15}px`}
                textOverflow="ellipsis"
                children={icon.name}
            />
        </Column>
    )
}

function SearchTag({text, icon, details, iconCount}: {
    text: string;
    icon: string;
    details: string;
    iconCount: number;
}) {
    return (
        <Tooltip message={l10n["not_support_yet"]}>
            <TouchRipple onTap={() => {}}>
                <Row
                    align="center"
                    padding="10px var(--padding-df)"
                    border="2px dashed var(--rearground-border)"
                    borderRadius="10px"
                    color="var(--foreground2)"
                    gap="5px"
                >
                    <RenderIcon.Name name={icon} size="16px" />
                    {text}
                    <Box color="var(--foreground4)" fontSize="12px" children={`(${iconCount})`} />
                </Row>
            </TouchRipple>
        </Tooltip>
    )
}

function SearchBodySideBar() {
    return (
        <ConstraintBuilder<boolean>
            constraints={[
                new Constraint(1000, Infinity, true),
                new Constraint(-Infinity, 1000, false)
            ]}
            builder={isExpanded => 
                <SearchBodySideBarInner expanded={isExpanded} />
            }
        />
    )
}

function SearchBodySideBarInner({expanded}: {expanded: boolean}) {
    const countState = useState(0);
    const controller = useContext(PreviewControllerContext);
    const iconSize = controller.iconSize;
    const iconType = controller.iconType;

    useEffect(() => {
        controller.addListener(countState[1]);
    }, []);

    const onBookmarkChange = () => {
        controller.iconOnlyMarked = !controller.iconOnlyMarked
    }

    return (
        <Box flexShrink="0" borderLeft="1px solid var(--rearground-border)">
            <Scrollable.Vertical>
                <AnimatedFoldable.Horizontal visible={expanded} duration="0.3s">
                    <Column>
                        <Row align="centerSpaceBetween" paddingAndGap="var(--padding-df)" borderBottom="1px solid var(--rearground-border)">
                            <Text.h4 fontWeight="normal">{l10n["app_controls_title"]}</Text.h4>
                            <Button.Tertiary text={l10n["reset"]} onTap={() => {
                                controller.iconSize = 32;
                                controller.iconType = PreviewIconType.all;
                                controller.iconOnlyMarked = false;
                            }} />
                        </Row>
                        <Column padding="var(--padding-df)">
                            <Row gap="var(--padding-sm)">
                                <RenderIcon.Name name="control" size="18px" />
                                <Column gap="3px">
                                    <Text.h4 fontWeight="normal">{l10n["app_controls_icon_size_title"]} ({iconSize}px)</Text.h4>
                                    <Text.span fontSize="12px" fontWeight="normal">{l10n["app_controls_icon_size_description"]}</Text.span>
                                </Column>
                            </Row>
                            <Input.Range current={iconSize} min={16} max={48} onChange={v => controller.iconSize = Math.round(v)} />
                        </Column>
                        <Box width="100%" height="1px" backgroundColor="var(--rearground-border)" />
                        <Column padding="var(--padding-df)" gap="var(--padding-sm)">
                            <Row gap="var(--padding-sm)">
                                <RenderIcon.Name name="control" size="18px" />
                                <Column gap="3px">
                                    <Text.h4 fontWeight="normal">{l10n["app_controls_icon_type_title"]}</Text.h4>
                                    <Text.span fontSize="12px" fontWeight="normal">{l10n["app_controls_icon_type_description"]}</Text.span>
                                </Column>
                            </Row>
                            <Input.Select selected={iconType} onChange={v => controller.iconType = v} itemList={[
                                {title: l10n["app_controls_icon_type_all_title"], details: l10n["app_controls_icon_type_all_description"]},
                                {title: l10n["app_controls_icon_type_normal_title"], details: l10n["app_controls_icon_type_normal_description"]},
                                {title: l10n["app_controls_icon_type_filled_title"], details: l10n["app_controls_icon_type_filled_description"]}
                            ]} />
                        </Column>
                        <TouchRipple onTap={onBookmarkChange}>
                            <Column padding="var(--padding-df)" gap="var(--padding-sm)">
                                <Row align="centerLeft" gap="var(--padding-sm)">
                                    <RenderIcon.Name name="control" size="18px" />
                                    <Column gap="3px">
                                        <Text.h4 fontWeight="normal">{l10n["app_controls_icon_only_bookmarked_title"]}</Text.h4>
                                        <Text.span fontSize="12px" fontWeight="normal">{l10n["app_controls_icon_only_bookmarked_description"]}</Text.span>
                                    </Column>
                                    <Input.Switch selected={controller.iconOnlyMarked} />
                                </Row>
                            </Column>
                        </TouchRipple>
                    </Column>
                </AnimatedFoldable.Horizontal>
            </Scrollable.Vertical>
        </Box>
    )
}