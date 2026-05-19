import { motion } from "framer-motion";
import { useMotionIntensity } from "../../context/MotionContext";

export default function PageTransition({ children, className = "" }) {
  const { isCalm } = useMotionIntensity();

  return (
    <motion.div
      initial={{ opacity: 0, y: isCalm ? 8 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isCalm ? -6 : -12 }}
      transition={{ duration: isCalm ? 0.24 : 0.38, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
