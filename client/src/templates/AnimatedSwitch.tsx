import { ReactNode } from "preact/compat";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Switch, useLocation } from "wouter";

export function AnimatedSwitch({children}: {
    children: ReactNode
}) {
    const [location, _] = useLocation();

    return (
        <TransitionGroup style={{display: "contents"}}>
            <CSSTransition key={location} classNames="page-transition" timeout={300}>
                <Switch location={location} children={children} />
            </CSSTransition>
        </TransitionGroup>
    )
}