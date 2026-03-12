import { motion } from "framer-motion";
import { Zap, Globe } from "lucide-react";
import GlowCard from "@/components/GlowCard";

const systemItems = [
  { label: "LSTM Engine", progress: 94, color: "hsl(185, 100%, 50%)" },
  { label: "CNN Pipeline", progress: 87, color: "hsl(270, 80%, 60%)" },
  { label: "Frame Extractor", progress: 99, color: "hsl(160, 80%, 45%)" },
  { label: "NLP Decoder", progress: 91, color: "hsl(35, 95%, 55%)" },
];

const DashboardSystemNeural = () => {
  return (
    <GlowCard className="p-6" delay={0.4}>
      <div className="flex items-center gap-3 mb-6">
        <motion.div 
          className="p-2 rounded-lg bg-accent/10"
          animate={{ boxShadow: ["0 0 0px hsl(270 80% 60% / 0)", "0 0 15px hsl(270 80% 60% / 0.2)", "0 0 0px hsl(270 80% 60% / 0)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Zap className="w-5 h-5 text-accent" />
        </motion.div>
        <h2 className="text-lg font-display tracking-wider text-foreground">System Neural</h2>
      </div>
      <div className="space-y-4">
        {systemItems.map((item, i) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-tech tracking-wider text-muted-foreground">{item.label}</span>
              <span className="text-xs font-display" style={{ color: item.color }}>{item.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: item.color }}
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-3 rounded-lg bg-muted/30 border border-border/30">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-4 h-4 text-primary" />
          </motion.div>
          <span className="text-xs font-tech text-muted-foreground tracking-wider">
            NEURAL MESH: 24 NODES ONLINE
          </span>
        </div>
      </div>
    </GlowCard>
  );
};

export default DashboardSystemNeural;
