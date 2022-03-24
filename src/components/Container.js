import React from "react";

export default function Container({ children }) {
  return (
    <div className="from-dark-blue bg-gradient-to-b to-stone-900 min-h-screen">
      {children}
    </div>
  );
}