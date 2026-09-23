import React from "react";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const NoMatch = () => {
  const { t } = useLanguage();

  return (
    <Container>
      <H2>{t("errors.pageNotFound")}</H2>
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  padding: 2rem 1rem 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.background};
`;

const H2 = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  text-align: center;
`;
