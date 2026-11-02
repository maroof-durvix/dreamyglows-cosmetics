"use client";
import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3e3);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white border border-gray-150 rounded-xl py-3.5 px-5 shadow-xl animate-in slide-in-from-bottom-5 duration-350">
      {type === "success" ? <CheckCircle2 className="h-5 w-5 text-emerald-800 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
      <span className="text-xs font-semibold text-gray-805 tracking-wide">{message}</span>
      <button
    onClick={onClose}
    className="ml-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-all"
  >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>;
}
