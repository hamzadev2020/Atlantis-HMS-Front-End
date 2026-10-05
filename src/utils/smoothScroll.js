import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initSmoothScroll = () => {
    // Respect user's motion preference
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => {};
    }

    try {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
        });

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        const tickerCallback = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerCallback);
            lenis.destroy();
        };
    } catch (e) {
        console.warn("Smooth scroll initialization skipped:", e);
        return () => {};
    }
};
