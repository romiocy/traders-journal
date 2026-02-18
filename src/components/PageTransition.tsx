"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

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
