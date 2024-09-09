import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { Box } from "react-widgets";

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
                        borderRadius="1e10px"
                        background={`linear-gradient(to right, var(--primary) ${percent100}, var(--primary-half) ${percent100})`}
                        margin="15px 0px"
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
                                transitionDuration="0.15s"
                            />
                        }
                    />
                }
            />
        )
    }
}