import { motion } from "framer-motion";

const WaveformVisualizer = ({ className = "", bars = 40 }: { className?: string; bars?: number }) => {
  return (
    <div className={`flex items-end gap-[2px] h-16 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-full bg-gradient-to-t from-primary/60 to-accent/40 min-w-[2px]"
          animate={{
            height: ["10%", `${20 + Math.random() * 70}%`, "10%"],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
