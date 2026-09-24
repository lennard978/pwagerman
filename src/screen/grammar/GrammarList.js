import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaBookOpen, FaLock } from "react-icons/fa";
import { GrammarSyllabus } from "../../data/grammar";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const GrammarList = () => {
  const { language, t } = useLanguage();
  const title = (topic) => language === "sr-Latn" ? topic.titleSr : topic.title;
  return (
    <Wrapper>
      <Header>
        <Eyebrow>{t("grammar.a1Scope")}</Eyebrow>
        <Heading>{t("grammar.title")}</Heading>
        <Description>{t("grammar.description")}</Description>
      </Header>
      <List>
        {GrammarSyllabus.map((topic, index) => (
          topic.status === "available" ? (
            <LessonLink key={topic.id} to={`/grammar/${topic.id}`}>
              <Number>{index + 1}</Number>
              <Copy>
                <strong>{title(topic)}</strong>
                <span>{t("grammar.openLesson")}</span>
              </Copy>
              <FaBookOpen aria-hidden="true" />
            </LessonLink>
          ) : (
            <Planned key={topic.id}>
              <Number>{index + 1}</Number>
              <Copy>
                <strong>{title(topic)}</strong>
                <span>{t("grammar.planned")}</span>
              </Copy>
              <FaLock aria-hidden="true" />
            </Planned>
          )
        ))}
      </List>
      <BackLink to="/learn">{t("grammar.backToLearn")}</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 44rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`margin-bottom: 1rem;`;
const Eyebrow = styled.p`margin: 0 0 0.25rem; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.8rem, 7vw, 2.4rem);`;
const Description = styled.p`margin: 0.45rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.5;`;
const List = styled.div`display: grid; gap: 0.65rem;`;
const BaseCard = styled.div`min-block-size: 4.5rem; display: grid; grid-template-columns: 2.5rem minmax(0, 1fr) auto; align-items: center; gap: 0.75rem; padding: 0.8rem 1rem; border-radius: ${theme.radius.medium};`;
const LessonLink = styled(BaseCard).attrs({ as: Link })`color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; box-shadow: ${theme.shadow.soft}; text-decoration: none; & > svg { color: ${theme.colors.primary}; }`;
const Planned = styled(BaseCard)`color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border: 1px solid ${theme.colors.border}; & > svg { color: ${theme.colors.textMuted}; }`;
const Number = styled.span`inline-size: 2.25rem; block-size: 2.25rem; display: inline-flex; align-items: center; justify-content: center; color: ${theme.colors.primaryPressed}; background: ${theme.colors.primarySoft}; border-radius: ${theme.radius.small}; font-weight: 800;`;
const Copy = styled.span`min-inline-size: 0; display: grid; gap: 0.15rem; & strong { overflow-wrap: anywhere; } & span { color: ${theme.colors.textMuted}; font-size: 0.76rem; }`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 1rem; padding-inline: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 700;`;
