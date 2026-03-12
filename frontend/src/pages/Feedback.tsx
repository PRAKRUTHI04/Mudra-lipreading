import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, Send, ThumbsUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlowCard from "@/components/GlowCard";
import { toast } from "sonner";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = ["Accuracy", "Speed", "UI/UX", "Features", "General"];

  const handleSubmit = () => {
    if (!rating || !feedback) {
      toast.error("Please provide a rating and feedback");
      return;
    }
    setSubmitted(true);
    toast.success("Feedback submitted successfully!");
  };

  const feedbackHistory = [
    { user: "Dr. Sarah", rating: 5, text: "Incredible accuracy on medical lectures. The LSTM model handles technical jargon beautifully.", date: "2 days ago" },
    { user: "Alex K.", rating: 4, text: "Great speed improvements in v3.2. Would love to see batch processing support.", date: "4 days ago" },
    { user: "Maria R.", rating: 5, text: "The neural network visualization on the dashboard is stunning. Best AI tool I've used.", date: "1 week ago" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold glow-text">Neural Feedback</h1>
        <p className="text-muted-foreground font-tech text-lg mt-1 tracking-wide">
          Help us improve the MUDRA experience
        </p>
      </motion.div>

      {!submitted ? (
        <GlowCard className="p-8" delay={0.2}>
          <div className="space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">
                Experience Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-all duration-200 ${
                        star <= (hoveredStar || rating)
                          ? "fill-primary text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                    className="font-tech tracking-wider text-xs"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="space-y-3">
              <label className="text-xs font-tech tracking-widest uppercase text-muted-foreground">
                Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with MUDRA..."
                rows={5}
                className="w-full rounded-lg bg-input/50 border border-border/50 p-4 font-tech text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all duration-300 resize-none"
              />
            </div>

            <Button variant="glow" size="lg" onClick={handleSubmit} className="w-full">
              <Send className="w-4 h-4 mr-2" /> Submit Feedback
            </Button>
          </div>
        </GlowCard>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlowCard className="p-12 text-center" glowColor="hsl(160, 80%, 45%)">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <ThumbsUp className="w-16 h-16 text-emerald-glow mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-display glow-text mb-2">Thank You!</h2>
            <p className="text-muted-foreground font-tech tracking-wide">
              Your feedback helps train our neural systems
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
              Submit Another
            </Button>
          </GlowCard>
        </motion.div>
      )}

      {/* Recent Feedback */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-display tracking-wider text-foreground">Community Feedback</h2>
        </div>
        <div className="space-y-3">
          {feedbackHistory.map((fb, i) => (
            <GlowCard key={i} delay={0.5 + i * 0.1} className="p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-tech text-foreground">{fb.user}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: fb.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="text-xs font-tech text-muted-foreground">{fb.date}</span>
                  </div>
                  <p className="text-sm font-body text-foreground/70">{fb.text}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Feedback;
