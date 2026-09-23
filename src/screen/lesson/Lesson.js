import React from "react";
import { useParams } from "react-router-dom";
import SoundButton from "../../components/SoundButton";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { BackBtn } from "../../components/BackBtn";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";

export const Lesson = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();
  return (
    <Wrapper>
      <Title title={`${t("navigation.lesson")} ${number + 1}`} />
      {data[userId].items.length === 0 && <EmptyExercise message={t("myWords.emptyHint")} />}
      {data[userId].items.map((item, index) => {
        return (
          <Container key={index}>
            <SoundButton key={index} text={item.target} lang="sr-RS">
              <Row>
                <SourceParagraph>{item.source}</SourceParagraph>
                <TargetParagraph>{item.target}</TargetParagraph>
              </Row>
            </SoundButton>
          </Container>
        );
      })}
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
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  inline-size: 100%;
  background: ${theme.colors.surface};
  margin: 0.45rem 0;
  padding: 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
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
