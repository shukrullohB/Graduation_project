import { useEffect, useMemo } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMotionIntensity } from "../../context/MotionContext";

export default function FuturisticBackground({
  children,
  visualTheme = "ocean-neon",
}) {
  const { intensity, isCalm } = useMotionIntensity();
  const motionProfile = useMemo(() => {
    if (visualTheme === "emerald-aurora") {
      return {
        speed: 1.22,
        drift: 0.72,
        contrast: 0.84,
        particleLift: 0.74,
        particleGlow: 0.82,
        meshDensity: 0.9,
        nodeScale: 0.94,
        ambience: 0.88,
      };
    }

    if (visualTheme === "cyber-magenta") {
      return {
        speed: 0.74,
        drift: 1.24,
        contrast: 1.18,
        particleLift: 1.2,
        particleGlow: 1.15,
        meshDensity: 1.12,
        nodeScale: 1.05,
        ambience: 1,
      };
    }

    return {
      speed: 1,
      drift: 1,
      contrast: 1,
      particleLift: 1,
      particleGlow: 1,
      meshDensity: 1,
      nodeScale: 1,
      ambience: 1,
    };
  }, [visualTheme]);
  const speedFactor = (isCalm ? 1.28 : 1) * motionProfile.speed;
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const smoothX = useSpring(pointerX, {
    stiffness: 28,
    damping: 26,
    mass: 0.7,
  });
  const smoothY = useSpring(pointerY, {
    stiffness: 28,
    damping: 26,
    mass: 0.7,
  });

  const glowX = useTransform(smoothX, [0, 1], ["18%", "82%"]);
  const glowY = useTransform(smoothY, [0, 1], ["20%", "78%"]);
  const bubbleX = useTransform(smoothX, [0, 1], ["8%", "92%"]);
  const bubbleY = useTransform(smoothY, [0, 1], ["14%", "86%"]);
  const parallaxX = useTransform(
    smoothX,
    [0, 1],
    [-22 * intensity, 22 * intensity],
  );
  const parallaxY = useTransform(
    smoothY,
    [0, 1],
    [-18 * intensity, 18 * intensity],
  );
  const sphereX = useTransform(parallaxX, (v) => v * 0.32);
  const sphereY = useTransform(parallaxY, (v) => v * 0.28);

  useEffect(() => {
    const onMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      pointerX.set(Math.min(1, Math.max(0, x)));
      pointerY.set(Math.min(1, Math.max(0, y)));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);

  const particles = useMemo(
    () =>
      Array.from({ length: isCalm ? 10 : 20 }, (_, index) => ({
        id: index,
        left: `${6 + ((index * 17) % 88)}%`,
        top: `${8 + ((index * 23) % 82)}%`,
        size: 1 + (index % 3),
        delay: (index % 7) * 0.45,
        duration:
          (7 + (index % 5) * 1.4) * (isCalm ? 1.45 : 1) * motionProfile.speed,
      })),
    [isCalm, motionProfile.speed],
  );

  const binaryStreams = useMemo(() => {
    const count = isCalm ? 24 : 34;
    const rand = (seed) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    const tokens = ["AI", "ML", "NLP", "LLM", "CV"];

    return Array.from({ length: count }, (_, index) => {
      const rowSeed = rand(index + 1.7);
      const rows = Math.round(
        (isCalm ? 22 : 26) + rowSeed * (isCalm ? 10 : 20),
      );
      const bits = Array.from({ length: rows }, (_, rowIndex) => {
        const tokenChance = rand(index * 5.13 + rowIndex * 0.73);
        const tokenThreshold =
          visualTheme === "cyber-magenta"
            ? isCalm
              ? 0.99
              : 0.98
            : visualTheme === "emerald-aurora"
              ? isCalm
                ? 0.996
                : 0.989
              : isCalm
                ? 0.993
                : 0.986;
        if (tokenChance > tokenThreshold) {
          return tokens[(index + rowIndex) % tokens.length];
        }
        return rand(index * 17.3 + rowIndex * 6.11) > 0.5 ? "1" : "0";
      }).join("\n");

      const bright = rand(index * 3.41) > 0.7;
      const tone = rand(index * 2.27) > 0.55 ? "lime" : "mint";

      return {
        id: index,
        left: `${1 + index * (97 / count) + rand(index * 1.91) * 1.2}%`,
        delay: rand(index * 4.7) * (isCalm ? 2.8 : 2.2),
        duration:
          ((isCalm ? 16 : 9.8) + rand(index * 5.11) * 6.2) * speedFactor,
        drift:
          (rand(index * 8.13) - 0.5) * (isCalm ? 12 : 22) * motionProfile.drift,
        blur: rand(index * 9.17) > 0.84 ? 0.3 : 0,
        bits,
        bright,
        tone,
        opacity: isCalm
          ? (0.2 + rand(index * 2.5) * 0.22) * motionProfile.contrast
          : (0.28 + rand(index * 2.5) * 0.36) * motionProfile.contrast,
      };
    });
  }, [
    isCalm,
    motionProfile.contrast,
    motionProfile.drift,
    speedFactor,
    visualTheme,
  ]);

  const dataStreams = useMemo(
    () =>
      Array.from({ length: isCalm ? 5 : 8 }, (_, index) => ({
        id: index,
        top: `${18 + index * 9.8}%`,
        width: `${42 + (index % 4) * 13}%`,
        delay: (index % 5) * 0.6,
        duration: ((isCalm ? 10 : 6.6) + (index % 3) * 1.25) * speedFactor,
        reverse: index % 2 === 1,
      })),
    [isCalm, speedFactor],
  );

  const meshPoints = useMemo(() => {
    const baseCount = isCalm ? 32 : 56;
    const count = Math.max(
      24,
      Math.round(baseCount * motionProfile.meshDensity),
    );
    return Array.from({ length: count }, (_, index) => {
      const t = (index / count) * Math.PI * 2;
      const wave = Math.sin(index * 2.17) * 22;
      const rx = 280 + Math.cos(index * 0.47) * 48;
      const ry = 168 + Math.sin(index * 0.63) * 32;
      return {
        id: index,
        x: 600 + Math.cos(t) * rx + wave,
        y: 270 + Math.sin(t) * ry + Math.cos(index * 1.41) * 26,
        pulseDelay: (index % 9) * 0.18,
      };
    });
  }, [isCalm, motionProfile.meshDensity]);

  const meshLinks = useMemo(() => {
    const links = [];
    for (let i = 0; i < meshPoints.length; i += 1) {
      const a = meshPoints[i];
      links.push({
        a,
        b: meshPoints[(i + 1) % meshPoints.length],
        id: `${i}-n`,
      });
      if (i % 2 === 0) {
        links.push({
          a,
          b: meshPoints[(i + 5) % meshPoints.length],
          id: `${i}-f`,
        });
      }
      if (i % 3 === 0) {
        links.push({
          a,
          b: meshPoints[(i + 11) % meshPoints.length],
          id: `${i}-x`,
        });
      }
    }
    return links;
  }, [meshPoints]);

  return (
    <div className="futuristic-bg">
      <div className="futuristic-bg-base" aria-hidden="true" />
      <div className="ai-dome" aria-hidden="true" />
      <div className="ai-dome-glow" aria-hidden="true" />
      <div className="futuristic-bg-grid" aria-hidden="true" />
      <div className="futuristic-bg-noise" aria-hidden="true" />
      <div className="binary-rain" aria-hidden="true">
        {binaryStreams.map((stream) => (
          <span
            key={stream.id}
            className={`binary-column binary-column--${stream.tone}${stream.bright ? " binary-column--bright" : ""}`}
            style={{
              left: stream.left,
              animationDelay: `${stream.delay}s`,
              animationDuration: `${stream.duration}s`,
              opacity: stream.opacity,
              filter: `blur(${stream.blur}px)`,
              "--binary-drift": `${stream.drift}px`,
            }}
          >
            {stream.bits}
          </span>
        ))}
      </div>
      <div className="data-flow-layer" aria-hidden="true">
        {dataStreams.map((stream) => (
          <span
            key={stream.id}
            className={`data-stream${stream.reverse ? " data-stream--reverse" : ""}`}
            style={{
              top: stream.top,
              width: stream.width,
              animationDelay: `${stream.delay}s`,
              animationDuration: `${stream.duration}s`,
            }}
          >
            <i className="data-stream-packet" />
          </span>
        ))}
      </div>

      <svg className="ai-neural-mesh" viewBox="0 0 1200 800" aria-hidden="true">
        <g className="ai-neural-links">
          {meshLinks.map((link, index) => (
            <motion.line
              key={link.id}
              x1={link.a.x}
              y1={link.a.y}
              x2={link.b.x}
              y2={link.b.y}
              initial={{ opacity: 0.18 }}
              animate={{
                opacity: isCalm
                  ? [0.18, Math.min(0.86, 0.36 * motionProfile.contrast), 0.18]
                  : [0.18, Math.min(0.92, 0.52 * motionProfile.contrast), 0.18],
              }}
              transition={{
                duration: (isCalm ? 4.8 : 2.8) * speedFactor,
                delay: (index % 12) * 0.12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
        <g className="ai-neural-nodes">
          {meshPoints.map((point) => (
            <motion.circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={(isCalm ? 2.2 : 2.8) * motionProfile.nodeScale}
              initial={{ opacity: 0.52 }}
              animate={{
                opacity: isCalm
                  ? [0.48, Math.min(0.94, 0.78 * motionProfile.contrast), 0.48]
                  : [0.48, Math.min(1, 0.92 * motionProfile.contrast), 0.48],
              }}
              transition={{
                duration: (isCalm ? 3.6 : 2.2) * speedFactor,
                delay: point.pulseDelay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>
      </svg>

      <motion.div
        aria-hidden="true"
        className="futuristic-bg-orb futuristic-bg-orb--blue"
        style={{ x: parallaxX, y: parallaxY }}
      />
      <motion.div
        aria-hidden="true"
        className="futuristic-bg-orb futuristic-bg-orb--cyan"
        style={{
          x: useTransform(parallaxX, (v) => -v * 0.8),
          y: useTransform(parallaxY, (v) => -v * 0.7),
        }}
      />
      <motion.div
        aria-hidden="true"
        className="futuristic-bg-orb futuristic-bg-orb--violet"
        style={{
          x: useTransform(parallaxX, (v) => v * 0.55),
          y: useTransform(parallaxY, (v) => -v * 0.9),
        }}
      />
      <motion.div
        aria-hidden="true"
        className="futuristic-bg-orb futuristic-bg-orb--gold"
        style={{
          x: useTransform(parallaxX, (v) => -v * 0.45),
          y: useTransform(parallaxY, (v) => v * 0.35),
        }}
      />
      <motion.div
        aria-hidden="true"
        className="futuristic-bg-orb futuristic-bg-orb--mint"
        style={{
          x: useTransform(parallaxX, (v) => v * 0.22),
          y: useTransform(parallaxY, (v) => v * -0.52),
        }}
      />

      <motion.div
        aria-hidden="true"
        className="futuristic-bg-spotlight"
        style={{ left: glowX, top: glowY }}
      />

      <motion.div
        aria-hidden="true"
        className="futuristic-cursor-bubble"
        style={{ left: bubbleX, top: bubbleY, opacity: isCalm ? 0.45 : 0.76 }}
      >
        <span className="futuristic-cursor-bubble-core" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="jarvis-sphere"
        style={{ x: sphereX, y: sphereY, opacity: isCalm ? 0.58 : 0.92 }}
      >
        <div className="jarvis-sphere-core" />
        <div className="jarvis-sphere-ring jarvis-sphere-ring--one" />
        <div className="jarvis-sphere-ring jarvis-sphere-ring--two" />
        <div className="jarvis-sphere-ring jarvis-sphere-ring--three" />
        <div className="jarvis-sphere-glow" />
      </motion.div>

      <svg
        className="futuristic-bg-orbits"
        viewBox="0 0 1200 800"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <ellipse cx="620" cy="400" rx="430" ry="250" />
          <ellipse cx="620" cy="400" rx="340" ry="190" />
          <path d="M140 560c180-140 460-170 890-60" />
        </g>
      </svg>

      <div className="futuristic-bg-particles" aria-hidden="true">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="futuristic-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, (isCalm ? -4 : -10) * motionProfile.particleLift, 0],
              opacity: [
                0.2,
                Math.min(
                  0.96,
                  (isCalm ? 0.55 : 0.85) * motionProfile.particleGlow,
                ),
                0.2,
              ],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="futuristic-bg-content">{children}</div>
    </div>
  );
}
