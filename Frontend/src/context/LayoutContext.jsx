import React, { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [layoutProps, setLayoutProps] = useState({
    title: "",
    subtitle: "",
    onBack: null,
    actions: null
  });

  const updateLayout = (props) => {
    setLayoutProps(prev => ({ ...prev, ...props }));
  };

  return (
    <LayoutContext.Provider value={{ layoutProps, updateLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
