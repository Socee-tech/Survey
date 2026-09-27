/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const FormContext = createContext();
const STORAGE_KEY = "devstack_survey_progress";

const initialState = {
  personalInfo: {},
  techStack: {},
  toolsDevOps: {},
  cloudData: {},
  careerGrowth: {},
};

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateSection = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
    localStorage.removeItem(STORAGE_KEY);
    setStep(0);
  };

  return (
    <FormContext.Provider
      value={{ formData, updateSection, step, setStep, resetForm }}
    >
      {children}
    </FormContext.Provider>
  );
}

export const useFormContext = () => useContext(FormContext);