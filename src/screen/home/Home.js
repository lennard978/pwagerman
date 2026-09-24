import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { InstallHelp } from "../../components/InstallHelp";

export const Home = () => {
  const { t } = useLanguage();

  return (
    <Container>
      <Paragraph>{t("app.name")}</Paragraph>
      <Tagline>{t("app.tagline")}</Tagline>
      <MyWordsLink to="/my-words">
        {t("myWords.title")}
        <small>{t("myWords.description")}</small>
      </MyWordsLink>
      <InstallHelp />
    </Container>
  );
};

const Container = styled.div`
  inline-size: min(100%, 42rem);
  min-block-size: calc(100vh - ${theme.navHeight});
  padding: 2rem 1.25rem 6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  /* min-block-size: 100vh; */
`;
const Paragraph = styled.h1`
  margin: 0;
  color: ${theme.colors.text};
  font-size: clamp(2rem, 8vw, 3rem);
  letter-spacing: -0.03em;
`;

const Tagline = styled.p`
  max-inline-size: 22rem;
  margin-top: 0.75rem;
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  line-height: 1.5;
  text-align: center;
`;

const MyWordsLink = styled(Link)`
  display: grid;
  gap: 0.25rem;
  inline-size: min(100%, 22rem);
  padding: 1rem;
  color: #1f2933;
  background: #ffffff;
  border: 1px solid #e4e7ec;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(31, 41, 51, 0.08);
  text-decoration: none;
  font-weight: 700;
`;
