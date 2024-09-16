import { Box, Column, Row, Scrollable, Text } from "react-widgets";
import { TouchRipple } from "web-touch-ripple/jsx";
import { RenderIcon } from "../../templates/RenderIcon";
import { Tooltip } from "../../templates/Tooltip";
import { SettingsBinding } from "../../settings/settings_binding";
import { useContext } from "preact/hooks";
import { AppContext } from "../App";
import { l10n } from "../../localization/localization";

export function SettingsPage() {
    const setApp = useContext(AppContext);

    const theme = SettingsBinding.getValue("theme") ?? "system";
    const themeIndex = theme == "system" ? 0
                     : theme == "light" ? 1
                     : theme == "dark" ? 2 : undefined;

    const themeCallback = (index: number) => {
        if (index == 0) {
            SettingsBinding.setValue("theme", null);
            setApp("Update theme to system");
        } else if (index == 1) {
            SettingsBinding.setValue("theme", "light");
            setApp("Update theme to light");
        } else {
            SettingsBinding.setValue("theme", "dark");
            setApp("Update theme to dark");
        }
    }

    const language = SettingsBinding.getValue("language") ?? "system";
    const languageIndex = language == "system" ? 0
                        : language == "en-US" ? 1
                        : language == "ko-KR" ? 2 : undefined;

    const languageCallback = (index: number) => {
        if (index == 0) {
            SettingsBinding.setValue("language", null);
            setApp("Update language to system");
        } else if (index == 1) {
            SettingsBinding.setValue("language", "en-US");
            setApp("Update language to en-US");
        } else if (index == 2) {
            SettingsBinding.setValue("language", "ko-KR");
            setApp("Update language to ko-KR");
        }
    }

    return (
        <Scrollable.Vertical>
            <Column>
                <Column gap="5px" padding="var(--padding-lg)" borderBottom="1px solid var(--rearground-border)">
                    <Text.h2>{l10n["app_settings_title"]}</Text.h2>
                    <Text.span>{l10n["app_settings_description"]}</Text.span>
                </Column>
                <Column padding="var(--padding-lg)" gap="var(--padding-lg)">
                    <Column gap="var(--padding-df)">
                        <Row align="centerLeft" gap="15px">
                            <RenderIcon.Name name="control" size="18px" />
                            <Text.h3>Theme</Text.h3>
                        </Row>
                        <SettingsSelect index={themeIndex} onChange={themeCallback} items={[
                            {text: "System", details: "Apply the current browser or device theme."},
                            {text: "Light"},
                            {text: "Dark"}
                        ]} />
                    </Column>
                    <Column gap="var(--padding-df)">
                        <Row align="centerLeft" gap="15px">
                            <RenderIcon.Name name="control" size="18px" />
                            <Text.h3>Language</Text.h3>
                        </Row>
                        <SettingsSelect index={languageIndex} onChange={languageCallback} items={[
                            {text: "System", details: "Apply the current browser language."},
                            {text: "English"},
                            {text: "Korean"},
                            {text: "Japanese", details: l10n["not_support_yet"]}
                        ]} />
                    </Column>
                </Column>
            </Column>
        </Scrollable.Vertical>
    )
}

function SettingsSelect({index, items, onChange}: {
    index: number;
    items: {text: string; details?: string}[];
    onChange: (index: number) => void;
}) {
    return (
        <Scrollable.Horizontal scrollbar={false}>
            <Row>
                {items.map((item, i) => {
                    return (
                        <Tooltip message={item.details}>
                            <TouchRipple onTap={() => onChange(i)}>
                                <Box
                                    padding="var(--padding-df)"
                                    backgroundColor={i == index ? "var(--rearground)" : undefined}
                                    borderRadius="10px"
                                    children={item.text}
                                />
                            </TouchRipple>
                        </Tooltip>
                    )
                })}
            </Row>
        </Scrollable.Horizontal>
    )
}