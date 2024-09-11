import { TouchRipple } from "web-touch-ripple/jsx"

export namespace Button {
    export function Primary({text, onTap}: {
        text: string,
        onTap: VoidFunction
    }) {
        return (
            <button className="primary" onClick={onTap}>{text}</button>
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