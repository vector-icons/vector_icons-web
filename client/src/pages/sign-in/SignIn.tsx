import { AnimatedFoldable, Box, Column, Row, Text } from "@web-package/react-widgets";
import { Button } from "../../templates/Button";
import { Input } from "../../templates/Input";
import { l10n } from "../../localization/localization";
import { TouchRipple } from "web-touch-ripple/jsx";
import { Unactive } from "../../templates/Unactive";
import { RouterBinding } from "@web-package/react-widgets-router";
import { Area } from "../../templates/Area";

import GoogleLogo from "../../assets/icons/google_logo.svg";
import GitHubLogo from "../../assets/icons/github_logo.svg";
import { useEffect, useState } from "preact/hooks";
import { Test } from "../../components/test";
import { User } from "../../components/user";

export function SignInPage() {
    const [emailOrEmail, setEmailOrAlias] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const NextButton = () => (
        <Button.Primary text={l10n["done"]} onTap={async () => {
            setLoading(true);
            const result = await fetch("/api/sign-in", {
                method: "POST",
                body: JSON.stringify(
                    Test.isEmail(emailOrEmail)
                        ? { email: emailOrEmail, password }
                        : { alias: emailOrEmail, password }
                )
            });
            setLoading(false);

            if (result.status == 200) {
                User.signIn(await result.json());

                // Move to application page when after sccessful sign-in the user.
                RouterBinding.instance.push("/app");
            } else {
                result.text().then(setError);
            }
        }} />
    )

    const isNextable = emailOrEmail != "" && password != "";

    useEffect(() => setError(null), [emailOrEmail, password]);

    return (
        <Area.Body loading={isLoading}>
            <Column minWidth="320px" gap="var(--padding-lg)">
                <Column>
                    <Column gap="3px">
                        <Text.h2 fontSize="32px">{l10n["sign_in"]}</Text.h2>
                        <span>{l10n["sign-in"]["description"]}</span>
                    </Column>
                    <AnimatedFoldable.Vertical visible={error != null} duration="0.3s">
                        <Area.Message content={error != null ? l10n["sign-in"][error] ?? l10n["unknown_exception_message"] : ""} />
                    </AnimatedFoldable.Vertical>
                </Column>
                <Column gap="var(--padding-sm)" width="100%">
                    <Input.PrimaryText placeholder={l10n["email_or_alias"]} onChange={setEmailOrAlias} type="email" />
                    <Input.PrimaryText placeholder={l10n["password"]} onChange={setPassword} type="password" />
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
                    {isNextable ? <NextButton /> : <Unactive><NextButton /></Unactive>}
                </Row>
            </Column>
        </Area.Body>
    )
}