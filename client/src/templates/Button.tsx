import { TouchRipple } from "web-touch-ripple/jsx"

export namespace Button {
    export function Primary({text, wait = false}: {
        text: string,
        wait?: boolean
    }) {
        return (
            <TouchRipple onTap={() => {}} wait={wait}>
                <button className="primary">{text}</button>
            </TouchRipple>
        )
    }
}