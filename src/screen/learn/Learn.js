import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBookOpen, FaGraduationCap, FaStar } from "react-icons/fa";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const Learn = () => {
  const { t } = useLanguage();
  const destinations = [
    { id: "vocabulary", to: "/learn/vocabulary", icon: FaBookOpen },
    { id: "grammar", to: "/learn/grammar", icon: FaGraduationCap },
    { id: "myWords", to: "/learn/my-words", icon: FaStar },
  ];
  return (
    <Wrapper>
      <h1>{t("navigation.learn")}</h1>
      <Intro>{t("learn.description")}</Intro>
      <Grid>
        {destinations.map(({ id, to, icon: Icon }) => (
          <Card key={id} to={to}>
            <Icon aria-hidden="true" />
            <strong>{t(`learn.${id}`)}</strong>
            <span>{t(`learn.${id}Description`)}</span>
          </Card>
        ))}
      </Grid>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 1.25rem 1rem 7rem; & h1 { margin: 0; color: ${theme.colors.text}; }`;
const Intro = styled.p`margin: 0.4rem 0 1.25rem; color: ${theme.colors.textMuted};`;
const Grid = styled.div`display: grid; gap: 0.8rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));`;
const Card = styled(Link)`min-block-size: 9rem; display: flex; flex-direction: column; justify-content: center; gap: 0.55rem; padding: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; text-decoration: none; & svg { color: ${theme.colors.primary}; font-size: 1.45rem; } & span { color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.4; } &:hover { border-color: ${theme.colors.primary}; transform: translateY(-2px); } &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
