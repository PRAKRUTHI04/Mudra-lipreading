import { motion } from "framer-motion";

const LipFocusOverlay = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {/* Animated lip-tracking crosshair that moves around */}
      <motion.div
        animate={{
          x: ["30%", "55%", "40%", "65%", "35%", "50%", "30%"],
          y: ["40%", "50%", "45%", "55%", "50%", "42%", "40%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{ left: 0, top: 0 }}
      >
        {/* Tracking reticle */}
        <motion.div className="relative w-32 h-32">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/40" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/40" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/40" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/40" />
          
          {/* Center crosshair */}
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-3 h-px bg-primary/60" style={{ position: "absolute" }} />
            <div className="h-3 w-px bg-primary/60" style={{ position: "absolute" }} />
          </motion.div>

          {/* Scanning ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-dashed border-primary/20"
          />

          {/* Label */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-[9px] font-tech tracking-[0.3em] text-primary/60 bg-background/30 px-2 py-0.5 rounded">
              LIP TRACKING
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Secondary tracking point */}
      <motion.div
        animate={{
          x: ["60%", "35%", "50%", "45%", "60%"],
          y: ["50%", "45%", "55%", "48%", "50%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{ left: 0, top: 0 }}
      >
        <motion.div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent/30" />
          <motion.div
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-[8px] font-tech tracking-[0.2em] text-accent/50">FACE MESH</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Data streams flowing down the sides */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`data-stream-${i}`}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "200%", opacity: [0, 0.5, 0] }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "linear",
          }}
          className="absolute text-[8px] font-tech text-primary/30 leading-tight whitespace-nowrap"
          style={{ left: `${5 + i * 3}%` }}
        >
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j}>{Math.random().toString(16).substr(2, 8).toUpperCase()}</div>
          ))}
        </motion.div>
      ))}

      {/* Right side data streams */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`data-stream-r-${i}`}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "200%", opacity: [0, 0.4, 0] }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: i * 1.5 + 0.5,
            ease: "linear",
          }}
          className="absolute text-[8px] font-tech text-accent/25 leading-tight whitespace-nowrap"
          style={{ right: `${5 + i * 3}%` }}
        >
          {Array.from({ length: 8 }).map((_, j) => (
            <div key={j}>{Math.random().toString(16).substr(2, 6).toUpperCase()}</div>
          ))}
        </motion.div>
      ))}

      {/* Neural network connection lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.line
          x1="10%" y1="20%" x2="40%" y2="50%"
          stroke="hsl(185 100% 50%)" strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line
          x1="90%" y1="30%" x2="60%" y2="50%"
          stroke="hsl(270 80% 60%)" strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
        />
        <motion.line
          x1="50%" y1="10%" x2="50%" y2="60%"
          stroke="hsl(185 100% 50%)" strokeWidth="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Processing status badges at corners */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-6 left-6 flex items-center gap-2"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-glow" />
        <span className="text-[9px] font-tech tracking-[0.2em] text-emerald-glow/70">NEURAL ACTIVE</span>
      </motion.div>

      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute top-6 right-6 flex items-center gap-2"
      >
        <span className="text-[9px] font-tech tracking-[0.2em] text-primary/60">FPS: 60</span>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        className="absolute bottom-6 left-6"
      >
        <span className="text-[8px] font-tech tracking-[0.15em] text-muted-foreground/50">
          LSTM×CNN v3.2 | MUDRA ENGINE
        </span>
      </motion.div>
    </div>
  );
};

export default LipFocusOverlay;
