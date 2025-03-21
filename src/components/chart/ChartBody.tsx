import React, { forwardRef } from "react";
import styled from "styled-components";

const ChartBody = forwardRef<HTMLDivElement>((_, ref) => {
  return <ChartArea ref={ref} />;
});

export default ChartBody;

const ChartArea = styled.div`
  width: 100%;
  height: 500px;
`;