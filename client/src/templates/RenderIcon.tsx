import { useLayoutEffect, useRef } from "preact/hooks";

export function RenderIcon({size, innerHTML}: {
    size: string,
    innerHTML: string
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const wrapper = wrapperRef.current;
        wrapper.innerHTML = innerHTML;
        wrapper.style.display = "flex";
        wrapper.style.width = size;
        wrapper.style.height = size;
        wrapper.style.justifyContent = "center";
    }, []);

    return (
        <div ref={wrapperRef} />
    )
}