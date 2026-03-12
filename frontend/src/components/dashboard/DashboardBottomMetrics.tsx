import { motion } from "framer-motion";
import { BarChart3, Brain, Globe } from "lucide-react";
import GlowCard from "@/components/GlowCard";

const DashboardBottomMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
      <GlowCard className="p-5" delay={0.7}>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            transition={{ type: "spring" }}
          >
            <BarChart3 className="w-5 h-5 text-primary" />
          </motion.div>
          <div>
            <p className="text-xs font-tech text-muted-foreground tracking-wider">TODAY'S THROUGHPUT</p>
            <p className="text-xl font-display text-foreground mt-1">847 <span className="text-xs text-primary">videos</span></p>
          </div>
        </div>
      </GlowCard>
      <GlowCard className="p-5" delay={0.8}>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.15, rotate: -10 }}
            transition={{ type: "spring" }}
          >
            <Brain className="w-5 h-5 text-accent" />
          </motion.div>
          <div>
            <p className="text-xs font-tech text-muted-foreground tracking-wider">MODEL VERSION</p>
            <p className="text-xl font-display text-foreground mt-1">v3.2.1 <span className="text-xs text-emerald-glow">STABLE</span></p>
          </div>
        </div>
      </GlowCard>
      <GlowCard className="p-5" delay={0.9}>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-5 h-5 text-emerald-glow" />
          </motion.div>
          <div>
            <p className="text-xs font-tech text-muted-foreground tracking-wider">UPTIME</p>
            <p className="text-xl font-display text-foreground mt-1">99.97<span className="text-xs text-primary">%</span></p>
          </div>
        </div>
      </GlowCard>
    </div>
  );
};

export default DashboardBottomMetrics;
