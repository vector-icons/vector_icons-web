import { Box, Column, Row, Text } from "@web-package/react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { Button } from "../../templates/Button";
import { IconType } from "../App";
import { Unactive } from "../../templates/Unactive";
import { l10n } from "../../localization/localization";
import { Input } from "../../templates/Input";
import { useRef, useState } from "preact/hooks";

export function IconPopup({icon, filled}: {
    icon: IconType;
    filled: boolean;
}) {
    const [isFilled, setFilled] = useState(filled);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const iconName = icon.name;
    const iconHTML = filled ? icon.content.filled : icon.content.normal;
    const title = iconName.replace("_", " ").toUpperCase();

    const iconFile = filled
        ? icon.name + "-filled"
        : icon.name;

    const handleDownload = () => {
        const blob = new Blob([iconHTML], {type: "image/svg+xml"});
        const bUrl = URL.createObjectURL(blob);
        const temp = document.createElement('a');
        temp.href = bUrl;
        temp.download = iconFile;

        document.body.appendChild(temp), temp.click();
        document.body.removeChild(temp);

        URL.revokeObjectURL(bUrl);
    };

    return (
        <Box ref={wrapperRef}>
            <Column gap="var(--padding-df)">
                <Row>
                    <Box
                        display="flex"
                        alignItems="center"
                        padding="var(--padding-lg)"
                        border="1px solid var(--rearground-border)"
                        borderRadius="15px"
                    >
                        <RenderIcon.Name name={iconName} filled={isFilled} size="64px" />
                    </Box>
                    <Column padding="var(--padding-df)">
                        <Text.h2 marginBottom="5px">{title}</Text.h2>
                        <Input.Select
                            parentRef={wrapperRef}
                            selected={isFilled ? 1 : 0}
                            onChange={(value) => {
                                if (value == 0) setFilled(false);
                                if (value == 1) setFilled(true);
                            }}
                            itemList={[
                                {title: l10n["app_search_popup_normal_title"], details: l10n["app_search_popup_normal_description"]},
                                {title: l10n["app_search_popup_filled_title"], details: l10n["app_search_popup_filled_description"]}
                            ]}
                        />
                        <Row gap="var(--padding-sm)" marginTop="var(--padding-df)">
                            <Button.Primary text="SVG" icon="import" onTap={handleDownload} />
                            <Unactive>
                                <Button.Primary text="PNG" icon="import" onTap={() => {}} />
                            </Unactive>
                        </Row>
                    </Column>
                </Row>
                <CodeBlock text={iconHTML} />
            </Column>
        </Box>
    )
}

function CodeBlock({text}: {
    text: string;
}) {
    return (
        <Column padding="var(--padding-df)" backgroundColor="var(--rearground)" borderRadius="10px">
            <Text marginBottom="5px">HTML</Text>
            <Box position="relative">
                <Box
                    maxWidth="400px"
                    maxHeight="100px"
                    fontSize="14px"
                    color="var(--foreground3)"
                    wordBreak="break-all"
                    overflow="hidden"
                    children={<Text children={text}/>}
                />
                <Box
                    position="absolute"
                    size="100%"
                    top="0px"
                    background="linear-gradient(0deg, var(--rearground) 0%, var(--rearground) 10%, transparent 100%)"
                />
            </Box>
            <Row align="centerSpaceBetween">
                <Row align="center" gap="5px">
                    <RenderIcon.Name name="information" size="14px" color="var(--foreground3)" />
                    <Text.span fontSize="14px">{l10n["app_search_popup_file_size"]}: {new TextEncoder().encode(text).length} byte</Text.span>
                </Row>
                <Button.Tertiary text={l10n["app_search_popup_copy_code"]} icon="code" onTap={() => {
                    navigator.clipboard.writeText(text);
                }} />
            </Row>
        </Column>
    )
}