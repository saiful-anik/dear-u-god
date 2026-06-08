import { motion } from "framer-motion";

const hearts = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  size: 14 + Math.random() * 18,
  duration: 4 + Math.random() * 4,
}));

const FloatingHearts = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
    {hearts.map((h) => (
      <motion.div
        key={h.id}
        className="absolute text-primary/20"
        style={{ left: `${h.x}%`, bottom: "-30px", fontSize: h.size }}
        animate={{ y: [0, -800], opacity: [0.7, 0] }}
        transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: "easeOut" }}
      >
        ♥
      </motion.div>
    ))}
  </div>
);

export default FloatingHearts;
