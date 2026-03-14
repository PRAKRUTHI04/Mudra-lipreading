import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const AnimatedCounter = ({
    target,
    duration = 2,
    className,
}) => {
    const count = useMotionValue(0);
    const rounded = useSpring(count, {
        damping: 30,
        stiffness: 100,
    });
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    useEffect(() => {
        if (isInView) {
            count.set(target);
        }
    }, [count, isInView, target]);

    useEffect(() => {
        return rounded.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Math.floor(latest)
                );
            }
        });
    }, [rounded]);

    return (
        <span
            ref={ref}
            className={cn("text-4xl font-display font-bold tabular-nums", className)}
        />
    );
};

export default AnimatedCounter;
