import { motion } from "framer-motion";
import { Clock, FileVideo, Search, Filter, Eye, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlowCard from "@/components/GlowCard";
import { useState } from "react";

const historyData = [
  { id: 1, file: "interview_clip_042.mp4", date: "2026-03-09", words: 234, accuracy: 98.2, duration: "3.1s", output: "Thank you for joining us today..." },
  { id: 2, file: "news_broadcast_11.mp4", date: "2026-03-09", words: 567, accuracy: 96.8, duration: "8.4s", output: "Breaking news from the technology sector..." },
  { id: 3, file: "conference_talk.mp4", date: "2026-03-08", words: 1023, accuracy: 97.5, duration: "15.2s", output: "Today I want to share our research findings..." },
  { id: 4, file: "podcast_ep12.mp4", date: "2026-03-08", words: 3421, accuracy: 95.3, duration: "45.7s", output: "Welcome back to another episode of our podcast..." },
  { id: 5, file: "meeting_recording.mp4", date: "2026-03-07", words: 892, accuracy: 94.1, duration: "12.8s", output: "Let's review the quarterly progress..." },
  { id: 6, file: "tutorial_video.mp4", date: "2026-03-07", words: 456, accuracy: 99.1, duration: "6.3s", output: "In this tutorial we will learn how to..." },
  { id: 7, file: "presentation_final.mp4", date: "2026-03-06", words: 2341, accuracy: 96.5, duration: "32.1s", output: "Good morning everyone, let me begin..." },
];

const History = () => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = historyData.filter(h =>
    h.file.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold glow-text">Decryption Archive</h1>
        <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide">
          Browse your processing history
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-input/50 border-border/50 focus:border-primary/50 font-tech"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </motion.div>

      <div className="space-y-3">
        {filtered.map((item, i) => (
          <GlowCard key={item.id} delay={0.1 + i * 0.05} className="p-0 overflow-hidden">
            <div
              className="p-5 cursor-pointer"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-primary/10">
                  <FileVideo className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-tech text-foreground truncate">{item.file}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs font-tech text-muted-foreground">{item.date}</span>
                    <span className="text-xs font-tech text-primary">{item.words} words</span>
                    <span className="text-xs font-tech text-emerald-glow">{item.accuracy}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-tech text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />{item.duration}
                  </span>
                </div>
              </div>
            </div>

            {expandedId === item.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border/30 p-5 bg-muted/10"
              >
                <p className="text-xs font-tech tracking-widest text-muted-foreground mb-2 uppercase">Decoded Output</p>
                <p className="text-sm font-body text-foreground/80 leading-relaxed mb-4">{item.output}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" /> View Full
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-3 h-3 mr-1" /> Export
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </GlowCard>
        ))}
      </div>
    </div>
  );
};

export default History;
