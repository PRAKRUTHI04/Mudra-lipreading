import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CinematicTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

const CinematicText = ({ children, className = "", delay = 0, stagger = 0.03 }: CinematicTextProps) => {
  const letters = children.split("");

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
};

export default CinematicText;
