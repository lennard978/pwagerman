import React from "react";
import { Link, useParams } from "react-router-dom";
import SoundButton from "../../components/SoundButton";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { BackBtn } from "../../components/BackBtn";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";
import { WordStatusActions } from "../../components/WordStatusActions";
import { useProgress } from "../../i18n/ProgressProvider";

export const Lesson = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();
  const progress = useProgress();
  const lesson = data[userId];
  return (
    <Wrapper>
      <Title title={`${t("navigation.lesson")} ${number + 1}`} />
      {lesson.items.length === 0 && <EmptyExercise message={t("myWords.emptyHint")} />}
      {lesson.items.map((item, index) => {
        return (
          <Container key={index}>
            <SoundButton key={index} text={item.target} lang="sr-RS">
              <Row>
                <SourceParagraph>{item.source}</SourceParagraph>
                <TargetParagraph>{item.target}</TargetParagraph>
              </Row>
            </SoundButton>
            <WordStatusActions word={item} />
          </Container>
        );
      })}
      {lesson.items.length > 0 && (
        <CompleteLink
          to="/learn"
          onClick={() => progress?.recordCompletion({
            type: "lesson",
            categoryId: lesson.id,
            route: `/chooselesson/${userId}`,
            titleKey: lesson.titleKey,
          })}
        >
          {t("exercise.completeLesson")}
        </CompleteLink>
      )}
      <BackBtn title={t("actions.goBack")} to="/chooselesson" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 0.75rem;
  padding-bottom: 7rem;
  inline-size: min(100%, 42rem);
  padding-inline: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  inline-size: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex-direction: column;
  gap: 0.1rem;
  margin: 0.45rem 0;
  padding: 1rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  inline-size: 100%;
  background: transparent;
  margin: 0;
  padding: 0 0 0.65rem;
  border: 0;
  box-shadow: none;
  cursor: pointer;
`;

const SourceParagraph = styled.p`
  order: 1;
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 1.15rem;
  font-weight: 700;
`;

const TargetParagraph = styled.p`
  order: 2;
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 1.2rem;
  font-weight: 700;
`;
const CompleteLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 0.75rem; padding-inline: 1.25rem; color: white; background: ${theme.colors.primary}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 700;`;
