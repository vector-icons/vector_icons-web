import { useLayoutEffect, useRef } from "preact/hooks";

export function RenderIcon({innerHTML}: {
    innerHTML: string
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        wrapper.innerHTML = this.innerHTML;
    });

    return (
        <div ref={wrapperRef}>{innerHTML}</div>
    )
}