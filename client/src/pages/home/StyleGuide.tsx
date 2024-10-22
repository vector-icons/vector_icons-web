import { Column, Scrollable, Text } from "@web-package/react-widgets";
import { l10n } from "../../localization/localization";

export function StyleGuidePage() {
    return (
        <Scrollable.Vertical>
            <Column
                gap="var(--padding-lg)"
                align="center"
                margin="var(--padding-lg) auto"
                padding="var(--padding-lg)"
                maxWidth="1000px"
            >
                <Column gap="var(--padding-df)">
                    <Column gap="var(--padding-df)">
                        <Text.h2>{l10n["app_style_guide"]}</Text.h2>
                        <span>Srroy, this page is still being prepared... Therefore please take <a href="https://github.com/vector-icons/vector_icons-assets">vector_icons-assets</a> detour to A for your reference.</span>
                    </Column>
                </Column>
            </Column>
        </Scrollable.Vertical>
    )
}