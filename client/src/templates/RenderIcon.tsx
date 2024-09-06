import { useLayoutEffect, useRef } from "preact/hooks";
import { Icons } from "../pages/App";

export function RenderIcon({size, color, innerHTML}: {
    size: string,
    color?: string,
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
        wrapper.style.fill = color ?? undefined;
    });

    return <div ref={wrapperRef} />
}

export namespace RenderIcon {
    export function Name({size, name, color, filled = false}: {
        size: string,
        name: string,
        color?: string,
        filled?: boolean
    }) {
        const icon = Icons.find(i => i.name == name).content;
        const iconNormal = icon.normal;
        const iconFilled = icon.filled;

        return <RenderIcon size={size} color={color} innerHTML={filled ? iconFilled : iconNormal} />
    }
}