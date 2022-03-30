import React from "react";
import { Link, useParams } from "react-router-dom";
import SoundButton from "../../components/SoundButton";
import { Title } from "../../components/Title";

export const Quiz = ({ data }) => {
  const { userId } = useParams();
  const number = Number(userId);
  return (
    <div>
      <Title title={`Quiz ${number + 1}`} />
      {data[userId].map((item, index) => {
        return (
          <SoundButton key={index} german={item.german}>
            <p>{item.german}</p>
            <p>{item.english}</p>
          </SoundButton>
        );
      })}
      <Link to="/choosewrite">Back to Quiz</Link>
    </div>
  );
};
