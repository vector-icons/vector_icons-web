import { useLayoutEffect, useRef } from "preact/hooks";
import { Icons } from "../pages/App";
import { Box } from "react-widgets";

export function RenderIcon({size, color, innerHTML}: {
    size: string,
    color?: string,
    innerHTML: string
}) {
    return (
        <Box
            display="flex"
            width={size}
            height={size}
            justifyContent="center"
            pointerEvents="none"
            fill={color}
            innerHTML={innerHTML}
        />
    )
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