import { useParams } from "react-router-dom";
import { useState } from "react";
import { Title } from "../../components/Title";

export const Pair = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);

  const wordList = data[userId];
  const [german, setGerman] = useState(
    JSON.parse(JSON.stringify(wordList)).sort(() => Math.random() - 0.5)
  );
  const [english, setEnglish] = useState(
    JSON.parse(JSON.stringify(wordList)).sort(() => Math.random() - 0.5)
  );
  // let [germanAnswer, setGermanAnswer] = useState("");
  // let [englishAnswer, setEnglishAnswer] = useState("");

  const [germanResult, setGermanResult] = useState("");
  const [englishResult, setEnglishResult] = useState("");

  const checkGerman = (item) => {
    // const germanItem = german.find((word) => word === item);
    // setGermanAnswer(germanItem);
    setGermanResult(item);
  };

  const checkEnglish = (item) => {
    // const englishItem = english.find((word) => word === item);
    // setEnglishAnswer(englishItem);
    setEnglishResult(item);
  };

  const checkCorrect = () => {
    if (germanResult.german === englishResult.german) {
      setGerman(german.filter((item) => item !== germanResult));
      setEnglish(english.filter((item) => item !== englishResult));
    }
  };

  const germanList = german.map((item, index) => {
    return (
      <button onClick={() => checkGerman(item)} key={index}>
        {item.german}
      </button>
    );
  });
  const englishList = english.map((item, index) => {
    return (
      <button onClick={() => checkEnglish(item)} key={index}>
        {item.english}
      </button>
    );
  });

  return (
    <div>
      <Title title={`Pair ${number + 1}`} />
      <div>{germanList}</div>
      <button onClick={() => checkCorrect()}>Check</button>
      <div>{englishList}</div>
      <button to="/choosepair">Back to Choose</button>
    </div>
  );
};
