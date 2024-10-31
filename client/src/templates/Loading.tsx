import { Box, Canvas, CanvasController } from "@web-package/react-widgets";
import { Animation, AnimationStatus, Curve } from "animatable-js";
import { CSSProperties, ReactNode } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";

export namespace Loading {
    export function Circle({size}: {size: string}) {
        const animation1Ref = useRef(new Animation(1000, Curve.Ease));
        const animation2Ref = useRef(new Animation(1000, Curve.Ease));
        const animation3Ref = useRef(new Animation(1500));
        const controllerRef = useRef(new CanvasController());
        const animation1 = animation1Ref.current;
        const animation2 = animation2Ref.current;
        const animation3 = animation3Ref.current;
        const controller = controllerRef.current;

        useEffect(() => {
            const interval = (Math.PI * 2) - 1;
            animation1.addListener(() => controller.redraw());
            animation1.addStatusListener((status) => {
                if (status == AnimationStatus.FORWARDED) animation2.animateTo(animation1.value + interval);
            });

            animation2.animateTo(interval);
            animation2.addListener(() => controller.redraw());
            animation2.addStatusListener((status) => {
                if (status == AnimationStatus.FORWARDED) animation1.animateTo(animation2.value - 0.5);
            });

            animation3.addListener(() => controller.redraw());
            animation3.animateTo(Math.PI * 2);
            animation3.addStatusListener((status) => {
                if (status == AnimationStatus.FORWARDED) animation3.animateTo(animation3.value + Math.PI * 2);
            })

            return () => {
                animation1.dispose();
                animation2.dispose();
                animation3.dispose();
            }
        }, []);

        return (
            <Canvas.Context2D
                width={size}
                height={size}
                controller={controller}
                onDraw={(ctx) => {
                    const width = ctx.canvas.width;
                    const height = ctx.canvas.height;
                    const size = Math.max(width, height);
                    const lineWidth = 5;
                    const lineColor = getComputedStyle(document.body).getPropertyValue("--foreground");

                    ctx.save();
                    ctx.clearRect(0, 0, width, height);
                    ctx.translate(width / 2, height / 2);
                    ctx.rotate(animation3.value);
                    ctx.translate(-(width / 2), -(height / 2));
                    ctx.beginPath();
                    ctx.arc(width / 2, height / 2, size / 2 - (lineWidth / 2), animation1.value, animation2.value);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = "round";
                    ctx.stroke();
                    ctx.restore();
                }}
            />
        )
    }
}