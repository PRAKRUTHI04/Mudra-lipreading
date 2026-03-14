import { motion } from "framer-motion";

const NeuralNetwork = ({ className = "" }) => {
    const nodes = [
        // Input layer
        { x: 50, y: 80, layer: 0 },
        { x: 50, y: 160, layer: 0 },
        { x: 50, y: 240, layer: 0 },
        { x: 50, y: 320, layer: 0 },
        // Hidden 1
        { x: 150, y: 60, layer: 1 },
        { x: 150, y: 140, layer: 1 },
        { x: 150, y: 220, layer: 1 },
        { x: 150, y: 300, layer: 1 },
        { x: 150, y: 360, layer: 1 },
        // Hidden 2
        { x: 250, y: 100, layer: 2 },
        { x: 250, y: 200, layer: 2 },
        { x: 250, y: 300, layer: 2 },
        // Output
        { x: 350, y: 150, layer: 3 },
        { x: 350, y: 250, layer: 3 },
    ];

    const connections = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[j].layer === nodes[i].layer + 1) {
                connections.push([i, j]);
            }
        }
    }

    return (
        <svg viewBox="0 0 400 400" className={`${className}`}>
            {connections.map(([a, b], i) => (
                <motion.line
                    key={i}
                    x1={nodes[a].x} y1={nodes[a].y}
                    x2={nodes[b].x} y2={nodes[b].y}
                    stroke="hsl(185, 100%, 50%)"
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.05, 0.3, 0.05] }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                />
            ))}
            {nodes.map((node, i) => (
                <motion.circle
                    key={i}
                    cx={node.x} cy={node.y} r={4}
                    fill="hsl(185, 100%, 50%)"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.3, 1, 0.3], r: [3, 5, 3] }}
                    transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: node.layer * 0.3 }}
                />
            ))}
        </svg>
    );
};

export default NeuralNetwork;
