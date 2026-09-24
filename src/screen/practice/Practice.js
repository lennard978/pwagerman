import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaBookOpen,
  FaClone,
  FaKeyboard,
  FaLayerGroup,
  FaQuestionCircle,
  FaRedo,
  FaGraduationCap,
} from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const Practice = () => {
  const { t } = useLanguage();
  const exercises = [
    { key: "pair", to: "/choosepair", icon: FaClone },
    { key: "write", to: "/choosewrite", icon: FaKeyboard },
    { key: "cards", to: "/choosecards", icon: FaLayerGroup },
    { key: "quiz", to: "/choosequiz", icon: FaQuestionCircle },
    { key: "test", to: "/choosetest", icon: FaBookOpen },
    { key: "review", to: "/review", icon: FaRedo },
    { key: "examPrep", to: "/exam-prep", icon: FaGraduationCap },
  ];

  return (
    <Wrapper>
      <Heading>{t("navigation.practice")}</Heading>
      <Intro>{t("practice.description")}</Intro>
      <Grid>
        {exercises.map(({ key, to, icon: Icon }) => (
          <Card key={key} to={to}>
            <Icon aria-hidden="true" />
            <strong>{t(`navigation.${key}`)}</strong>
            <span>{t(`practice.${key}`)}</span>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  inline-size: min(100%, 48rem);
  min-block-size: 100vh;
  padding: 1.25rem 1rem 7rem;
`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.text}; font-size: 1.8rem;`;
const Intro = styled.p`margin: 0.4rem 0 1.25rem; color: ${theme.colors.textMuted};`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
  @media (min-width: 42rem) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
`;
const Card = styled(Link)`
  min-inline-size: 0;
  min-block-size: 9rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.55rem;
  padding: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
  text-decoration: none;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  & svg { flex: 0 0 auto; color: ${theme.colors.primary}; font-size: 1.45rem; }
  & strong { min-block-size: 1.2rem; }
  & span { min-block-size: 2.25rem; color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.35; }
  &:hover { border-color: ${theme.colors.primary}; transform: translateY(-2px); }
  &:active { transform: scale(0.98); }
  &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }
`;
