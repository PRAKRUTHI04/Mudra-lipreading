import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Fingerprint, Shield, Cpu, Waves, Scan, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoBackground from "@/components/VideoBackground";
import AuroraEffect from "@/components/AuroraEffect";
import HolographicGrid from "@/components/HolographicGrid";
import ParticleField from "@/components/ParticleField";
import LipFocusOverlay from "@/components/LipFocusOverlay";
import CinematicText from "@/components/CinematicText";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
        }, 2500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-background">
            {/* Cinematic Video Background - people speaking, lip close-ups */}
            <VideoBackground variant="login" />

            {/* Lip tracking crosshair overlay */}
            <LipFocusOverlay />

            {/* Aurora light effects */}
            <AuroraEffect />

            {/* Holographic grid overlay */}
            <HolographicGrid />

            {/* Interactive particle system */}
            <ParticleField />

            {/* Grid background */}
            <div className="absolute inset-0 grid-bg opacity-20" />

            {/* Floating cinematic orbs */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 80, 0],
                    y: [0, -60, 30, -40, 0],
                    scale: [1, 1.3, 0.9, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-[0.08]"
                style={{ background: "radial-gradient(circle, hsl(185 100% 50%), transparent)", filter: "blur(80px)" }}
            />
            <motion.div
                animate={{
                    x: [0, -80, 60, -40, 0],
                    y: [0, 50, -70, 60, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, hsl(270 80% 60%), transparent)", filter: "blur(100px)" }}
            />

            {/* Login card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-md mx-4"
            >
                {/* Card outer glow */}
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-2 rounded-3xl"
                    style={{
                        background: "linear-gradient(135deg, hsl(185 100% 50% / 0.15), hsl(270 80% 60% / 0.08), hsl(185 100% 50% / 0.1))",
                        filter: "blur(30px)",
                    }}
                />

                <div className="relative glass-card glow-border p-8 space-y-8 rounded-2xl backdrop-blur-xl" style={{
                    background: "linear-gradient(145deg, hsl(220 25% 7% / 0.9), hsl(220 25% 4% / 0.95))",
                }}>
                    {/* Logo section */}
                    <motion.div
                        className="text-center space-y-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        <div className="relative inline-flex items-center justify-center">
                            {/* Outer scanning ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute w-28 h-28 rounded-full"
                                style={{ border: "1px solid hsl(185 100% 50% / 0.15)" }}
                            >
                                {/* Ring node */}
                                <motion.div
                                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/60"
                                    style={{ boxShadow: "0 0 8px hsl(185 100% 50% / 0.5)" }}
                                />
                            </motion.div>
                            {/* Middle ring */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute w-22 h-22 rounded-full"
                                style={{ width: 88, height: 88, border: "1px solid hsl(270 80% 60% / 0.2)" }}
                            >
                                <motion.div
                                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent/60"
                                />
                            </motion.div>
                            {/* Inner ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute w-16 h-16 rounded-full"
                                style={{ border: "1px dashed hsl(185 100% 50% / 0.12)" }}
                            />
                            {/* Pulsing glow behind icon */}
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-14 h-14 rounded-full"
                                style={{ background: "radial-gradient(circle, hsl(185 100% 50% / 0.3), transparent)" }}
                            />
                            <motion.div
                                animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute w-20 h-20 rounded-full"
                                style={{ background: "radial-gradient(circle, hsl(270 80% 60% / 0.2), transparent)" }}
                            />
                            <Fingerprint className="w-10 h-10 text-primary relative z-10" />
                        </div>

                        <motion.h1
                            className="text-4xl font-display font-bold tracking-[0.3em] glow-text mt-8"
                        >
                            <CinematicText delay={0.6} stagger={0.06}>MUDRA</CinematicText>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="text-muted-foreground font-tech text-lg tracking-[0.2em]"
                        >
                            Neural Lip Reading Intelligence
                        </motion.p>

                        {/* Animated scan line under title */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                            className="h-px mx-auto max-w-[200px]"
                            style={{ background: "linear-gradient(90deg, transparent, hsl(185 100% 50% / 0.6), transparent)" }}
                        />

                        {/* Animated status badges */}
                        <div className="flex items-center justify-center gap-3 pt-2">
                            {[
                                { icon: Shield, label: "SECURE", color: "hsl(160 80% 45%)" },
                                { icon: Cpu, label: "AI POWERED", color: "hsl(185 100% 50%)" },
                                { icon: Scan, label: "LIP DETECT", color: "hsl(270 80% 60%)" },
                            ].map((badge, i) => (
                                <motion.div
                                    key={badge.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.6 + i * 0.15, type: "spring" }}
                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/30 bg-muted/20 backdrop-blur-sm"
                                >
                                    <badge.icon className="w-3 h-3" style={{ color: badge.color }} />
                                    <span className="text-[10px] font-tech tracking-widest" style={{ color: badge.color }}>{badge.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Animated divider */}
                    <div className="relative h-px w-full overflow-hidden">
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0"
                            style={{ background: "linear-gradient(90deg, transparent, hsl(185 100% 50% / 0.8), hsl(270 80% 60% / 0.6), transparent)" }}
                        />
                        <div className="neon-line" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-tech tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
                                <motion.span
                                    animate={focusedField === "email" ? { opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: focusedField === "email" ? "hsl(185 100% 50%)" : "hsl(220 20% 30%)" }}
                                />
                                Neural ID
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="operator@mudra.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField("email")}
                                    onBlur={() => setFocusedField(null)}
                                    className="bg-input/50 border-border/50 focus:border-primary/50 h-12 font-tech text-base placeholder:text-muted-foreground/40 transition-all duration-500 focus:shadow-[0_0_30px_hsl(var(--primary)/0.2),inset_0_0_15px_hsl(var(--primary)/0.05)]"
                                />
                                {focusedField === "email" && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                                    />
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="space-y-2"
                        >
                            <label className="text-xs font-tech tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
                                <motion.span
                                    animate={focusedField === "password" ? { opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] } : {}}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: focusedField === "password" ? "hsl(185 100% 50%)" : "hsl(220 20% 30%)" }}
                                />
                                Access Key
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    className="bg-input/50 border-border/50 focus:border-primary/50 h-12 font-tech text-base pr-12 placeholder:text-muted-foreground/40 transition-all duration-500 focus:shadow-[0_0_30px_hsl(var(--primary)/0.2),inset_0_0_15px_hsl(var(--primary)/0.05)]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                {focusedField === "password" && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                                    />
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <Button
                                type="submit"
                                variant="glow"
                                size="lg"
                                className="w-full h-14 text-sm relative overflow-hidden group"
                                disabled={isLoading}
                            >
                                {/* Animated border glow */}
                                <motion.div
                                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    style={{ boxShadow: "inset 0 0 20px hsl(185 100% 50% / 0.2)" }}
                                />
                                {/* Shimmer effect on button */}
                                <motion.div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.1), transparent)",
                                        backgroundSize: "200% 100%",
                                    }}
                                    animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <AnimatePresence mode="wait">
                                    {isLoading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="relative">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                                                />
                                            </div>
                                            <span className="font-tech tracking-[0.3em]">NEURAL HANDSHAKE</span>
                                            <motion.span
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >...</motion.span>
                                        </motion.div>
                                    ) : (
                                        <motion.span
                                            key="text"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="font-tech tracking-[0.3em] flex items-center gap-3"
                                        >
                                            <Radio className="w-4 h-4" />
                                            INITIALIZE SESSION
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </form>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center space-y-3"
                    >
                        <div className="neon-line" />
                        <div className="flex items-center justify-center gap-2">
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-emerald-glow"
                                style={{ boxShadow: "0 0 6px hsl(160 80% 45% / 0.6)" }}
                            />
                            <p className="text-xs text-muted-foreground font-tech tracking-[0.15em]">
                                LSTM × CNN POWERED • NEURAL ARCHITECTURE v3.2
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
