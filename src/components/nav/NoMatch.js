import React from "react";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const NoMatch = () => {
  const { t } = useLanguage();

  return (
    <Container>
      <H2>{t("errors.pageNotFound")}</H2>
      <HomeLink href="/pwagerman/home">Return Home</HomeLink>
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  padding: 2rem 1rem 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  background: ${theme.colors.background};
`;

const HomeLink = styled.a`
  min-block-size: 2.75rem;
  display: inline-flex;
  align-items: center;
  padding-inline: 1rem;
  border-radius: ${theme.radius.small};
  color: white;
  background: ${theme.colors.primary};
  font-weight: 800;
  text-decoration: none;
`;

const H2 = styled.h2`
  margin: 0;
  color: ${theme.colors.text};
  text-align: center;
`;
