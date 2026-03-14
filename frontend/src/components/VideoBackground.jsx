import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const VideoBackground = ({ variant = "default", overlay = true }) => {
    const videoRef = useRef(null);
    const videoRef2 = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);

    // NOTE: External demo video URLs often 403 (and we want localhost-only).
    // This component keeps the cinematic overlays but disables remote videos.
    const videoSources = {
        login: [],
        dashboard: [],
        process: [],
        default: [],
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
        if (videoRef2.current) {
            videoRef2.current.playbackRate = 0.4;
        }
    }, []);

    const sources = videoSources[variant] || videoSources.default;
    const showVideo = sources.length > 0;

    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Primary video layer */}
            {showVideo ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loaded ? 1 : 0 }}
                    transition={{ duration: 2.5 }}
                    className="absolute inset-0"
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onCanPlay={() => setLoaded(true)}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "brightness(0.25) saturate(1.6) contrast(1.1) hue-rotate(-10deg)" }}
                    >
                        <source src={sources[0]} type="video/mp4" />
                    </video>
                </motion.div>
            ) : (
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at 20% 30%, hsl(185 100% 50% / 0.06) 0%, transparent 55%)," +
                            "radial-gradient(ellipse at 80% 20%, hsl(270 80% 60% / 0.06) 0%, transparent 50%)," +
                            "radial-gradient(ellipse at 50% 80%, hsl(160 80% 45% / 0.05) 0%, transparent 55%)," +
                            "linear-gradient(180deg, hsl(220 20% 4% / 0.95) 0%, hsl(220 20% 4% / 0.9) 100%)",
                    }}
                />
            )}

            {/* Secondary blended video layer for depth */}
            {showVideo && sources.length > 1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loaded2 ? 0.3 : 0 }}
                    transition={{ duration: 3, delay: 1 }}
                    className="absolute inset-0 mix-blend-screen"
                >
                    <video
                        ref={videoRef2}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onCanPlay={() => setLoaded2(true)}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "brightness(0.2) saturate(2) hue-rotate(20deg) blur(2px)" }}
                    >
                        <source src={sources[1]} type="video/mp4" />
                    </video>
                </motion.div>
            )}

            {overlay && (
                <>
                    {/* Deep cinematic gradient overlay */}
                    <div className="absolute inset-0" style={{
                        background: `
              linear-gradient(180deg, 
                hsl(220 20% 4% / 0.7) 0%, 
                hsl(220 20% 4% / 0.3) 30%, 
                hsl(220 20% 4% / 0.4) 60%, 
                hsl(220 20% 4% / 0.85) 100%
              )
            `
                    }} />

                    {/* Cinematic color grading overlay */}
                    <div className="absolute inset-0" style={{
                        background: `
              radial-gradient(ellipse at 20% 30%, hsl(185 100% 50% / 0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, hsl(270 80% 60% / 0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 80%, hsl(160 80% 45% / 0.06) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, hsl(185 100% 50% / 0.05) 0%, transparent 30%)
            `
                    }} />

                    {/* Film grain texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                    }} />

                    {/* Scan lines - cinematic CRT effect */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 0% / 0.04) 2px, hsl(0 0% 0% / 0.04) 4px)",
                        backgroundSize: "100% 4px"
                    }} />

                    {/* Cinematic letterbox bars */}
                    <div className="absolute inset-x-0 top-0 h-[2px]" style={{
                        background: "linear-gradient(90deg, transparent, hsl(185 100% 50% / 0.3), hsl(270 80% 60% / 0.2), transparent)"
                    }} />

                    {/* Vignette - heavy cinematic */}
                    <div className="absolute inset-0" style={{
                        background: "radial-gradient(ellipse at center, transparent 30%, hsl(220 20% 4% / 0.7) 70%, hsl(220 20% 4% / 0.95) 100%)"
                    }} />

                    {/* Breathing light pulse */}
                    <motion.div
                        animate={{ opacity: [0.02, 0.06, 0.02] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0"
                        style={{
                            background: "radial-gradient(circle at 40% 40%, hsl(185 100% 50% / 0.15), transparent 60%)"
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default VideoBackground;
