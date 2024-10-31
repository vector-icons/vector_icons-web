import { Box, Column, Row, Text } from "@web-package/react-widgets";
import { Button } from "../../templates/Button";
import { Input } from "../../templates/Input";
import { l10n } from "../../localization/localization";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Unactive } from "../../templates/Unactive";

import GoogleLogo from "../../assets/icons/google_logo.svg";
import GitHubLogo from "../../assets/icons/github_logo.svg";
import { RouterBinding } from "@web-package/react-widgets-router";
import { Area } from "../../templates/Area";

export function SignInPage() {
    return (
        <Area>
            <Column gap="var(--padding-lg)">
                <Column gap="3px">
                    <Text.h2 fontSize="32px">{l10n["sign_in"]}</Text.h2>
                    <span>{l10n["sign-in"]["description"]}</span>
                </Column>
                <Column gap="var(--padding-sm)" width="320px">
                    <Input.PrimaryText placeholder={l10n["email_or_alias"]} type="email" />
                    <Input.PrimaryText placeholder={l10n["password"]} type="password" />
                </Column>
                <Box position="relative" width="100%" height="1px" backgroundColor="var(--rearground-border)">
                    <Text.span
                        position="absolute"
                        left="50%"
                        top="50%"
                        transform="translate(-50%, -50%)"
                        padding="var(--padding-sm)"
                        backgroundColor="var(--rearground)"
                        children={"OR"}
                    />
                </Box>
                <Column gap="var(--padding-sm)">
                    <TouchRipple onTap={() => {}}>
                        <Row align="centerLeft" paddingAndGap="var(--padding-df)" backgroundColor="var(--rearground-in-background)" borderRadius="10px">
                            <GoogleLogo width="24px" />
                            <Text>Sign in with Google</Text>
                        </Row>
                    </TouchRipple>
                    <TouchRipple onTap={() => {}}>
                        <Row align="centerLeft" paddingAndGap="var(--padding-df)" backgroundColor="var(--rearground-in-background)" borderRadius="10px">
                            <GitHubLogo width="24px" />
                            <Text>Sign in with GitHub</Text>
                        </Row>
                    </TouchRipple>
                </Column>
                <Row gap="var(--padding-df)" align="centerSpaceBetween">
                    <TouchRipple onTap={() => RouterBinding.instance.push("/sign-up")}>
                        <Text.span fontSize="14px">{l10n["sign_up"]}</Text.span>
                    </TouchRipple>
                    <Unactive>
                        <Button.Primary text={l10n["done"]} onTap={() => {}} />
                    </Unactive>
                </Row>
            </Column>
        </Area>
    )
}