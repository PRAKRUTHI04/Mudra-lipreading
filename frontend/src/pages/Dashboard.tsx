import { motion } from "framer-motion";
import { 
  Activity, Brain, Video, Users, Clock, TrendingUp,
  Zap, Eye, BarChart3, Globe, Sparkles, Scan, Radio
} from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import VideoBackground from "@/components/VideoBackground";
import AuroraEffect from "@/components/AuroraEffect";
import HolographicGrid from "@/components/HolographicGrid";
import LipFocusOverlay from "@/components/LipFocusOverlay";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import DashboardSystemNeural from "@/components/dashboard/DashboardSystemNeural";
import DashboardBottomMetrics from "@/components/dashboard/DashboardBottomMetrics";
import GlowCard from "@/components/GlowCard";
import CinematicText from "@/components/CinematicText";

const Dashboard = () => {
  const modelMetrics = [
    { label: "LSTM Layers", value: "4 Stacked" },
    { label: "CNN Backbone", value: "ResNet-50" },
    { label: "Latency", value: "12ms" },
    { label: "GPU Utilization", value: "73%" },
  ];

  return (
    <div className="relative min-h-screen p-6 space-y-6 overflow-hidden">
      {/* Cinematic video background - people talking */}
      <VideoBackground variant="dashboard" />
      
      {/* Lip tracking HUD overlay */}
      <LipFocusOverlay />
      
      {/* Aurora effects */}
      <AuroraEffect />
      
      {/* Holographic grid */}
      <HolographicGrid />
      
      {/* Header with cinematic entrance */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-display font-bold tracking-wider">
              <CinematicText delay={0.2}>Command Center</CinematicText>
            </h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-muted-foreground font-tech text-lg mt-1 tracking-[0.15em] flex items-center gap-2"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Scan className="w-4 h-4 text-primary/60" />
              </motion.span>
              Real-time neural lip reading analytics
            </motion.p>
          </div>
        </div>
        
        {/* Animated status bar with live indicators */}
        <div className="mt-4 flex items-center gap-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg, hsl(185 100% 50% / 0.6), hsl(270 80% 60% / 0.4), transparent)" }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-glow" style={{ boxShadow: "0 0 6px hsl(160 80% 45% / 0.6)" }} />
              <span className="text-[10px] font-tech tracking-[0.2em] text-emerald-glow">LIVE</span>
            </motion.div>
            <span className="text-[10px] font-tech tracking-[0.15em] text-muted-foreground">|</span>
            <span className="text-[10px] font-tech tracking-[0.15em] text-muted-foreground">24 NODES</span>
            <span className="text-[10px] font-tech tracking-[0.15em] text-muted-foreground">|</span>
            <span className="text-[10px] font-tech tracking-[0.15em] text-primary/60">v3.2.1</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Waveform / Processing Status */}
        <GlowCard className="lg:col-span-2 p-6" delay={0.3}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 rounded-lg bg-primary/10"
                animate={{ boxShadow: ["0 0 0px hsl(185 100% 50% / 0)", "0 0 20px hsl(185 100% 50% / 0.3)", "0 0 0px hsl(185 100% 50% / 0)"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Activity className="w-5 h-5 text-primary" />
              </motion.div>
              <h2 className="text-lg font-display tracking-wider text-foreground">Live Processing Feed</h2>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2.5 h-2.5 rounded-full bg-emerald-glow"
                style={{ boxShadow: "0 0 10px hsl(160 80% 45% / 0.6)" }}
              />
              <span className="text-xs font-tech text-emerald-glow tracking-[0.2em]">ACTIVE</span>
            </div>
          </div>
          <WaveformVisualizer bars={60} className="h-28 mb-6" />
          <div className="neon-line mb-4" />
          <div className="grid grid-cols-4 gap-4">
            {modelMetrics.map((m, i) => (
              <motion.div 
                key={m.label} 
                className="text-center p-3 rounded-lg border border-border/20 bg-muted/10"
                whileHover={{ borderColor: "hsl(185 100% 50% / 0.3)", scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <p className="text-xs font-tech text-muted-foreground tracking-wider">{m.label}</p>
                <p className="text-sm font-display text-primary mt-1">{m.value}</p>
              </motion.div>
            ))}
          </div>
        </GlowCard>

        {/* System Status */}
        <DashboardSystemNeural />
      </div>

      {/* Lip Reading Live Preview Section */}
      <GlowCard className="p-6 relative z-10" delay={0.45}>
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className="p-2 rounded-lg bg-accent/10"
            animate={{ boxShadow: ["0 0 0px hsl(270 80% 60% / 0)", "0 0 15px hsl(270 80% 60% / 0.3)", "0 0 0px hsl(270 80% 60% / 0)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Eye className="w-5 h-5 text-accent" />
          </motion.div>
          <h2 className="text-lg font-display tracking-wider text-foreground">Lip Detection Preview</h2>
          <div className="ml-auto flex items-center gap-2">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <Radio className="w-3 h-3 text-destructive" />
              <span className="text-[10px] font-tech tracking-[0.2em] text-destructive">REC</span>
            </motion.div>
          </div>
        </div>
        
        {/* Simulated lip detection display */}
        <div className="relative rounded-xl overflow-hidden border border-border/30 bg-muted/10" style={{ height: 200 }}>
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          
          {/* Animated face detection zones */}
          <motion.div
            animate={{ x: [100, 250, 180, 300, 100], y: [30, 50, 40, 60, 30] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute"
          >
            <div className="w-40 h-28 border border-primary/40 rounded-lg relative">
              <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-primary/70" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-primary/70" />
              <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-primary/70" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-primary/70" />
              
              {/* Lip region highlight */}
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-full border border-accent/50"
                style={{ background: "hsl(270 80% 60% / 0.1)" }}
              />
              
              <span className="absolute -top-5 left-0 text-[8px] font-tech tracking-[0.2em] text-primary/70">FACE_01</span>
              <span className="absolute -bottom-5 left-0 text-[8px] font-tech tracking-[0.15em] text-accent/60">CONF: 98.7%</span>
            </div>
          </motion.div>

          {/* Decoded words appearing */}
          <motion.div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/30">
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs font-tech text-foreground tracking-wide"
              >
                "The neural architecture processes visual speech recognition..."
              </motion.span>
            </div>
          </motion.div>

          {/* Timestamp */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-3 right-3 text-[9px] font-tech text-primary/50 tracking-wider"
          >
            00:04:23:17
          </motion.div>
        </div>
      </GlowCard>

      {/* Recent Activity */}
      <DashboardActivity />

      {/* Bottom Metrics */}
      <DashboardBottomMetrics />
    </div>
  );
};

export default Dashboard;
