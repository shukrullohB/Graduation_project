import { motion } from "framer-motion";
import { useMotionIntensity } from "../../context/MotionContext";

export default function GlassPanel({ children, className = "", delay = 0 }) {
  const { isCalm } = useMotionIntensity();

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: isCalm ? 12 : 20,
        scale: isCalm ? 0.993 : 0.985,
      }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: isCalm ? 0.28 : 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`glass-panel ${className}`}
    >
      {children}
    </motion.section>
  );
}
