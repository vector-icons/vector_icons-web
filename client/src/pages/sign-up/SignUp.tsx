import { AnimatedSize, AnimatedTransition, Box, Column, Row, Text } from "@web-package/react-widgets";
import { Input } from "../../templates/Input";
import { Button } from "../../templates/Button";
import { l10n } from "../../localization/localization";
import { TouchRipple } from "web-touch-ripple/jsx";
import { RouterBinding } from "@web-package/react-widgets-router";
import { Unactive } from "../../templates/Unactive";
import { useState } from "preact/hooks";
import { Test } from "../../components/test";
import { CSSProperties } from "preact/compat";

enum SignUpStatus {
    INFO,
    AUTH
}

export function SignUpPage() {
    const [status, setStatus] = useState(SignUpStatus.INFO);
    const [email, setEmail] = useState<string>("");
    const [alias, setAlias] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const isNextable = Test.isEmail(email) && alias != "" && password != "";
    const NextButton = () => (
        <Button.Primary text="Next" onTap={() => {
            if (status == SignUpStatus.INFO) setStatus(SignUpStatus.AUTH);
        }} />
    );

    return (
        <Box size="100%" display="flex" justifyContent="center" alignItems="center">
            <Column gap="var(--padding-lg)" padding="var(--padding-lg)" backgroundColor="var(--rearground)" borderRadius="15px">
                <Column gap="3px">
                    <Text.h2 fontSize="32px">{l10n["sign_up"]}</Text.h2>
                    {
                        status == SignUpStatus.INFO
                            ? <span>Enter the user information you want to create.</span>
                            : <span>Enter the emailed authentication number</span>
                    }
                </Column>
                <AnimatedSize duration="0.5s">
                    <AnimatedTransition value={status} animation={{
                        duration: "0.5s",
                        fadeIn : {from: {transform: "translateX(100%)", opacity: "0"}, to: {transform: "translateX(0px)" , opacity: "1"}},
                        fadeOut: {from: {transform: "translateX(0px)" , opacity: "1"}, to: {transform: "translateX(-100%)", opacity: "0"}}
                    }}>
                        <Column width="100%" gap="var(--padding-sm)">
                            {
                                status == SignUpStatus.INFO
                                    ?
                                    <>
                                        <Input.PrimaryText key="email" onChange={setEmail} placeholder="Email" type="email" />
                                        <Input.PrimaryText key="alias" onChange={setAlias} placeholder="Alias" />
                                        <Input.PrimaryText key="password" onChange={setPassword} placeholder="Password" type="password" />
                                    </>
                                    :
                                    <>
                                        <Input.PrimaryText key="auth-numbers" placeholder="Auth Numbers" />
                                    </>
                            }
                        </Column>
                    </AnimatedTransition>
                </AnimatedSize>
                <Column gap="var(--padding-df)">
                    <Text.span>0/2</Text.span>
                    <ProgressRange percent={status == SignUpStatus.INFO ? 0 : 0.5} />
                </Column>
                <Row gap="var(--padding-df)" align="centerSpaceBetween">
                    <TouchRipple onTap={() => RouterBinding.instance.push("/sign-in")}>
                        <Text.span fontSize="14px">Sign In</Text.span>
                    </TouchRipple>
                    {isNextable ? <NextButton /> : <Unactive children={<NextButton />} />}
                </Row>
            </Column>
        </Box>
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