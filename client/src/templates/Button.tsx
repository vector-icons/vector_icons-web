import { TouchRipple } from "web-touch-ripple/jsx"

export namespace Button {
    export function Primary({text, wait = false, onTap}: {
        text: string,
        wait?: boolean,
        onTap: VoidFunction
    }) {
        return (
            <TouchRipple onTap={onTap} wait={wait}>
                <button className="primary">{text}</button>
            </TouchRipple>
        )
    }
}