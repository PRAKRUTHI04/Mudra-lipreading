import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Play, FileVideo, X, CheckCircle2, Loader2, Scan, Eye, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlowCard from "@/components/GlowCard";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import VideoBackground from "@/components/VideoBackground";
import AuroraEffect from "@/components/AuroraEffect";
import LipFocusOverlay from "@/components/LipFocusOverlay";
import CinematicText from "@/components/CinematicText";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

type ProcessingState = "idle" | "uploading" | "processing" | "complete";

interface ModelInfo {
  modelName: string;
  displayName: string;
  numClasses: number;
}

const Process = () => {
  const [state, setState] = useState<ProcessingState>("idle");
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState("");
  const [confidence, setConfidence] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [selectedModelIdx, setSelectedModelIdx] = useState<string>("0");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/models`);
        if (response.ok) {
          const data = await response.json();
          setAvailableModels(data.models || []);
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    };
    void fetchModels();
  }, [API_BASE_URL]);

  const uploadAndProcess = async (file: File) => {
    setFileName(file.name);
    setOutput("");
    setConfidence(null);
    setModelName(null);
    setState("uploading");
    setProgress(0);

    // Fake a smooth progress bar while the real request is running
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress = Math.min(currentProgress + 3, 90);
      setProgress(currentProgress);
    }, 80);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("model_idx", selectedModelIdx);
      formData.append("hardware", "cpu");

      setState("processing");

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = (errorData as { error?: string }).error ?? "Failed to process video";
        toast.error(message);
        setState("idle");
        return;
      }

      const data = await response.json() as {
        word?: string;
        confidence?: string;
        model?: string;
      };

      setOutput(data.word ?? "");
      setConfidence(data.confidence ?? null);
      setModelName(data.model ?? null);
      setState("complete");
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error(error);
      toast.error("Something went wrong while contacting the server.");
      setState("idle");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      void uploadAndProcess(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void uploadAndProcess(file);
    }
  };

  const reset = () => {
    setState("idle");
    setFileName("");
    setProgress(0);
    setOutput("");
    setConfidence(null);
    setModelName(null);
  };

  return (
    <div className="relative min-h-screen p-6 space-y-6 overflow-hidden">
      <VideoBackground variant="process" />
      <AuroraEffect />
      {state === "processing" && <LipFocusOverlay />}
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
        <h1 className="text-3xl font-display font-bold">
          <CinematicText delay={0.1}>Video Processing</CinematicText>
        </h1>
        <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide flex items-center gap-2">
          <Scan className="w-4 h-4 text-primary/60" />
          Upload a video for neural lip reading analysis
        </p>
      </motion.div>

      <div className="relative z-10 max-w-4xl">
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`glass-card glow-border p-16 text-center cursor-pointer transition-all duration-500 ${
                  dragOver ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.2)]" : ""
                }`}
              >
                <input ref={fileRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
                <motion.div
                  animate={dragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  className="inline-flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="p-6 rounded-2xl bg-primary/10 border border-primary/20"
                    >
                      <Upload className="w-12 h-12 text-primary" />
                    </motion.div>
                    <div className="pulse-ring w-24 h-24 -top-2 -left-2" />
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-xl font-display tracking-wider text-foreground">Drop Video File Here</p>
                    <p className="text-sm font-tech text-muted-foreground tracking-wide">
                      or click to browse • MP4, AVI, MOV supported
                    </p>
                  </div>
                  
                  {/* Feature badges */}
                  <div className="flex items-center gap-3 mt-4">
                    {[
                      { icon: Eye, label: "LIP DETECT" },
                      { icon: Brain, label: "LSTM×CNN" },
                      { icon: Scan, label: "REAL-TIME" },
                    ].map((b, i) => (
                      <motion.div
                        key={b.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-border/30 bg-muted/20"
                      >
                        <b.icon className="w-3 h-3 text-primary/60" />
                        <span className="text-[9px] font-tech tracking-widest text-muted-foreground">{b.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {availableModels.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex flex-col items-center gap-3"
                >
                  <label className="text-xs font-tech text-muted-foreground tracking-widest uppercase">Select Neural Model</label>
                  <Select value={selectedModelIdx} onValueChange={setSelectedModelIdx}>
                    <SelectTrigger className="w-[300px] glass-card border-primary/20 bg-primary/5">
                      <SelectValue placeholder="Choose a model" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-primary/20 bg-background/95 backdrop-blur-xl">
                      {availableModels.map((model, idx) => (
                        <SelectItem key={idx} value={idx.toString()} className="font-tech text-sm py-3 cursor-pointer focus:bg-primary/20">
                          {model.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </motion.div>
          )}

          {(state === "uploading" || state === "processing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <GlowCard className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <FileVideo className="w-8 h-8 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-tech text-foreground">{fileName}</p>
                    <p className="text-xs font-tech text-muted-foreground tracking-wider mt-1">
                      {state === "uploading" ? "UPLOADING TO NEURAL CORE" : "NEURAL LIP READING IN PROGRESS"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {state === "uploading" && (
                  <div className="space-y-3">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs font-display text-primary text-right">{progress}%</p>
                  </div>
                )}

                {state === "processing" && (
                  <div className="space-y-6">
                    <WaveformVisualizer bars={50} className="h-20" />
                    
                    {/* Lip detection simulation */}
                    <div className="relative rounded-lg border border-border/30 bg-muted/10 p-4">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="w-5 h-5 text-primary" />
                        </motion.div>
                        <span className="text-sm font-tech tracking-widest text-primary animate-pulse">
                          ANALYZING LIP MOVEMENTS...
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3">
                        {["Frame Extraction", "Face Detection", "Lip Tracking", "LSTM Decode"].map((step, i) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                            className="text-center p-2 rounded-lg bg-muted/20 border border-border/30"
                          >
                            <p className="text-[10px] font-tech text-muted-foreground tracking-wider">{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </GlowCard>
            </motion.div>
          )}

          {state === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlowCard className="p-8" glowColor="hsl(160, 80%, 45%)">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-emerald-glow" />
                  <h3 className="text-lg font-display tracking-wider text-foreground">Lip Reading Complete</h3>
                </div>
                <div className="p-6 rounded-xl bg-muted/20 border border-border/30 mb-4">
                  <p className="text-xs font-tech tracking-widest text-muted-foreground mb-3 uppercase">Decoded Speech Output</p>
                  <p className="text-base font-body text-foreground leading-relaxed">{output}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs font-tech text-muted-foreground">Words</p>
                    <p className="text-lg font-display text-primary">{output.split(" ").length}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs font-tech text-muted-foreground">Confidence</p>
                    <p className="text-lg font-display text-emerald-glow">
                      {confidence ? `${confidence}%` : "—"}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/20">
                    <p className="text-xs font-tech text-muted-foreground">Model</p>
                    <p className="text-xs font-display text-accent truncate">
                      {modelName ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="glow" onClick={reset} className="flex-1">
                    <Play className="w-4 h-4 mr-2" /> Process Another
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download Report
                  </Button>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Process;
