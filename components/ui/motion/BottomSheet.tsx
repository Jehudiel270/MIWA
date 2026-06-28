"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, sheetVariants } from "./animations";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeButton?: boolean;
  className?: string;
  maxHeight?: string;
}

/**
 * BottomSheet - Composant réutilisable pour modales depuis le bas
 * Idéal pour mobile, filtres, sélections
 */
export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  closeButton = true,
  className = "",
  maxHeight = "80vh",
}: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl ${className}`}
            style={{ maxHeight }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-[#e8e1db] rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e1db]">
                <h2 className="text-lg font-semibold text-[#2d2520]">
                  {title}
                </h2>
                {closeButton && (
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#f5f1ed] rounded-full transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5 text-[#786f69]" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: `calc(${maxHeight} - 60px)` }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BottomSheet;
