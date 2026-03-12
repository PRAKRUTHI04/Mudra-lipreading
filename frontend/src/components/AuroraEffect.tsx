import { motion } from "framer-motion";

const AuroraEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora band 1 */}
      <motion.div
        animate={{
          x: ["-20%", "20%", "-10%", "15%", "-20%"],
          y: ["-10%", "5%", "-5%", "10%", "-10%"],
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, 5, -3, 7, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[800px] h-[400px] opacity-20"
        style={{
          background: "linear-gradient(135deg, hsl(185 100% 50% / 0.4), hsl(200 100% 60% / 0.2), transparent)",
          filter: "blur(80px)",
          borderRadius: "50%",
        }}
      />
      
      {/* Aurora band 2 */}
      <motion.div
        animate={{
          x: ["10%", "-15%", "20%", "-10%", "10%"],
          y: ["5%", "-10%", "15%", "-5%", "5%"],
          scale: [1.1, 0.9, 1.2, 1, 1.1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-[600px] h-[350px] opacity-15"
        style={{
          background: "linear-gradient(225deg, hsl(270 80% 60% / 0.5), hsl(300 80% 50% / 0.2), transparent)",
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
      />

      {/* Aurora band 3 */}
      <motion.div
        animate={{
          x: ["-5%", "10%", "-15%", "5%", "-5%"],
          y: ["-5%", "10%", "0%", "-10%", "-5%"],
          scale: [0.8, 1.1, 1, 1.2, 0.8],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-1/3 w-[700px] h-[300px] opacity-10"
        style={{
          background: "linear-gradient(180deg, hsl(160 80% 45% / 0.4), hsl(185 100% 50% / 0.2), transparent)",
          filter: "blur(90px)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default AuroraEffect;
