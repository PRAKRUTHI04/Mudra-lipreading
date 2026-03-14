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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";

const Process = () => {
    const [state, setState] = useState("idle");
    const [fileName, setFileName] = useState("");
    const [progress, setProgress] = useState(0);
    const [output, setOutput] = useState("");
    const [confidence, setConfidence] = useState(null);
    const [modelName, setModelName] = useState(null);
    const fileRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [isSatisfied, setIsSatisfied] = useState(true);
    const [expectedOutput, setExpectedOutput] = useState("");
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5000";

    const uploadAndProcess = async (file) => {
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
            formData.append("model_idx", "0");
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
                const message = errorData.error ?? "Failed to process video";
                toast.error(message);
                setState("idle");
                return;
            }

            const data = await response.json();

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

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            uploadAndProcess(file);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadAndProcess(file);
        }
    };

    const reset = () => {
        setState("idle");
        setFileName("");
        setProgress(0);
        setOutput("");
        setConfidence(null);
        setModelName(null);
        setIsSatisfied(true);
        setExpectedOutput("");
    };

    const handleSubmitFeedback = async () => {
        setIsSubmittingFeedback(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Feedback submitted successfully!");
        setIsSubmittingFeedback(false);
        // Optionally reset after feedback
    };

    return (
        <div className="relative min-h-screen p-6 overflow-hidden">
            {/* Cinematic video background */}
            <VideoBackground variant="process" />
            <AuroraEffect />
            {state === "processing" && <LipFocusOverlay />}

            <div className="relative z-10 max-w-5xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-display font-bold">
                        <CinematicText delay={0.1}>Video Processing</CinematicText>
                    </h1>
                    <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide flex items-center gap-2">
                        <Scan className="w-4 h-4 text-primary/60" />
                        Upload a video for neural lip reading analysis
                    </p>
                </motion.div>

                <div className="relative">
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
                                    className={`glass-card glow-border p-16 text-center cursor-pointer transition-all duration-500 ${dragOver ? "border-primary/60 shadow-[0_0_40px_hsl(var(--primary)/0.2)]" : ""
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

                                <GlowCard className="p-8" glowColor="hsl(210, 80%, 45%)">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MessageSquare className="w-6 h-6 text-primary" />
                                        <h3 className="text-lg font-display tracking-wider text-foreground">Post-Processing Feedback</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                                            <div className="space-y-1">
                                                <Label htmlFor="satisfaction" className="text-base font-display tracking-wide">
                                                    Satisfied with the output?
                                                </Label>
                                                <p className="text-xs font-tech text-muted-foreground">Was the lip reading accuracy acceptable?</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-tech tracking-widest ${!isSatisfied ? "text-primary" : "text-muted-foreground"}`}>NO</span>
                                                <Switch
                                                    id="satisfaction"
                                                    checked={isSatisfied}
                                                    onCheckedChange={setIsSatisfied}
                                                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-primary"
                                                />
                                                <span className={`text-[10px] font-tech tracking-widest ${isSatisfied ? "text-emerald-glow" : "text-muted-foreground"}`}>YES</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="expected" className="text-sm font-tech tracking-widest uppercase text-muted-foreground">
                                                What was expected?
                                            </Label>
                                            <div className="relative group">
                                                <Textarea
                                                    id="expected"
                                                    placeholder="Enter the correct phrase or correction..."
                                                    value={expectedOutput}
                                                    onChange={(e) => setExpectedOutput(e.target.value)}
                                                    className="bg-muted/10 border-border/30 focus:border-primary/50 transition-all duration-300 resize-none min-h-[100px] placeholder:text-muted-foreground/30 font-body"
                                                />
                                                <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity" />
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleSubmitFeedback}
                                            disabled={isSubmittingFeedback}
                                            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-500 font-display tracking-widest uppercase"
                                        >
                                            {isSubmittingFeedback ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" /> Submit Feedback
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </GlowCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Process;
