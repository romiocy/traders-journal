"use client";

import { motion, useInView, useSpring, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useRef, useEffect, useState } from "react";

// Full page transition wrapper
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Staggered fade-in for lists/grids
export function FadeInStagger({
  children,
  className = "",
  staggerDelay = 0.06,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual fade-in item (used inside FadeInStagger)
export function FadeInItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Simple fade-in with delay (for standalone elements)
export function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// Scale-in animation (good for cards)
export function ScaleIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────
// SCROLL-TRIGGERED ANIMATIONS
// ──────────────────────────────────────────────────

// Scroll-triggered fade-in (animates when element enters viewport)
export function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 40,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const directionMap = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionMap[direction] }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered stagger container
export function ScrollStagger({
  children,
  className = "",
  staggerDelay = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered stagger item
export function ScrollStaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Scroll-triggered scale reveal
export function ScrollScaleIn({
  children,
  className = "",
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────
// HOVER ANIMATED CARD
// ──────────────────────────────────────────────────

export function HoverCard({
  children,
  className = "",
  hoverScale = 1.02,
  glowColor = "rgba(59, 130, 246, 0.15)",
}: {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{
        scale: hoverScale,
        boxShadow: `0 20px 60px ${glowColor}`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────
// ANIMATED COUNTER (counts up when visible)
// ──────────────────────────────────────────────────

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
  duration = 1.5,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(latest.toFixed(decimals));
    });
    return unsubscribe;
  }, [springValue, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// ──────────────────────────────────────────────────
// FLOATING PARTICLES BACKGROUND
// ──────────────────────────────────────────────────

export function FloatingParticles({
  count = 15,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.05,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────
// ANIMATED PROGRESS BAR
// ──────────────────────────────────────────────────

export function AnimatedProgressBar({
  value,
  maxValue = 100,
  color = "from-blue-500 to-cyan-400",
  className = "",
  height = "h-2",
  label,
  showPercentage = false,
}: {
  value: number;
  maxValue?: number;
  color?: string;
  className?: string;
  height?: string;
  label?: string;
  showPercentage?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const percentage = Math.min((value / maxValue) * 100, 100);

  return (
    <div ref={ref} className={className}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm mb-1.5">
          {label && <span className="text-slate-300 font-medium">{label}</span>}
          {showPercentage && <span className="text-slate-400">{percentage.toFixed(1)}%</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-slate-700/50 rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────
// SLIDE IN FROM SIDE
// ──────────────────────────────────────────────────

export function SlideIn({
  children,
  className = "",
  from = "left",
  delay = 0,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: from === "left" ? -60 : 60 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────
// TEXT REVEAL (word by word or letter by letter)
// ──────────────────────────────────────────────────

export function TextReveal({
  text,
  className = "",
  delay = 0,
  mode = "word",
}: {
  text: string;
  className?: string;
  delay?: number;
  mode?: "word" | "letter";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const items = mode === "word" ? text.split(" ") : text.split("");

  return (
    <span ref={ref} className={className}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + i * (mode === "word" ? 0.08 : 0.03),
          }}
        >
          {item}{mode === "word" ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

// ──────────────────────────────────────────────────
// GLOW PULSE (pulsing glow ring behind element)
// ──────────────────────────────────────────────────

export function GlowPulse({
  children,
  className = "",
  color = "blue",
}: {
  children: ReactNode;
  className?: string;
  color?: "blue" | "green" | "red" | "cyan";
}) {
  const colorMap = {
    blue: "bg-blue-500/20",
    green: "bg-green-500/20",
    red: "bg-red-500/20",
    cyan: "bg-cyan-500/20",
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`absolute -inset-1 ${colorMap[color]} rounded-xl blur-xl`}
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
