import { Animation, Curve, Ticker } from "animatable-js";

function randomRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

class Net {
    x: Animation;
    y: Animation;
    rotate: Animation;
    fade: Animation;
    size: number;
    opacity: number;
    color: string;

    constructor(duration: number) {
        this.x = new Animation(duration, null, randomRange(0, 1));
        this.y = new Animation(duration, null, randomRange(0.5, 1));
        this.rotate = new Animation(duration, null, randomRange(0, Math.PI * 2));
        this.fade = new Animation(1000, Curve.Ease);
        this.size = randomRange(0.7, 1.3);
        this.opacity = randomRange(0.5, 1);
        this.color = `rgb(${randomRange(0, 255)}, ${randomRange(0, 255)}, ${randomRange(0, 255)})`;
    }

    start() {
        this.x.animateTo(randomRange(0, 1));
        this.y.animateTo(randomRange(0.25, 0));
        this.fade.animateTo(1);
        return this;
    }

    end(callback: Function) {
        this.fade.animateTo(0);
        this.fade.addStatusListener(status => {
            if (status == "backwarded") callback(this);
        });
    }

    distanceTo(other: Net) {
        const x = this.x.value - other.x.value;
        const y = this.y.value - other.y.value;

        return Math.sqrt(x * x + y * y);
    }

    draw(ctx: CanvasRenderingContext2D, others: Net[]) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const x = this.x.value;
        const y = this.y.value;
        const fade = this.fade.value;

        ctx.beginPath();

        for (const other of others) {
            const distance = other.distanceTo(this);
            const otherFade = other.fade.value;
            if (distance < 0.1) {
                ctx.beginPath();
                ctx.moveTo(other.x.value * width, other.y.value * height);
                ctx.lineTo(x * width, y * height);
                ctx.lineWidth = 3 * window.devicePixelRatio;

                // 투명도 계산 (0.1 이하일 때 1, 0.1 이상일 때 0으로 변함)
                const opacity = Math.max(0, 1 - (distance * 10));
                const alpha = opacity * Math.min(fade, otherFade);

                ctx.strokeStyle = this.color;
                ctx.globalAlpha = alpha;
                ctx.lineCap = "round";
                ctx.stroke();
            }
        }
    }
}

class NetController {
    context: CanvasRenderingContext2D;

    constructor(public canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d");

        const observer = new ResizeObserver(() => {
            const rect = canvas.getBoundingClientRect();
            const ppi = devicePixelRatio;

            canvas.setAttribute("width", `${rect.width * ppi}px`);
            canvas.setAttribute("height", `${rect.height * ppi}px`);
            this.draw();
        });

        observer.observe(canvas);
    }

    private nets: Net[] = [];

    attach(net: Net) {
        this.nets.push(net.start());
    }
    
    detach(net: Net) {
        this.nets = this.nets.filter(e => e != net);
    }

    start() {
        new Ticker((this.draw.bind(this)));
    }

    end() {
        this.nets.forEach(net => net.end(() => this.detach(net)));
    }

    draw() {
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;

        this.context.clearRect(0, 0, width, height);
        this.nets.forEach(net => net.draw(this.context, this.nets.filter(e => e != net)));
    }
}

export class LandingBackgroundElement extends HTMLElement {
    private controller: NetController;

    initialize() {
        const attachNets = (count: number) => {
            for (let i = 0; i < count; i++) {
                attachNet();
            }
        }

        const attachNet = () => {
            const duration = randomRange(15000, 30000);
            const net = new Net(duration);
            setTimeout(() => {
                net.end(() => {this.controller.detach(net); attachNet()});
            }, duration - 1000); // duration - fade duration

            this.controller.attach(net);
        }

        attachNets(75);
        this.controller.start();
    }

    connectedCallback() {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";

        this.style.display = "flex";
        this.style.width = "100%";
        this.style.height = "100%";
        this.appendChild(canvas);

        this.controller = new NetController(canvas);
        this.initialize();
    }
}

customElements.define("landing-background", LandingBackgroundElement)