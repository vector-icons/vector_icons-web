import { Box, Column, Row, Text } from "@web-package/react-widgets";
import { Input } from "../../templates/Input";
import { Button } from "../../templates/Button";
import { l10n } from "../../localization/localization";
import { TouchRipple } from "web-touch-ripple/jsx";
import { RouterBinding } from "@web-package/react-widgets-router";
import { Unactive } from "../../templates/Unactive";

export function SignUpPage() {
    return (
        <Box size="100%" display="flex" justifyContent="center" alignItems="center">
            <Column gap="var(--padding-lg)" padding="var(--padding-lg)" backgroundColor="var(--rearground)" borderRadius="15px">
                <Column gap="3px">
                    <Text.h2 fontSize="32px">{l10n["sign_up"]}</Text.h2>
                    <span>Sign up to experience more features!</span>
                </Column>
                <Column gap="var(--padding-sm)" width="320px">
                    <Input.PrimaryText placeholder="Email" type="email" />
                    <Input.PrimaryText placeholder="Alias" />
                    <Input.PrimaryText placeholder="Password" type="password" />
                </Column>
                <Column gap="var(--padding-df)">
                    <Text.span>0/2</Text.span>
                    <ProgressRange percent={0} />
                </Column>
                <Row gap="var(--padding-df)" align="centerSpaceBetween">
                    <TouchRipple onTap={() => RouterBinding.instance.push("/sign-in")}>
                        <Text.span fontSize="14px">Sign In</Text.span>
                    </TouchRipple>
                    <Unactive>
                        <Button.Primary text="Next" onTap={() => {}} />
                    </Unactive>
                </Row>
            </Column>
        </Box>
    )
}

export function ProgressRange({percent}: {
    percent: number;
}) {
    return (
        <Box gap="var(--padding-df)" borderRadius="1e10px" backgroundColor="var(--rearground-in-background)">
            <Box
                width={`${percent * 100}%`}
                height="5px"
                backgroundColor="var(--primary)"
                transitionProperty="width"
                transitionDuration="0.3s"
            />
        </Box>
    )
}