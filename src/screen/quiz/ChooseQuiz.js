import React from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const ChooseQuiz = ({ data }) => {
  const { t } = useLanguage();

  return (
    <Container>
      <Row>
        {data.map((lesson, index) => (
          <div key={index}>
            <Button to={`/choosequiz/${index}`}>
              <Title>{lesson.titleKey ? t(lesson.titleKey) : `${t("navigation.quiz")} ${index + 1}`}</Title>
              {lesson.descriptionKey && (
                <Description>{t(lesson.descriptionKey)}</Description>
              )}
            </Button>
          </div>
        ))}
        <Outlet />
      </Row>
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  inline-size: min(100%, 48rem);
  padding: 2rem 1rem 7rem;
`;
const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  inline-size: 100%;
`;

const Title = styled.span`
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
`;

const Description = styled.span`
  display: block;
  margin-top: 0.25rem;
  color: ${theme.colors.textMuted};
  font-size: 0.75rem;
  line-height: 1.4;
`;

const Button = styled(Link)`
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 5.5rem;
  display: block;
  padding: 1rem 1.1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  @media (hover: hover) {
    &:hover {
      border-color: ${theme.colors.primary};
      box-shadow: 0 12px 28px rgba(31, 41, 51, 0.12);
      transform: translateY(-2px);
    }
  }
  &:active {
    transform: scale(0.985);
  }
  &:focus-visible {
    border-color: ${theme.colors.primary};
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;
