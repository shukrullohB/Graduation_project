import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMotionIntensity } from "../../context/MotionContext";

export default function InteractiveTilt({
  children,
  className = "",
  maxTilt = 8,
  ...motionProps
}) {
  const { intensity, isCalm } = useMotionIntensity();

  const canTilt =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const effectiveTilt = Math.max(1.6, maxTilt * intensity);

  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);

  const rotateX = useSpring(rotateXRaw, {
    stiffness: 220,
    damping: 24,
    mass: 0.5,
  });
  const rotateY = useSpring(rotateYRaw, {
    stiffness: 220,
    damping: 24,
    mass: 0.5,
  });

  const handleMove = (event) => {
    if (!canTilt) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    rotateYRaw.set(px * effectiveTilt);
    rotateXRaw.set(-py * effectiveTilt);
  };

  const resetTilt = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  return (
    <motion.div
      className={`tilt-surface ${className}`.trim()}
      style={
        canTilt
          ? { rotateX, rotateY, transformPerspective: isCalm ? 780 : 900 }
          : undefined
      }
      onPointerMove={handleMove}
      onPointerLeave={resetTilt}
      whileTap={{ scale: isCalm ? 0.995 : 0.99 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
