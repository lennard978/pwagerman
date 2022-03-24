import { useContext } from "react";
import { Lesson1 } from "../Data/data";
import SoundButton from "../SoundButton";
import { v4 as uuidv4 } from "uuid";
import Title from "../Title";
import Container from "../Container";
import { Context } from "../LessonContext";

export default function Lesson() {
  const lesson = useContext(Context);
  return (
    <Container>
      <Title title="Lesson 1" />
      <div className="pt-14 pb-14 w-11/12 m-auto md:w-5/12">
        {lesson.map((item) => {
          return (
            <SoundButton
              className="flex border-l-2 border-main-green justify-between p-2 flex-row mb-1 cursor-pointer from-dark-blue bg-gradient-to-r to-stone-900"
              german={item.german}
              key={uuidv4()}
            >
              <p className="text-left text-main-green">{item.german}</p>
              <p className="text-right italic text-white">{item.english}</p>
            </SoundButton>
          );
        })}
      </div>
    </Container>
  );
}
