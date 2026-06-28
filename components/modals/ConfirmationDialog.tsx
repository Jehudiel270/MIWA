"use client";

import { Modal } from "@/components/ui/motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

type ConfirmationType = "success" | "error" | "warning" | "info";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ConfirmationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDangerous?: boolean;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    bg: "bg-[#10b981]/10",
    border: "border-[#10b981]/20",
    icon: "text-[#10b981]",
    button: "bg-[#10b981] hover:bg-[#0d9668]",
  },
  error: {
    bg: "bg-[#d4183d]/10",
    border: "border-[#d4183d]/20",
    icon: "text-[#d4183d]",
    button: "bg-[#d4183d] hover:bg-[#b81231]",
  },
  warning: {
    bg: "bg-[#d4643f]/10",
    border: "border-[#d4643f]/20",
    icon: "text-[#d4643f]",
    button: "bg-[#d4643f] hover:bg-[#c25838]",
  },
  info: {
    bg: "bg-[#3b82f6]/10",
    border: "border-[#3b82f6]/20",
    icon: "text-[#3b82f6]",
    button: "bg-[#3b82f6] hover:bg-[#2563eb]",
  },
};

/**
 * ConfirmationDialog - Modal de confirmation réutilisable
 * Supporte différents types (success, error, warning, info)
 */
export function ConfirmationDialog({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmationDialogProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="sm" closeButton={false}>
      {/* Icon */}
      <div
        className={`${colors.bg} border ${colors.border} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
      >
        <Icon className={`w-8 h-8 ${colors.icon}`} />
      </div>

      {/* Content */}
      <h2 className="text-lg font-semibold text-[#2d2520] text-center mb-2">
        {title}
      </h2>
      <p className="text-sm text-[#786f69] text-center mb-6">{message}</p>

      {/* Footer */}
      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="flex-1 px-4 py-3 border border-[#e8e1db] rounded-xl text-[#2d2520] hover:bg-[#f5f1ed] transition-colors"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`flex-1 px-4 py-3 text-white rounded-xl transition-colors ${colors.button}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmationDialog;
