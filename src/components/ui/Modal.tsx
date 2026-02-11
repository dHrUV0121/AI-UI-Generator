import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`
          relative bg-white rounded-2xl shadow-2xl w-full mx-4
          ${sizeStyles[size]}
          animate-[fadeIn_0.2s_ease-out]
        `}
            >
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="px-6 py-5">{children}</div>
                {footer && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex justify-end gap-2">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
