import { Box, Column, ColumnProperties } from "@web-package/react-widgets";
import { ComponentChild } from "preact";

export namespace List {
    export function Vertical(props: ColumnProperties) {
        if (Array.isArray(props.children)) {
            const items = props.children as ComponentChild[];

            // 중간중간 아이템마다 구분선 정의
            props.children = items.flatMap((child, index) =>
                index < items.length - 1
                    ? [child, <Box height="1px" backgroundColor="var(--rearground-border)" margin="0px 15px" />]
                    : [child]
            );
        }

        return <Column {...props} />
    }
}