import React, { forwardRef } from "react";

const ChartBody = forwardRef<HTMLDivElement>((_, ref) => {
  return <div ref={ref} className="w-full h-[500px]" />;
});

export default ChartBody;
