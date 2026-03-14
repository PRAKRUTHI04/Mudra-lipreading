import { motion } from "framer-motion";

const HolographicGrid = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-[1000px]">
            {/* Perspective grid floor */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 2 }}
                className="absolute bottom-0 left-0 right-0 h-[60%]"
                style={{
                    backgroundImage: `
            linear-gradient(hsl(185 100% 50% / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(185 100% 50% / 0.3) 1px, transparent 1px)
          `,
                    backgroundSize: "80px 80px",
                    transform: "rotateX(60deg)",
                    transformOrigin: "bottom center",
                    maskImage: "linear-gradient(to top, white 20%, transparent 80%)",
                    WebkitMaskImage: "linear-gradient(to top, white 20%, transparent 80%)",
                }}
            />

            {/* Horizontal scanning beam */}
            <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-[2px]"
                style={{
                    background: "linear-gradient(90deg, transparent, hsl(185 100% 50% / 0.6), hsl(270 80% 60% / 0.4), transparent)",
                    boxShadow: "0 0 30px 10px hsl(185 100% 50% / 0.15)",
                }}
            />

            {/* Floating hex particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: 0,
                    }}
                    animate={{
                        y: [`${20 + Math.random() * 60}%`, `${10 + Math.random() * 30}%`, `${40 + Math.random() * 40}%`],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 6 + Math.random() * 8,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut",
                    }}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        background: i % 2 === 0
                            ? "hsl(185 100% 50%)"
                            : "hsl(270 80% 60%)",
                        boxShadow: `0 0 ${6 + Math.random() * 10}px ${i % 2 === 0 ? "hsl(185 100% 50% / 0.5)" : "hsl(270 80% 60% / 0.5)"}`,
                    }}
                />
            ))}
        </div>
    );
};

export default HolographicGrid;
