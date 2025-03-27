import React, { forwardRef } from "react";

const ChartBody = forwardRef<HTMLDivElement>((_, ref) => {
  return <div ref={ref} className="w-full flex-1" />;
});

export default ChartBody;
