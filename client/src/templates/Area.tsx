import { Box } from "@web-package/react-widgets";
import { ReactNode } from "preact/compat";
import { Loading } from "./Loading";

export function Area({loading = false, children}: {
    loading?: boolean;
    children: ReactNode;
}) {
    return (
        <Box display="flex" size="100%" boxSizing="border-box" padding="var(--padding-df)">
            <Box
                position="relative"
                size="100%"
                maxWidth="max-content"
                maxHeight="max-content"
                margin="auto"
                padding="var(--padding-lg)"
                backgroundColor="var(--rearground)"
                borderRadius="15px"
                boxSizing="border-box"
                overflowY="auto"
            >
                <Box pointerEvents={loading ? "none" : undefined} children={children} />
                <Box
                    pointerEvents="none"
                    position="absolute"
                    display="flex"
                    size="100%"
                    left="0px"
                    top="0px"
                    justifyContent="center"
                    alignItems="center"
                    opacity={loading ? "1" : "0"}
                    transitionProperty="opacity, background-color"
                    transitionDuration="0.3s"
                    backgroundColor={loading ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0)"}
                    children={<Loading.Circle size="40px" />}
                />
            </Box>
        </Box>
    )
}