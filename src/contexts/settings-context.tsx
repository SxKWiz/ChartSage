"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";

type AnalysisModel = "normal" | "ultra";

interface SettingsContextType {
  analysisModel: AnalysisModel;
  setAnalysisModel: (model: AnalysisModel) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [analysisModel, setAnalysisModel] = useState<AnalysisModel>("normal");

  useEffect(() => {
    const storedModel = localStorage.getItem("analysisModel") as AnalysisModel;
    if (storedModel) {
      setAnalysisModel(storedModel);
    }
  }, []);

  const handleSetAnalysisModel = (model: AnalysisModel) => {
    setAnalysisModel(model);
    localStorage.setItem("analysisModel", model);
  };

  return (
    <SettingsContext.Provider
      value={{ analysisModel, setAnalysisModel: handleSetAnalysisModel }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
