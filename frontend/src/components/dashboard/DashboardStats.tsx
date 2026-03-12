import { motion } from "framer-motion";
import { Video, Brain, TrendingUp, Users } from "lucide-react";
import GlowCard from "@/components/GlowCard";
import AnimatedCounter from "@/components/AnimatedCounter";

const stats = [
  { label: "Videos Processed", value: 12847, icon: Video, suffix: "", color: "hsl(185, 100%, 50%)" },
  { label: "Words Decoded", value: 284930, icon: Brain, suffix: "", color: "hsl(270, 80%, 60%)" },
  { label: "Accuracy Rate", value: 97, icon: TrendingUp, suffix: "%", color: "hsl(160, 80%, 45%)" },
  { label: "Active Users", value: 1432, icon: Users, suffix: "", color: "hsl(35, 95%, 55%)" },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
      {stats.map((stat, i) => (
        <GlowCard key={stat.label} delay={i * 0.1} className="p-6 group" glowColor={stat.color}>
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-xs font-tech tracking-[0.15em] uppercase text-muted-foreground">
                {stat.label}
              </p>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>
            <motion.div 
              className="p-3 rounded-xl transition-all duration-500"
              style={{ background: `${stat.color}15` }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </motion.div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }}
              initial={{ width: 0 }}
              animate={{ width: `${60 + Math.random() * 30}%` }}
              transition={{ duration: 1.5, delay: i * 0.1 + 0.5, ease: "easeOut" }}
            />
          </div>
        </GlowCard>
      ))}
    </div>
  );
};

export default DashboardStats;
