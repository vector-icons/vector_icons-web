import { TouchRipple } from "web-touch-ripple/jsx"
import { RenderIcon } from "./RenderIcon"

export namespace Button {
    export function Primary({text, icon, onTap}: {
        text: string,
        icon?: string,
        onTap: VoidFunction
    }) {
        return (
            <button className="primary" onClick={onTap}>
                {icon ? <RenderIcon.Name size="18px" name={icon} /> : <></>}
                {text}
            </button>
        )
    }

    export function Secondary({text, wait = false, onTap}: {
        text: string,
        wait?: boolean,
        onTap: VoidFunction
    }) {
        return (
            <TouchRipple onTap={onTap} wait={wait}>
                <button className="secondary">{text}</button>
            </TouchRipple>
        )
    }
}