import { motion } from "framer-motion";
import { Upload, FileVideo, Play, CheckCircle2, AlertTriangle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlowCard from "@/components/GlowCard";
import { useState } from "react";

const testVideos = [
    { id: 1, name: "test_sample_01.mp4", status: "verified", expected: "Hello world", actual: "Hello world", match: 100 },
    { id: 2, name: "test_sample_02.mp4", status: "verified", expected: "Good morning everyone", actual: "Good morning everyone", match: 100 },
    { id: 3, name: "test_noise_high.mp4", status: "partial", expected: "The weather is nice today", actual: "The weather is nice to day", match: 92 },
    { id: 4, name: "test_angle_45.mp4", status: "verified", expected: "Thank you very much", actual: "Thank you very much", match: 100 },
    { id: 5, name: "test_low_light.mp4", status: "failed", expected: "Please turn on the lights", actual: "Please turn on the life", match: 78 },
    { id: 6, name: "test_multiple_speakers.mp4", status: "partial", expected: "We need to discuss this", actual: "We need to discuss this", match: 95 },
];

const Verification = () => {
    const [search, setSearch] = useState("");
    const filtered = testVideos.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));

    const getStatusColor = (status) => {
        switch (status) {
            case "verified": return "text-emerald-glow";
            case "partial": return "text-amber-glow";
            case "failed": return "text-destructive";
            default: return "text-muted-foreground";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "verified": return <CheckCircle2 className="w-4 h-4" />;
            case "partial": return <AlertTriangle className="w-4 h-4" />;
            case "failed": return <AlertTriangle className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="p-6 overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-display font-bold glow-text">Verification Lab</h1>
                    <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide">
                        Test and validate model outputs against known inputs
                    </p>
                </motion.div>

                {/* Upload test video */}
                <GlowCard className="p-6" delay={0.1}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-tech text-foreground">Upload Test Video</p>
                            <p className="text-xs font-tech text-muted-foreground tracking-wider">Add a video with known transcript for verification</p>
                        </div>
                        <Button variant="glow" size="sm">
                            <Upload className="w-4 h-4 mr-2" /> Upload
                        </Button>
                    </div>
                </GlowCard>

                {/* Search */}
                <div className="flex gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search test videos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-input/50 border-border/50 focus:border-primary/50 font-tech"
                        />
                    </div>
                    <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "Passed", value: "3/6", color: "hsl(160, 80%, 45%)" },
                        { label: "Partial", value: "2/6", color: "hsl(35, 95%, 55%)" },
                        { label: "Failed", value: "1/6", color: "hsl(0, 80%, 55%)" },
                    ].map((s, i) => (
                        <GlowCard key={s.label} delay={0.15 + i * 0.05} className="p-4 text-center" glowColor={s.color}>
                            <p className="text-xs font-tech text-muted-foreground tracking-wider">{s.label}</p>
                            <p className="text-2xl font-display mt-1" style={{ color: s.color }}>{s.value}</p>
                        </GlowCard>
                    ))}
                </div>

                {/* Test Results */}
                <div className="space-y-3">
                    {filtered.map((video, i) => (
                        <GlowCard key={video.id} delay={0.2 + i * 0.05} className="p-5">
                            <div className="flex items-center gap-4 mb-3">
                                <FileVideo className="w-5 h-5 text-primary" />
                                <span className="text-sm font-tech text-foreground flex-1">{video.name}</span>
                                <span className={`inline-flex items-center gap-1.5 text-xs font-tech tracking-wider uppercase ${getStatusColor(video.status)}`}>
                                    {getStatusIcon(video.status)} {video.status}
                                </span>
                                <span className="text-sm font-display" style={{
                                    color: video.match >= 95 ? "hsl(160, 80%, 45%)" : video.match >= 85 ? "hsl(35, 95%, 55%)" : "hsl(0, 80%, 55%)"
                                }}>
                                    {video.match}%
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                                    <p className="text-xs font-tech text-muted-foreground mb-1 tracking-wider">EXPECTED</p>
                                    <p className="text-sm font-body text-foreground/70">{video.expected}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-muted/20 border border-border/20">
                                    <p className="text-xs font-tech text-muted-foreground mb-1 tracking-wider">ACTUAL OUTPUT</p>
                                    <p className="text-sm font-body text-foreground/70">{video.actual}</p>
                                </div>
                            </div>
                            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        background: video.match >= 95
                                            ? "hsl(160, 80%, 45%)"
                                            : video.match >= 85
                                                ? "hsl(35, 95%, 55%)"
                                                : "hsl(0, 80%, 55%)"
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${video.match}%` }}
                                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                />
                            </div>
                        </GlowCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Verification;
