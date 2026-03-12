import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: string;
}

const GlowCard = ({ children, className = "", delay = 0, glowColor }: GlowCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className={`glass-card-hover relative overflow-hidden ${className}`}
      style={glowColor ? { 
        boxShadow: `0 4px 30px ${glowColor}15, inset 0 1px 0 rgba(255,255,255,0.03)` 
      } : undefined}
    >
      {children}
    </motion.div>
  );
};

export default GlowCard;
