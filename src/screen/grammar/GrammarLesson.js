import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { FaCheck, FaExclamationTriangle, FaVolumeUp } from "react-icons/fa";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { getGrammarLesson } from "../../data/grammar";
import { useLanguage } from "../../i18n/LanguageProvider";
import { useProgress } from "../../i18n/ProgressProvider";
import { theme } from "../../styles/theme";
import { GrammarPractice } from "./GrammarPractice";

export const GrammarLesson = () => {
  const { lessonId } = useParams();
  const { language, t } = useLanguage();
  const progress = useProgress();
  const lesson = getGrammarLesson(lessonId);

  if (!lesson) {
    return (
      <Wrapper>
        <Heading>{t("grammar.notFound")}</Heading>
        <BackLink to="/grammar">{t("grammar.backToGrammar")}</BackLink>
      </Wrapper>
    );
  }

  const completed = progress?.progress.completedGrammarLessons.includes(lesson.id);
  const title = language === "sr-Latn" ? lesson.titleSr : lesson.title;
  const complete = () => progress?.recordGrammarCompletion({
    lessonId: lesson.id,
    route: `/grammar/${lesson.id}`,
    title,
  });

  return (
    <Wrapper>
      <Header>
        <Eyebrow>{t("grammar.a1Grammar")}</Eyebrow>
        <Heading>{title}</Heading>
        <Explanation>{lesson.explanation}</Explanation>
      </Header>

      <Section>
        <SectionTitle>{t("grammar.rule")}</SectionTitle>
        <TableScroller>
          <RuleTable>
            <thead>
              <tr>{lesson.rule.headers.map((header) => <th key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {lesson.rule.rows.map((row, index) => (
                <tr key={index}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </RuleTable>
        </TableScroller>
      </Section>

      <Section>
        <SectionTitle>{t("grammar.examples")}</SectionTitle>
        <Examples>
          {lesson.examples.map((example) => (
            <Example key={example.serbian}>
              <ExampleCopy>
                <strong>{example.serbian}</strong>
                <span>{example.english}</span>
              </ExampleCopy>
              <CompactSoundButton
                text={example.serbian}
                lang="sr-RS"
                ariaLabel={`${t("grammar.hearExample")}: ${example.serbian}`}
              >
                <FaVolumeUp aria-hidden="true" />
              </CompactSoundButton>
            </Example>
          ))}
        </Examples>
      </Section>

      {lesson.compare?.length > 0 && (
        <CompareBox>
          <SectionTitle>{t("grammar.compare")}</SectionTitle>
          <CompareList>
            {lesson.compare.map((item) => (
              <CompareRow key={`${item.serbian}-${item.note}`}>
                <strong>{item.serbian}</strong>
                <span>{item.english}</span>
                <CompareNote>{item.note}</CompareNote>
              </CompareRow>
            ))}
          </CompareList>
        </CompareBox>
      )}

      <Mistake>
        <FaExclamationTriangle aria-hidden="true" />
        <div>
          <strong>{t("grammar.commonMistake")}</strong>
          <p>{lesson.commonMistake}</p>
        </div>
      </Mistake>

      <Section>
        <SectionTitle>{t("grammar.practice")}</SectionTitle>
        <GrammarPractice lessonId={lesson.id} exercises={lesson.practice} />
      </Section>

      <CompleteButton type="button" $completed={completed} onClick={complete}>
        <FaCheck aria-hidden="true" />
        {completed ? t("grammar.completed") : t("grammar.complete")}
      </CompleteButton>
      <BackLink to="/grammar">{t("grammar.backToGrammar")}</BackLink>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 44rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`margin-bottom: 1rem;`;
const Eyebrow = styled.p`margin: 0 0 0.25rem; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;`;
const Heading = styled.h1`margin: 0; color: ${theme.colors.navy}; font-size: clamp(1.8rem, 7vw, 2.4rem);`;
const Explanation = styled.p`margin: 0.5rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.55;`;
const Section = styled.section`margin-top: 1rem;`;
const SectionTitle = styled.h2`margin: 0 0 0.6rem; color: ${theme.colors.text}; font-size: 1.1rem;`;
const TableScroller = styled.div`max-inline-size: 100%; overflow-x: auto; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium};`;
const RuleTable = styled.table`inline-size: 100%; min-inline-size: 30rem; border-collapse: collapse; background: ${theme.colors.surface}; & th, & td { padding: 0.7rem; border-bottom: 1px solid ${theme.colors.border}; text-align: left; vertical-align: top; } & th { color: ${theme.colors.navy}; background: ${theme.colors.surfaceMuted}; font-size: 0.8rem; } & td { color: ${theme.colors.text}; font-size: 0.86rem; line-height: 1.45; } & tr:last-child td { border-bottom: 0; }`;
const Examples = styled.div`display: grid; gap: 0.55rem;`;
const Example = styled.article`display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; padding: 0.8rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium};`;
const ExampleCopy = styled.div`min-inline-size: 0; display: grid; gap: 0.2rem; & strong { color: ${theme.colors.primaryPressed}; overflow-wrap: anywhere; } & span { color: ${theme.colors.textMuted}; font-size: 0.84rem; }`;
const CompareBox = styled.aside`margin-top: 1rem; padding: 0.9rem; background: ${theme.colors.primarySoft}; border: 1px solid ${theme.colors.primary}; border-radius: ${theme.radius.medium};`;
const CompareList = styled.div`display: grid; gap: 0.55rem;`;
const CompareRow = styled.div`min-inline-size: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.15rem; padding: 0.7rem; background: ${theme.colors.surface}; border-radius: ${theme.radius.small}; & strong { color: ${theme.colors.primaryPressed}; overflow-wrap: anywhere; } & span { color: ${theme.colors.textMuted}; font-size: 0.84rem; }`;
const CompareNote = styled.span`font-weight: 800; color: ${theme.colors.navy} !important;`;
const Mistake = styled.aside`display: flex; align-items: flex-start; gap: 0.7rem; margin-top: 1rem; padding: 0.9rem; color: ${theme.colors.text}; background: #fff8e6; border: 1px solid #f3cc72; border-radius: ${theme.radius.medium}; & > svg { flex: 0 0 auto; margin-top: 0.15rem; color: #9a6700; } & strong { color: #7a4d00; } & p { margin: 0.25rem 0 0; color: ${theme.colors.textMuted}; line-height: 1.45; }`;
const CompleteButton = styled.button`min-block-size: 3rem; display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1rem; padding-inline: 1rem; color: ${(props) => props.$completed ? theme.colors.success : "white"}; background: ${(props) => props.$completed ? theme.colors.successSoft : theme.colors.primary}; border: 1px solid ${(props) => props.$completed ? theme.colors.success : theme.colors.primary}; border-radius: ${theme.radius.small}; font-weight: 800;`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin: 1rem 0 0 0.6rem; padding-inline: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 700;`;
