import { motion } from "framer-motion";
import { Clock, Eye } from "lucide-react";
import GlowCard from "@/components/GlowCard";

const recentActivity = [
    { id: 1, file: "interview_clip_042.mp4", status: "completed", words: 234, accuracy: 98.2, time: "2 min ago" },
    { id: 2, file: "lecture_recording.mp4", status: "processing", words: 0, accuracy: 0, time: "Just now" },
    { id: 3, file: "news_broadcast_11.mp4", status: "completed", words: 567, accuracy: 96.8, time: "15 min ago" },
    { id: 4, file: "conference_talk.mp4", status: "completed", words: 1023, accuracy: 97.5, time: "1 hour ago" },
    { id: 5, file: "podcast_ep12.mp4", status: "completed", words: 3421, accuracy: 95.3, time: "3 hours ago" },
];

const DashboardActivity = () => {
    return (
        <GlowCard className="p-6 relative z-10" delay={0.5}>
            <div className="flex items-center gap-3 mb-6">
                <motion.div
                    className="p-2 rounded-lg bg-primary/10"
                    animate={{ boxShadow: ["0 0 0px hsl(185 100% 50% / 0)", "0 0 15px hsl(185 100% 50% / 0.2)", "0 0 0px hsl(185 100% 50% / 0)"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    <Clock className="w-5 h-5 text-primary" />
                </motion.div>
                <h2 className="text-lg font-display tracking-wider text-foreground">Recent Decryptions</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border/30">
                            {["File", "Status", "Words", "Accuracy", "Time"].map(h => (
                                <th key={h} className="text-left text-xs font-tech tracking-[0.15em] text-muted-foreground pb-3 uppercase">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {recentActivity.map((item, i) => (
                            <motion.tr
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="group hover:bg-muted/20 transition-colors"
                            >
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-3">
                                        <Eye className="w-4 h-4 text-primary/60" />
                                        <span className="text-sm font-tech text-foreground">{item.file}</span>
                                    </div>
                                </td>
                                <td className="py-3 pr-4">
                                    {item.status === "processing" ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-tech tracking-wider text-amber-glow">
                                            <motion.span
                                                animate={{ opacity: [1, 0.3, 1] }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className="w-1.5 h-1.5 rounded-full bg-amber-glow"
                                            />
                                            PROCESSING
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-tech tracking-wider text-emerald-glow">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow" />
                                            COMPLETE
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 pr-4 text-sm font-display text-foreground">{item.words || "—"}</td>
                                <td className="py-3 pr-4 text-sm font-display text-primary">{item.accuracy ? `${item.accuracy}%` : "—"}</td>
                                <td className="py-3 text-xs font-tech text-muted-foreground">{item.time}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </GlowCard>
    );
};

export default DashboardActivity;
