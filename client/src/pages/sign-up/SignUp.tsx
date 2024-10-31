import { AnimatedFoldable, AnimatedSize, AnimatedTransition, Box, Column, Row, Text } from "@web-package/react-widgets";
import { Input } from "../../templates/Input";
import { Button } from "../../templates/Button";
import { l10n } from "../../localization/localization";
import { TouchRipple } from "web-touch-ripple/jsx";
import { RouterBinding } from "@web-package/react-widgets-router";
import { Unactive } from "../../templates/Unactive";
import { useEffect, useRef, useState } from "preact/hooks";
import { Test } from "../../components/test";
import { CSSProperties } from "preact/compat";
import { RenderIcon } from "../../templates/RenderIcon";
import { User, UserAccount } from "../../components/user";
import { Loading } from "../../templates/Loading";
import { Area } from "../../templates/Area";

enum SignUpStatus {
    INFO,
    AUTH
}

export function SignUpPage() {
    const [status, setStatus] = useState(SignUpStatus.INFO);
    const [email, setEmail] = useState<string>("");
    const [alias, setAlias] = useState<string>("");
    const [error, setError] = useState<string>(null);
    const [password, setPassword] = useState<string>("");
    const [authNums, setAuthNums] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(false);
    const authIdRef = useRef<string>(null);
    const authId = authIdRef.current; // Authorization UUID

    const isNextable = error != null ? false : Test.isEmail(email) && alias != "" && password != "";
    const NextButton = () => (
        <Button.Primary text={status == SignUpStatus.INFO ? l10n["next"] : l10n["done"]} onTap={async () => {
            if (status == SignUpStatus.INFO) {
                setLoading(true);
                const result = await fetch("/api/sign-up", {method: "POST", body: JSON.stringify({
                    email: email,
                    alias: alias,
                    password: password
                })});
                setLoading(false);

                if (result.status == 200) {
                    // Sets Authorization UUID for finishing sign-up.
                    authIdRef.current = await result.text();
                    setStatus(SignUpStatus.AUTH);
                } else {
                    result.text().then(setError);
                } 
            }

            if (status == SignUpStatus.AUTH) {
                setLoading(true);
                const result = await fetch(`/api/sign-up/auth?uuid=${authId}`, {
                    method: "POST",
                    body: JSON.stringify({numbers: authNums}
                )});
                setLoading(false);

                if (result.status == 200) {
                    User.signIn(await result.json());

                    // Move to application page when after sccessful sign-up the user.
                    RouterBinding.instance.push("/app");
                } else {
                    result.text().then(setError);
                }
            }
        }} />
    );

    // Clears the errors when a user retyping to the information.
    useEffect(() => setError(null), [email, alias, password, authNums]);

    return (
        <Area loading={isLoading}>
            <Column gap="var(--padding-lg)">
                <Column>
                    <Column gap="3px">
                        <Text.h2 fontSize="32px">{l10n["sign_up"]}</Text.h2>
                        {
                            status == SignUpStatus.INFO
                                ? <span>{l10n["sign-up"]["info_description"]}</span>
                                : <span>{l10n["sign-up"]["auth_description"]}</span>
                        }
                    </Column>
                    <AnimatedFoldable.Vertical visible={error != null} duration="0.3s">
                        <Box paddingTop="var(--padding-df)">
                            <Row
                                gap="var(--padding-sm)"
                                align="center"
                                padding="var(--padding-df)"
                                backgroundColor="var(--rearground-in-background)"
                                borderRadius="10px"
                            >
                                <RenderIcon.Name name="information" size="16px" />
                                {l10n["sign-up"][error] ?? l10n["unknown_exception_message"]}
                            </Row>
                        </Box>
                    </AnimatedFoldable.Vertical>
                </Column>
                <AnimatedSize duration="0.5s">
                    <AnimatedTransition value={status} animation={{
                        duration: "0.5s",
                        fadeIn : {from: {transform: "translateX(100%)", opacity: "0"}, to: {transform: "translateX(0px)"  , opacity: "1"}},
                        fadeOut: {from: {transform: "translateX(0px)" , opacity: "1"}, to: {transform: "translateX(-100%)", opacity: "0"}}
                    }}>
                        <Column width="100%" gap="var(--padding-sm)">
                            {
                                status == SignUpStatus.INFO
                                    ?
                                    <>
                                        <Input.PrimaryText key="email" onChange={setEmail} placeholder={l10n["email"]} type="email" />
                                        <Input.PrimaryText key="alias" onChange={setAlias} placeholder={l10n["alias"]} />
                                        <Input.PrimaryText key="password" onChange={setPassword} placeholder={l10n["password"]} type="password" />
                                    </>
                                    :
                                    <>
                                        <Input.PrimaryText key="auth-numbers" onChange={setAuthNums} placeholder={l10n["auth_numbers"]} />
                                    </>
                            }
                        </Column>
                    </AnimatedTransition>
                </AnimatedSize>
                <Column gap="var(--padding-df)">
                    <Text.span>{status == SignUpStatus.AUTH ? "1" : "0"}/2</Text.span>
                    <ProgressRange percent={status == SignUpStatus.INFO ? 0 : 0.5} />
                </Column>
                <Row gap="var(--padding-df)" align="centerSpaceBetween">
                    <TouchRipple onTap={() => RouterBinding.instance.push("/sign-in")}>
                        <Text.span fontSize="14px">{l10n["sign_in"]}</Text.span>
                    </TouchRipple>
                    {isNextable ? <NextButton /> : <Unactive children={<NextButton />} />}
                </Row>
            </Column>
        </Area>
    )
}

export function ProgressRange({percent}: {
    percent: number;
}) {
    return (
        <Box gap="var(--padding-df)" borderRadius="1e10px" backgroundColor="var(--rearground-in-background)" overflow="hidden">
            <Box
                width={`${percent * 100}%`}
                height="5px"
                backgroundColor="var(--primary)"
                transitionProperty="width"
                transitionDuration="0.5s"
            />
        </Box>
    )
}