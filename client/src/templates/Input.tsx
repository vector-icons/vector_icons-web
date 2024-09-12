import { render } from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { Box, Column, Text } from "react-widgets";
import { Overlay, OverlayAlignment, OverlayDirection, OverlayElement } from "web-overlay-layout";
import { TouchRipple } from "web-touch-ripple/jsx";

export namespace Input {
    export function Range({current, min, max, interval = 1, onChange}: {
        current: number;
        min: number;
        max: number;
        interval?: number;
        onChange?: (newValue: number) => void;
    }) {
        const [percent, setPercent] = useState(0);
        const percent100 = `${percent * 100}%`;
        const wrapperRef = useRef<HTMLDivElement>(null);
        const wcircleRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const wrapper = wrapperRef.current;
            const wcircle = wcircleRef.current;
            let isActive = false;
            let callback = null;

            wrapper.onpointerdown   = () => isActive = true;
            wrapper.onpointercancel = () => isActive = false;
            wrapper.onpointerup     = () => isActive = false;
            wrapper.onpointerenter  = () => wcircle.style.transform = "translate(-50%, -50%) scale(1.2)";
            wrapper.onpointerleave  = () => wcircle.style.transform = "translate(-50%, -50%)";

            addEventListener("pointermove", callback = (event: PointerEvent) => {
                if (isActive) {
                    const progressRect = wrapper.getBoundingClientRect();
                    const progressSize = progressRect.width;
                    const offsetX = event.pageX - progressRect.left;
                    const current = offsetX / progressSize;

                    if (onChange) {
                        onChange(Math.min(max, Math.max(min, min + ((max - min) * current))));
                    }

                    let callback = () => {};
                    addEventListener("pointerup", callback = () => {
                        isActive = false;
                        removeEventListener("pointerup", callback);
                    });
                }
            });

            return () => removeEventListener("pointermove", callback);
        }, []);

        useLayoutEffect(() => setPercent((current - min) / (max - min)), [current]);

        return (
            <Box
                display="flex"
                cursor="pointer"
                refer={wrapperRef}
                children={
                    <Box
                        position="relative"
                        width="200px"
                        height="5px"
                        margin="15px 0px"
                        borderRadius="1e10px"
                        background={`linear-gradient(to right, var(--primary) ${percent100}, var(--primary-half) ${percent100})`}
                        children={
                            <Box
                                refer={wcircleRef}
                                position="absolute"
                                top="50%"
                                left={percent100}
                                transformOrigin="50%, 50%"
                                transform="translate(-50%, -50%)"
                                width="20px"
                                height="20px"
                                borderRadius="50%"
                                backgroundColor="var(--primary)"
                                transitionProperty="transform, scale"
                                transitionDuration="0.2s, 0.2s"
                            />
                        }
                    />
                }
            />
        )
    }

    export type SelectChangeCallback = (newIndex: number) => void;

    export interface SelectItem {
        title: string;
        details: string;
    }

    export function Select({selected, itemList, onChange}: {
        selected: number,
        itemList: SelectItem[],
        onChange: SelectChangeCallback
    }) {
        const targetRef = useRef<HTMLDivElement>(null);
        
        // This value defines an overlay element added to the current DOM.
        let activeOverlay: OverlayElement = null;

        const onTap = () => {
            if (activeOverlay) {
                activeOverlay.detach();
                activeOverlay = null;
                return;
            }

            const overlay = document.createElement("div");
            const overlayCallback = (newIndex: number) => {
                activeOverlay?.detach();
                activeOverlay = null;

                // Notifys a new updated index into a given callback.
                onChange(newIndex);
            }

            // Renders a JSX components into document to an overlay element attaching.
            render(<SelectOverlay selected={selected} itemList={itemList} onChange={overlayCallback} />, overlay);

            activeOverlay = Overlay.attach({
                element: overlay,
                target: targetRef.current,
                parent: document.body,
                behavior: {
                    direction: OverlayDirection.BOTTOM_CENTER,
                    alignment: OverlayAlignment.ALL,
                    animation: {
                        fadein: "input-select-fadein 0.15s",
                        fadeout: "input-select-fadeout 0.15s"
                    },
                    targetGap: 15,
                    viewportPadding: 15
                }
            });
        }

        return (
            <TouchRipple onTap={onTap}>
                <Box
                    refer={targetRef}
                    padding="10px 15px"
                    border="2px solid var(--foreground4)"
                    borderRadius="10px"
                    children={itemList[selected].title}
                />
            </TouchRipple>
        )
    }

    function SelectOverlay({selected, itemList, onChange}: {
        selected: number,
        itemList: SelectItem[],
        onChange: SelectChangeCallback;
    }) {
        return (
            <Column
                background="var(--background-overlay)"
                boxShadow="0px 2px 5px rgb(0, 0, 0, 0.2)"
                borderRadius="10px"
                overflow="hidden"
            >
                {itemList.map((item, index) => {
                    return (
                        <TouchRipple onTap={() => onChange(index)}>
                            <Column gap="3px" padding="var(--padding-df)">
                                <Text fontWeight={selected == index ? "bold" : "normal"}>{item.title}</Text>
                                <Text.span fontSize="14px">{item.details}</Text.span>
                            </Column>
                        </TouchRipple>
                    )
                })}
            </Column>
        )
    }
}