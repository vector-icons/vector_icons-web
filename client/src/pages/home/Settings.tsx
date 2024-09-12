import { Column, Scrollable, Text } from "react-widgets";

export function SettingsPage() {
    return (
        <Scrollable.Vertical>
            <Column padding="var(--padding-lg)">
                <Text.h2>Settings</Text.h2>
                <Text.span>Set the overall functionality of this website.</Text.span>
            </Column>
        </Scrollable.Vertical>
    )
}