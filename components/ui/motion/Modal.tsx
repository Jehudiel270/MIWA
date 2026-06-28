"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backdropVariants, modalVariants } from "./animations";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeButton?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

/**
 * Modal - Composant réutilisable pour dialogues centrés
 * Parfait pour confirmations, saisies de données
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButton = true,
  className = "",
  size = "md",
  footer,
}: ModalProps) {
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
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl z-50 shadow-2xl w-11/12 ${sizeStyles[size]} ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e1db]">
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
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-[#e8e1db]">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
