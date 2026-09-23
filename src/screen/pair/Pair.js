import { useParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { Btn } from "../../components/style";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";
import { EmptyExercise } from "../../components/EmptyExercise";

export const Pair = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const { t } = useLanguage();

  const wordList = data[userId].items;
  const roundItems = [...wordList]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
  const [source, setSource] = useState(
    JSON.parse(JSON.stringify(roundItems)).sort(() => Math.random() - 0.5)
  );
  const [target, setTarget] = useState(
    JSON.parse(JSON.stringify(roundItems)).sort(() => Math.random() - 0.5)
  );

  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [wrongPair, setWrongPair] = useState(false);

  const checkCorrect = (sourceItem, targetItem) => {
    if (sourceItem.source === targetItem.source) {
      setSource(source.filter((item) => item !== sourceItem));
      setTarget(target.filter((item) => item !== targetItem));
      setSelectedSource(null);
      setSelectedTarget(null);
      setWrongPair(false);
    } else {
      setWrongPair(true);
    }
  };

  const checkSource = (item) => {
    setWrongPair(false);
    setSelectedSource(item);
    if (selectedTarget) checkCorrect(item, selectedTarget);
  };

  const checkTarget = (item) => {
    setWrongPair(false);
    setSelectedTarget(item);
    if (selectedSource) checkCorrect(selectedSource, item);
  };

  const sourceList = source.map((item, index) => {
    return (
      <PairButton
        onClick={() => checkSource(item)}
        $selected={selectedSource === item}
        $wrong={wrongPair && selectedSource === item}
        key={index}
      >
        {item.source}
      </PairButton>
    );
  });
  const targetList = target.map((item, index) => {
    return (
      <PairButton
        onClick={() => checkTarget(item)}
        $selected={selectedTarget === item}
        $wrong={wrongPair && selectedTarget === item}
        key={index}
      >
        {item.target}
      </PairButton>
    );
  });

  return (
    <Container>
      <Title title={`${t("navigation.pair")} ${number + 1}`} />
      {roundItems.length < 2 ? <EmptyExercise message={t("myWords.minimum")} /> : <>
        <Row>{sourceList}</Row>
        <Row>{targetList}</Row>
      </>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 1rem;
  inline-size: min(100%, 42rem);
  padding: 0.75rem 1rem 7rem;
`;

const Row = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-inline-size: 0;
`;

const PairButton = styled(Btn)`
  border-color: ${(props) => (props.$wrong ? theme.colors.error : props.$selected ? theme.colors.primary : theme.colors.border)};
  background: ${(props) => (props.$wrong ? theme.colors.errorSoft : props.$selected ? theme.colors.primarySoft : theme.colors.surface)};
`;
