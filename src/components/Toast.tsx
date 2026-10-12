"use client";

import { usePathname } from "next/navigation";
import { Suspense, createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icons";

interface ToastItem {
  id: number;
  msg: string;
  icon: IconName;
  /** route the toast belongs to — it disappears as soon as the route changes */
  path: string | null;
}
type ToastFn = (msg: string, icon?: IconName, path?: string) => void;

const ToastCtx = createContext<ToastFn>(() => {});

/** Renders the toast only while the user is still on the route it was raised on */
function ToastHost({ t, onPath }: { t: ToastItem | null; onPath: (p: string) => void }) {
  const pathname = usePathname();
  useEffect(() => onPath(pathname), [pathname, onPath]);
  return (
    <div aria-live="polite" className="toast-live">
      {t && (t.path === null || t.path === pathname) && (
        <div className="toast" role="status" key={t.id}>
          <Icon name={t.icon} size={16} />
          <span>{t.msg}</span>
        </div>
      )}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const pathRef = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const seq = useRef(0);
  const [t, setT] = useState<ToastItem | null>(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  const onPath = useCallback((p: string) => {
    pathRef.current = p;
  }, []);

  const toast = useCallback<ToastFn>((msg, icon = "info", path) => {
    clearTimeout(timer.current);
    seq.current += 1;
    setT({ id: seq.current, msg, icon, path: path ?? pathRef.current });
    timer.current = setTimeout(() => setT(null), 2500);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <Suspense fallback={null}>
        <ToastHost t={t} onPath={onPath} />
      </Suspense>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
