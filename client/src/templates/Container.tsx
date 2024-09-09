import { ReactNode } from "preact/compat";
import { Box } from "react-widgets";

export function Container({children, expanded = false}: {
    children: ReactNode;
    expanded?: boolean;
}) {
    return (
        <Box
            backgroundColor="var(--rearground)"
            padding="var(--padding-df)"
            borderRadius="15px"
            flexShrink={expanded ? 1 : 0}
            children={children}
        />
    )
}