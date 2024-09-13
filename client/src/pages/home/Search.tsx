import { AnimatedFoldable, Box, Column, Constraint, ConstraintBuilder, Expanded, Row, Scrollable, Text } from "react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { Icons, IconType } from "../App";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Container } from "../../templates/Container";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { Input } from "../../templates/Input";
import { createContext } from "preact";
import * as Fuse from "fuse.js";
import { Button } from "../../templates/Button";
import { SettingsBinding } from "../../settings/settings_binding";
import { Tooltip } from "../../templates/Tooltip";
import { l10n } from "../../localization/localization";

const PreviewControllerContext = createContext<PreviewController>(null);

type PreviewControllerListener = (id: number) => void;

enum PreviewIconType {
    all,
    normal,
    filled,
}

class PreviewController {
    _iconSize: number;
    _iconName: string;
    _iconType: PreviewIconType;

    constructor(iconSize: number, iconName: string, iconType: PreviewIconType) {
        this._iconSize = iconSize;
        this._iconName = iconName;
        this._iconType = iconType;
    };

    count: number = 0;
    listeners: PreviewControllerListener[] = [];

    get iconSize() { return this._iconSize; }
    set iconSize(newValue: number) {
        if (this._iconSize != newValue) {
            this._iconSize = newValue;
            this.notifyListeners();
        }
    }

    get iconName() { return this._iconName; }
    set iconName(newValue: string) {
        if (this._iconName != newValue) {
            this._iconName = newValue;
            this.notifyListeners();
        }
    }

    get iconType() { return this._iconType; }
    set iconType(newValue: PreviewIconType) {
        if (this._iconType != newValue) {
            this._iconType = newValue;
            this.notifyListeners();
        }
    }

    addListener(listener: PreviewControllerListener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.count += 1));
    }
}

export function SearchPage() {
    const [controller, _] = useState(new PreviewController(32, "", PreviewIconType.all));

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
    const [theme, setTheme] = useState(document.body.className == "dark" ? "dark" : "light");
    const isDark = theme == "dark";

    useEffect(() => {
        document.body.className = isDark ? "dark" : "";
    }, [theme]);

    return (
        <Tooltip message={isDark ? l10n["app_setting_to_light"] : l10n["app_setting_to_dark"]}>
            <TouchRipple onTap={() => {
                SettingsBinding.setValue("theme", isDark ? "light" : "dark");

                // Needs to update this components state.
                setTheme(isDark ? "light" : "dark");
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
    const wrapperRef = useRef<HTMLInputElement>(null);
    const controller = useContext(PreviewControllerContext);

    return (
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
    )
}

function SearchBody() {
    const countState = useState(0);
    const controller = useContext(PreviewControllerContext);

    useEffect(() => controller.addListener(countState[1]), []);

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

    return (
        <Scrollable.Vertical>
            <Column>
                <Column padding="30px" gap="var(--padding-df)" borderBottom="1px solid var(--rearground-border)">
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
                <SearchBodyContent icons={icons} controller={controller} />
            </Column>
        </Scrollable.Vertical>
    )
}

function SearchBodyContent({icons, controller}: {
    icons: IconType[];
    controller: PreviewController;
}) {
    if (icons.length != 0) {
        const iconSize = controller.iconSize;
        const iconType = controller.iconType;

        return (
            <Column gap="var(--padding-df)" padding="var(--padding-df)">
                <Text.span>{(l10n["app_search_results"] as string).replace("{0}", icons.length.toString())}</Text.span>
                <Scrollable.Horizontal>
                    <Row gap="var(--padding-sm)">
                        <SearchTag text="Users" details="" iconCount={12} />
                        <SearchTag text="Sounds" details="" iconCount={20} />
                        <SearchTag text="Navigations" details="" iconCount={32} />
                        <SearchTag text="Messages" details="" iconCount={42} />
                        <SearchTag text="Applications" details="" iconCount={14} />
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
                >{
                    icons.map(icon => {
                        const noneNormal = icon.content.normal == null;
                        const noneFilled = icon.content.filled == null;

                        if (iconType == PreviewIconType.normal && noneNormal) return <></>;
                        if (iconType == PreviewIconType.filled && noneFilled) return <></>;

                        return (
                            <Column align="center" className="icon-grid_item" gap="5px">
                                <Column gap="5px">
                                    {Object.entries(icon.content).map(([key, innerHTML]) => {
                                        if (iconType == PreviewIconType.normal && key != "normal") return;
                                        if (iconType == PreviewIconType.filled && key != "filled") return;

                                        const iconName = key == "normal"
                                            ? icon.name
                                            : icon.name + "-" + key;

                                        const handleDownload = () => {
                                            const blob = new Blob([innerHTML], {type: "image/svg+xml"});
                                            const bUrl = URL.createObjectURL(blob);
                                            const temp = document.createElement('a');
                                            temp.href = bUrl;
                                            temp.download = iconName;

                                            document.body.appendChild(temp), temp.click();
                                            document.body.removeChild(temp);

                                            URL.revokeObjectURL(bUrl);
                                        };

                                        return (
                                            <Tooltip message={iconName + ".svg"}>
                                                <TouchRipple onTap={handleDownload}>
                                                    <Box
                                                        padding="var(--padding-df)"
                                                        backgroundColor="var(--rearground)"
                                                        borderRadius="50%"
                                                        children={<RenderIcon size={`${iconSize}px`} innerHTML={innerHTML} />}
                                                    />
                                                </TouchRipple> 
                                            </Tooltip>
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
                    })
                }</Box>
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

function SearchTag({text, details, iconCount}: {
    text: string;
    details: string;
    iconCount: number;
}) {
    return (
        <Tooltip message={l10n["not_support_yet"]}>
            <TouchRipple onTap={() => {}}>
                <Row
                    padding="10px var(--padding-df)"
                    border="2px dashed var(--rearground-border)"
                    borderRadius="10px"
                    color="var(--foreground2)"
                    gap="5px"
                >
                    {"#" + text}
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

    return (
        <Box flexShrink="0" borderLeft="1px solid var(--rearground-border)">
            <Scrollable.Vertical>
                <AnimatedFoldable.Horizontal visible={expanded} duration="0.3s">
                    <Column padding="var(--padding-df)" gap="var(--padding-df)">
                        <Column>
                            <Row gap="var(--padding-sm)">
                                <RenderIcon.Name name="control" size="18px" />
                                <Column gap="3px">
                                    <Text.h4 fontWeight="normal">{l10n["app_controls_icon_size_title"]} ({iconSize}px)</Text.h4>
                                    <Text.span fontSize="12px" fontWeight="normal">{l10n["app_controls_icon_size_description"]}</Text.span>
                                </Column>
                            </Row>
                            <Input.Range current={iconSize} min={12} max={48} onChange={v => controller.iconSize = Math.round(v)} />
                        </Column>
                        <Box width="100%" height="1px" backgroundColor="var(--rearground-border)" />
                        <Column gap="var(--padding-sm)">
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
                    </Column>
                </AnimatedFoldable.Horizontal>
            </Scrollable.Vertical>
        </Box>
    )
}