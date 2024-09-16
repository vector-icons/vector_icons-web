import { ReactNode } from "preact/compat";
import { Box } from "@web-package/react-widgets";

export function Unactive({children}: {children: ReactNode}) {
    return (
        <Box opacity="0.5" pointerEvents="none" userSelect="none" children={children} />
    )
}