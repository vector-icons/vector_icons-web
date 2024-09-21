import { Box, Column, Row, Scrollable, Text } from "@web-package/react-widgets";
import { RenderIcon } from "../../templates/RenderIcon";
import { TouchRipple } from "web-touch-ripple/jsx";
import { l10n } from "../../localization/localization";

export function CreditsPage() {
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
                        <Text.h2>{l10n["app_credits_title"]}</Text.h2>
                        <Text.span>{l10n["app_credits_description"]}</Text.span>
                        <Row gap="5px" padding="5px" borderRadius="5px">
                            <RenderIcon.Name name="mail" size="14px" filled={true} color="var(--foreground4)" />
                            <Text.span fontSize="14px" color="var(--foreground4)">ttankkeo112@gmail.com</Text.span>
                        </Row>
                    </Column>
                </Column>
                <Column width="100%" backgroundColor="var(--rearground)" borderRadius="15px" overflow="hidden">
                    <ContributorProfile
                        displayName="Dev Ttangkong"
                        contribution="Main developer and manager of this project"
                        profileURL="https://avatars.githubusercontent.com/u/122026021?v=4"
                        links={[
                            {name: "GitHub", url: "https://github.com/MTtankkeo"},
                            {name: "Blog", url: "https://mttankkeo.tistory.com/"}
                        ]}
                    />
                    <Line />
                    <ContributorProfile
                        displayName="Axuata"
                        contribution="Japanese translation of this website"
                        profileURL="https://avatars.githubusercontent.com/u/156060902?v=4"
                        links={[
                            {name: "GitHub", url: "https://github.com/axuata"},
                            {name: "X", url: "https://x.com/axuata_x"}
                        ]}
                    />
                </Column>
            </Column>
        </Scrollable.Vertical>
    )
}

function Line() {
    return (
        <Box
            width="100%"
            height="1px"
            backgroundColor="var(--rearground-border)"
            margin="0px var(--padding-df)"
        />
    )
}

function ContributorProfile({displayName, contribution, profileURL, links}: {
    displayName: string;
    contribution: string;
    profileURL: string;
    links: {name: string; url: string}[];
}) {
    return (
        <Row align="centerLeft" gap="var(--padding-df)" padding="var(--padding-df)">
            <img src={profileURL} style={{width: "50px", height: "50px", borderRadius: "50%"}} />
            <Column>
                <Column gap="3px">
                    <Text.h4>{displayName}</Text.h4>
                    <Text.span fontSize="14px">{contribution}</Text.span>
                </Column>
                <Row marginTop="var(--padding-sm)" gap="var(--padding-sm)">
                    {links.map(link => {
                        return (
                            <TouchRipple onTap={() => window.open(link.url)}>
                                <Text.span fontSize="14px" color="var(--primary)">{link.name}</Text.span>
                            </TouchRipple>
                        )
                    })}
                </Row>
            </Column>
        </Row>
    )
}