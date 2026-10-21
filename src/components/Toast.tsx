"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

type Toast = { id: number; text: string; icon?: string };
const Ctx = createContext<(text: string, icon?: string) => void>(() => {});

export function useToast() {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const id = useRef(0);

  const push = useCallback((text: string, icon = "✅") => {
    const t = { id: ++id.current, text, icon };
    setToasts((ts) => [...ts.slice(-2), t]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== t.id)), 2800);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              className="toast"
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              <span aria-hidden="true">{t.icon}</span>
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}
