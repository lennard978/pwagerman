import React from "react";
import { Link, useParams } from "react-router-dom";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { FaVolumeUp } from "react-icons/fa";
import { BackBtn } from "../../components/BackBtn";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { TARGET_LANGUAGE, TARGET_LANGUAGE_NAME } from "../../config/course";
import { getContentPosition, resolveContentByRouteId } from "../../data/contentSelection";
import { formatLexemeTarget, getLexemeMetadata, getLexemeSpeechText } from "../../data/vocabulary/presentation";

export const Lesson = ({ data }) => {
  const { lessonId, userId } = useParams();
  const routeId = lessonId || userId;
  const { t } = useLanguage();
  const progress = useProgress();
  const lesson = resolveContentByRouteId(data, routeId);
  const number = getContentPosition(data, lesson);
  return (
    <Wrapper>
      <Title title={lesson.title || `${t("navigation.lesson")} ${number}`} reserveSpace />
      {lesson.items.length === 0 && <EmptyExercise message={t("myWords.emptyHint")} />}
      {lesson.items.map((item) => {
        return (
          <Container key={item.id || `${item.source}-${item.target}`}>
            <VocabularyRow>
              <Words>
                <SourceParagraph>{item.source}</SourceParagraph>
                <TargetParagraph>{formatLexemeTarget(item)}</TargetParagraph>
                <PartOfSpeech>{item.partOfSpeech}</PartOfSpeech>
              </Words>
              <CompactSoundButton
                text={getLexemeSpeechText(item)}
                lang={TARGET_LANGUAGE}
                ariaLabel={`Hear ${TARGET_LANGUAGE_NAME} pronunciation: ${formatLexemeTarget(item)}`}
              >
                <FaVolumeUp aria-hidden="true" />
              </CompactSoundButton>
            </VocabularyRow>
            <Details>
              <summary>Example and grammar</summary>
              <Example lang="de">{item.example}</Example>
              <ExampleTranslation>{item.exampleTranslation}</ExampleTranslation>
              {getLexemeMetadata(item).map((line) => <GrammarLine key={line}>{line}</GrammarLine>)}
              {item.note && <GrammarLine>{item.note}</GrammarLine>}
            </Details>
            <CardActions>
              <WordStatusActions word={item} />
            </CardActions>
          </Container>
        );
      })}
      <CompletionActions data-testid="lesson-completion-actions">
        {lesson.items.length > 0 && (
          <CompleteLink
            to="/learn"
            onClick={() => progress?.recordCompletion({
              type: "lesson",
              categoryId: lesson.id,
              route: `/learn/vocabulary/${lesson.id}`,
              titleKey: lesson.titleKey,
            })}
          >
            {t("exercise.completeLesson")}
          </CompleteLink>
        )}
        <BackBtn title={t("actions.goBack")} to="/learn/vocabulary" />
      </CompletionActions>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 0.75rem;
  padding-bottom: 2rem;
  inline-size: min(100%, 42rem);
  padding-inline: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const Container = styled.div`
  inline-size: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0.45rem 0;
  padding: 1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
`;

const VocabularyRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  inline-size: 100%;
`;

const Words = styled.div`
  min-inline-size: 0;
  display: grid;
  gap: 0.2rem;
  overflow-wrap: anywhere;
`;

const SourceParagraph = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 1rem;
  font-weight: 700;
`;

const TargetParagraph = styled.p`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 1.15rem;
  font-weight: 800;
`;
const PartOfSpeech = styled.small`justify-self: start; padding: 0.12rem 0.4rem; color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.pill}; text-transform: capitalize;`;
const Details = styled.details`inline-size: 100%; border-top: 1px solid ${theme.colors.border}; padding-top: 0.55rem; & summary { min-block-size: 2.75rem; display: flex; align-items: center; color: ${theme.colors.primaryPressed}; font-weight: 700; cursor: pointer; }`;
const Example = styled.p`margin: 0.35rem 0 0; color: ${theme.colors.text}; line-height: 1.45;`;
const ExampleTranslation = styled.p`margin: 0.2rem 0 0.45rem; color: ${theme.colors.textMuted}; font-size: 0.88rem; line-height: 1.45;`;
const GrammarLine = styled.p`margin: 0.2rem 0; color: ${theme.colors.textMuted}; font-size: 0.78rem;`;
const CardActions = styled.div`
  display: flex;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid ${theme.colors.border};
`;
const CompletionActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
  margin-top: 0.75rem;

  & > a {
    margin-top: 0;
  }
`;
const CompleteLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; padding-inline: 1.25rem; color: white; background: ${theme.colors.primary}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 700;`;
