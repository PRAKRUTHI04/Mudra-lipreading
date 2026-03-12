import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Database, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlowCard from "@/components/GlowCard";
import { toast } from "sonner";

const Settings = () => {
  const handleSave = () => toast.success("Settings saved successfully!");

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold glow-text">System Config</h1>
        <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide">
          Configure your MUDRA experience
        </p>
      </motion.div>

      {/* Profile */}
      <GlowCard className="p-6" delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display tracking-wider text-foreground">Profile</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">Name</label>
            <Input defaultValue="Dr. Sarah Chen" className="bg-input/50 border-border/50 font-tech" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">Email</label>
            <Input defaultValue="sarah.chen@mudra.ai" className="bg-input/50 border-border/50 font-tech" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">Organization</label>
            <Input defaultValue="MUDRA Labs" className="bg-input/50 border-border/50 font-tech" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">Role</label>
            <Input defaultValue="Researcher" className="bg-input/50 border-border/50 font-tech" disabled />
          </div>
        </div>
      </GlowCard>

      {/* Notifications */}
      <GlowCard className="p-6" delay={0.2}>
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display tracking-wider text-foreground">Notifications</h2>
        </div>
        <div className="space-y-4">
          {["Processing Complete", "New Model Updates", "System Alerts", "Weekly Reports"].map((item) => (
            <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20">
              <span className="text-sm font-tech text-foreground">{item}</span>
              <div className="w-10 h-5 rounded-full bg-primary/20 relative cursor-pointer border border-primary/30">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-primary transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Model Config */}
      <GlowCard className="p-6" delay={0.3}>
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-display tracking-wider text-foreground">Model Configuration</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">LSTM Layers</label>
            <Input defaultValue="4" type="number" className="bg-input/50 border-border/50 font-tech" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">CNN Backbone</label>
            <Input defaultValue="ResNet-50" className="bg-input/50 border-border/50 font-tech" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">Confidence Threshold</label>
            <Input defaultValue="0.85" type="number" step="0.05" className="bg-input/50 border-border/50 font-tech" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">Max Frame Rate</label>
            <Input defaultValue="30" type="number" className="bg-input/50 border-border/50 font-tech" />
          </div>
        </div>
      </GlowCard>

      <Button variant="glow" size="lg" onClick={handleSave} className="w-full">
        <Save className="w-4 h-4 mr-2" /> Save Configuration
      </Button>
    </div>
  );
};

export default Settings;
