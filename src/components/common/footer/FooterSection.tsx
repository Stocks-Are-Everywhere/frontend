// components/common/footer/FooterSection.tsx
import React from "react";
import styled from "styled-components";

interface Props {
  title: string;
  children: React.ReactNode;
}

const FooterSection = ({ title, children }: Props) => {
  return (
    <Section>
      <Title>{title}</Title>
      {children}
    </Section>
  );
};

const Section = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333d4b;
  margin: 0 0 16px 0;
`;

export default FooterSection;
