"use client";

import { createContext, use, useMemo } from "react";

interface ManagerContextType {
  managerSlug: string;
}

const ManagerContext = createContext<ManagerContextType | null>(null);

export function useManager() {
  const context = use(ManagerContext);
  if (!context) {
    throw new Error("useManager debe usarse dentro de ManagerProvider");
  }
  return context;
}

export function ManagerProvider({
  children,
  managerSlug,
}: {
  children: React.ReactNode;
  managerSlug: string;
}) {
  const value = useMemo(() => ({ managerSlug }), [managerSlug]);

  return (
    <ManagerContext.Provider value={value}>{children}</ManagerContext.Provider>
  );
}
