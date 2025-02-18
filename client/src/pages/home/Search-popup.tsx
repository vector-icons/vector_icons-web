import { AnimatedTransition, Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { Button } from "../../templates/Button";
import { AppContext, IconType } from "../App";
import { Unactive } from "../../templates/Unactive";
import { l10n } from "../../localization/localization";
import { Input } from "../../templates/Input";
import { useContext, useRef, useState } from "preact/hooks";
import { TouchRipple } from "web-touch-ripple/jsx";
import { User } from "../../components/user";
import { Storage } from "../../components/storage";

export function IconPopup({icon, filled}: {
    icon: IconType;
    filled: boolean;
}) {
    const setApp = useContext(AppContext);
    const [isFilled, setFilled] = useState(filled);
    const [isMarked, setMarked] = useState(User.markedIcons.some(name => name == icon.name));
    const [iconSize, setIconSize] = useState(Storage.get<number>("search_popup-icon_size") ?? 64);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const iconName = icon.name;
    const iconHTML = isFilled ? icon.content.filled : icon.content.normal;
    const title = iconName.replace("_", " ").toUpperCase();

    const iconFileName = isFilled
        ? icon.name + "-filled"
        : icon.name;

    const handleDownload = () => {
        const blob = new Blob([iconHTML], {type: "image/svg+xml"});
        const bUrl = URL.createObjectURL(blob);
        const temp = document.createElement('a');
        temp.href = bUrl;
        temp.download = iconFileName;

        document.body.appendChild(temp), temp.click();
        document.body.removeChild(temp);

        URL.revokeObjectURL(bUrl);
        User.downloadedIcons = [...User.downloadedIcons, iconFileName];
    };

    const onMinusIconSize = () => {
        if (iconSize > 14) {
            Storage.set("search_popup-icon_size", iconSize - 1);
            setIconSize(iconSize - 1);
        }
    }

    const onPlusIconSize = () => {
        if (iconSize < 100) {
            Storage.set("search_popup-icon_size", iconSize + 1);
            setIconSize(iconSize + 1);
        }
    }

    const onBookMark = () => {
        if (isMarked) { // 북마크 취소
            User.markedIcons = User.markedIcons.filter(name => name != icon.name);
            setMarked(false);
        } else {
            User.markedIcons = [...User.markedIcons, icon.name];
            setMarked(true);
        }
    }

    return (
        <Box ref={wrapperRef}>
            <Column gap="var(--padding-df)">
                <Row>
                    <Column
                        display="flex"
                        alignItems="center"
                        border="1px solid var(--rearground-border)"
                        borderRadius="15px"
                        align="bottomCenter"
                    >
                        <Box padding="var(--padding-lg)">
                            <Box minWidth="64px" minHeight="64px" display="flex" justifyContent="center" alignItems="center">
                                <RenderIcon.Name name={iconName} filled={isFilled} size={`${iconSize}px`} />
                            </Box>
                        </Box>
                        <Row align="centerSpaceBetween" width="100%">
                            <TouchRipple onTap={onMinusIconSize}>
                                <Box padding="var(--padding-sm)" borderRadius="1e10px">
                                    <RenderIcon.Name name="minus" size="16px" color="var(--foreground3)" />
                                </Box>
                            </TouchRipple>
                            <AnimatedTransition value={iconSize} animation={{
                                duration: "0.3s",
                                fadeIn : {from: {opacity: 0, transform: "translateY(100%)"}, to: {opacity: 1, transform: ""}},
                                fadeOut: {from: {opacity: 1, transform: ""}, to: {opacity: 0, transform: "translateY(-100%)"}}
                            }}>
                                <Text color="var(--foreground3)">{iconSize}</Text>
                            </AnimatedTransition>
                            <TouchRipple onTap={onPlusIconSize}>
                                <Box padding="var(--padding-sm)" borderRadius="1e10px">
                                    <RenderIcon.Name name="plus" size="16px" color="var(--foreground3)" />
                                </Box>
                            </TouchRipple>
                        </Row>
                    </Column>
                    <Column padding="var(--padding-df)">
                        <Row align="centerLeft">
                            <Text.h2>{title}</Text.h2>
                            <TouchRipple onTap={onBookMark}>
                                <Box padding="var(--padding-df)" borderRadius="1e10px" marginLeft="auto">
                                    <AnimatedTransition value={isMarked} animation={{
                                        duration: "0.2s",
                                        fadeIn : {from: {opacity: 0}, to: {opacity: 1}},
                                        fadeOut: {from: {opacity: 1}, to: {opacity: 0}},
                                    }}>
                                        <RenderIcon.Name name="bookmark" size="18px" filled={isMarked} color="var(--foreground3)" />
                                    </AnimatedTransition>
                                </Box>
                            </TouchRipple>
                        </Row>
                        <Input.Select
                            parentRef={wrapperRef}
                            selected={isFilled ? 1 : 0}
                            onChange={(value) => {
                                if (value == 0) setFilled(false);
                                if (value == 1) setFilled(true);
                            }}
                            itemList={[
                                icon.content.normal != null ? {title: l10n["app_search_popup_normal_title"], details: l10n["app_search_popup_normal_description"]} : undefined,
                                icon.content.filled != null ? {title: l10n["app_search_popup_filled_title"], details: l10n["app_search_popup_filled_description"]} : undefined,
                            ].filter(Boolean)}
                        />
                        <Row gap="var(--padding-sm)" marginTop="var(--padding-df)">
                            <Button.Primary text="SVG" icon="import" onTap={handleDownload} />
                            <Unactive>
                                <Button.Primary text="PNG" icon="import" onTap={() => {}} />
                            </Unactive>
                        </Row>
                    </Column>
                </Row>
                <CodeViewer name="HTML" text={iconHTML} />
                <CodeViewer name="NPM" text={`<q-icon name="${iconFileName}" />`} />
            </Column>
        </Box>
    )
}

function CodeViewer({name, text}: {
    name: string;
    text: string;
}) {
    return (
        <Column backgroundColor="var(--popup-rearground)" borderRadius="10px">
            <Column padding="var(--padding-df)" paddingBottom="0px">
                <Text marginBottom="5px">{name}</Text>
                <Box size="100%" maxWidth="400px">
                    <Scrollable.Horizontal>
                        <Box
                            color="var(--foreground3)"
                            children={<Text children={text}/>}
                        />
                    </Scrollable.Horizontal>
                </Box>
            </Column>
            <Row align="centerSpaceBetween">
                <Row align="center" gap="5px" marginLeft="var(--padding-df)">
                    <RenderIcon.Name name="paper" size="14px" color="var(--foreground4)" />
                    <Text.span fontSize="14px">{l10n["app_search_popup_file_size"]}: {new TextEncoder().encode(text).length} byte</Text.span>
                </Row>
                <Button.Tertiary text={l10n["app_search_popup_copy_code"]} icon="copy" onTap={() => {
                    navigator.clipboard.writeText(text);
                }} />
            </Row>
        </Column>
    )
}