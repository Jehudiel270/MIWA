"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  fadeIn,
  slideInUp,
} from "./animations";

interface FadeContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  variant?: "fadeIn" | "slideInUp";
}

/**
 * FadeContainer - Wrapper pour animer des listes avec stagger
 */
export function FadeContainer({
  children,
  className = "",
  stagger = true,
  delay = 0,
  variant = "slideInUp",
}: FadeContainerProps) {
  const variants = {
    fadeIn: fadeIn,
    slideInUp: slideInUp,
  };

  if (stagger) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants[variant]}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * AnimatedItem - Item enfant pour stagger
 */
export function AnimatedItem({ children, className = "" }: AnimatedItemProps) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export default FadeContainer;
