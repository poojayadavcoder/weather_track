import React, { memo } from "react";
import { ResponsiveContainer } from "recharts";

const ReusableChart = ({ 
  title, 
  subtitle, 
  category, 
  height = 300, 
  children, 
  actions,
  className = "",
  contentClassName = ""
}) => {
  return (
    <div className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden ${className}`}>
      <div className="p-6 md:p-8 pb-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            {category && (
              <p className="text-[10px] md:text-[11px] font-semibold text-blue-600 uppercase tracking-widest mb-1 md:mb-2">
                {category}
              </p>
            )}
            {title && (
              <h3 className="text-xl md:text-2xl font-semibold text-[#2d3a54]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[10px] md:text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex bg-gray-100 p-1 rounded-xl">
              {actions}
            </div>
          )}
        </div>
      </div>

      <div className="outline-none" style={{ width: "100%", height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default memo(ReusableChart);
