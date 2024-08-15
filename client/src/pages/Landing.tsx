import Logo from "../assets/favicon.svg";

export function LandingPage() {
    return (
        <>
            <div style={{
                display: "flex",
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                flexDirection: "column"
            }}>
                <div style={{margin: "auto"}}>
                    <div style={{width: "100px"}}><Logo /></div>
                    <h1>Vector Icons</h1>
                    <span></span>
                </div>
            </div>
            <div>hello world</div>
        </>
    )
}