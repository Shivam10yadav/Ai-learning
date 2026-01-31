import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-6 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-slate-300 text-sm">{subtitle}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;