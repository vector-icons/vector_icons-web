import { ReactNode } from "preact/compat";
import { Box } from "react-widgets";

export function Container({children}: {
    children: ReactNode
}) {
    return (
        <Box
            backgroundColor="var(--rearground)"
            padding="var(--padding-df)"
            border="1px solid var(--rearground-border)"
            borderRadius="5px"
            children={children}
        />
    )
}