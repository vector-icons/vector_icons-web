import Logo from "../assets/favicon.svg";

export function LandingPage() {
    return (
        <>
            <div style={{
                position: "relative",
                display: "flex",
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                flexDirection: "column"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    margin: "auto",
                    gap: "10px",
                    padding: "15px"
                }}>
                    <div style={{width: "100px"}}><Logo /></div>
                    <h1>Vector Icons</h1>
                    <span>This is just icon template that is modern and simply design.</span>
                </div>
                <div>
                    {/** @ts-ignore */}
                    <landing-background />
                </div>
            </div>
        </>
    )
}