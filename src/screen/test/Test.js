import { useState } from "react";
import { useParams } from "react-router-dom";
import { Title } from "../../components/Title";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export const Test = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  const navigate = useNavigate();

  //Set disabled button
  const [disable, setDisable] = useState(true);

  //Add next question
  let [currentQuestion, setQurentQuestion] = useState(0);

  //Set curent Answer
  const [currentAnswer, setCurrentAnswer] = useState("");

  //Set Answer
  const [answers, setAnswers] = useState([]);

  //Set Question
  const questionItem = data[userId].map((item) => item.question);
  const [option, setOption] = useState(
    ["der", "die", "das"].sort(() => 0.5 - Math.random())
  );
  //Set Correct Answers
  const correctAnswer = data[userId].map((item) => item.answer);
  const correct = correctAnswer[currentQuestion];

  //Answer on click
  const clickAnswer = (item) => {
    setCurrentAnswer(item);
    setDisable(false);
  };

  //Set Next Question
  const nextQuestion = () => {
    answers.push([currentAnswer, correct]);
    setAnswers(answers);
    setCurrentAnswer("");
    setDisable(true);
    setOption(["der", "die", "das"].sort(() => 0.5 - Math.random()));

    if (currentQuestion + 1 < data[userId].length) {
      setQurentQuestion(currentQuestion + 1);
      return;
    } else {
      navigate("/choosetest");
    }
  };

  return (
    <Wrapper>
      <Title title={`Test ${number + 1}`} />
      <Container>
        <QuestionRow>
          <Paragraph>
            Question: {currentQuestion + 1} / {data[userId].length}
          </Paragraph>
        </QuestionRow>
        <Row>
          <Question>{questionItem[currentQuestion]}</Question>
        </Row>
        <Row>
          {option.map((item) => (
            <div key={item}>
              <Answer onClick={() => clickAnswer(item)}>
                <p>{item}</p>
              </Answer>
            </div>
          ))}
        </Row>
        <QuestionRow>
          <NextBtn disabled={disable} onClick={() => nextQuestion()}>
            Next
          </NextBtn>
        </QuestionRow>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding-top: 3rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  block-size: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
`;

const QuestionRow = styled.div`
  display: flex;
  flex-direction: column;
`;

const Paragraph = styled.p`
  color: rgba(57, 255, 20, 1);
  text-transform: capitalize;
`;

const Question = styled.h2`
  color: rgba(57, 255, 20, 1);
  text-transform: capitalize;
`;

const Answer = styled.button`
  width: 5rem;
  margin: 0.2rem;
  padding: 0.5rem;
  border: none;
  background-image: linear-gradient(to right, #243b50, #141e30);
  color: rgba(57, 255, 20, 1);
  text-transform: uppercase;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;

const NextBtn = styled.button`
  text-transform: capitalize;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  margin: 5px;
  padding-block: 0.5rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to left, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  cursor: pointer;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-self: center;
  &:active {
    border-bottom: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
    color: rgba(57, 255, 20, 1);
  }
`;
