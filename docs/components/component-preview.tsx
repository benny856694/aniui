"use client";

import React from "react";
import { motion } from "motion/react";

export function ComponentPreview({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-border bg-background p-10"
    >
      {children}
    </motion.div>
  );
}
