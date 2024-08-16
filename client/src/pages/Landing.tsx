import { Box } from "react-widgets";

import Logo from "../assets/favicon.svg";

export function LandingPage() {
    return (
        <>
            <Box
                position="relative"
                display="flex"
                width="100%"
                height="100vh"
                justifyContent="center"
                flexDirection="column"
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    margin="auto"
                    gap="10px"
                    padding="15px"
                >
                    <Box width="100px"><Logo /></Box>
                    <h1>Vector Icons</h1>
                    <span>This is just icon template that is modern and simply design.</span>
                </Box>
                <Box position="absolute" size="100%" zIndex="-1">
                    {/** @ts-ignore */}
                    <landing-background />
                </Box>
                <Box 
                    position="absolute"
                    width="100%"
                    height="100%"
                    zIndex="-1"
                    background="linear-gradient(0deg, black 20%, transparent)"
                />
            </Box>
            {
                Array.from({length: 100}).map((_, index) => {
                    return (
                        <div>Hello, World! {index}</div>
                    )
                })
            }
        </>
    )
}