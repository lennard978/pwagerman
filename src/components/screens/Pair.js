import { useContext, useState } from "react";
import { MenuContext } from "./MenuContext";
import { v4 as uuidv4 } from "uuid";

export default function Pair() {
  const { lesson, setLesson } = useContext(MenuContext);
  const [allWords, setAllWords] = useState(lesson[0]);
  return (
    <div className="from-dark-blue bg-gradient-to-b to-stone-900 min-h-screen flex flex-col">
      <div className="flex flex-row flex-wrap justify-around pt-1 m-auto md:w-5/12">
        {allWords.map((item) => {
          return (
            <button
              className="mb-1 mx-2 px-4 py-1 cursor-pointer from-dark-blue bg-gradient-to-l to-stone-900 text-left text-main-green text-sm"
              key={uuidv4()}
            >
              {item.german}
            </button>
          );
        })}
      </div>
      <button className="mb-1 mx-2 px-4 py-1 cursor-pointer from-dark-blue bg-gradient-to-l to-stone-900 text-main-green">
        Check
      </button>
      <div className="flex flex-row flex-wrap justify-around m-auto md:w-5/12 pb-14">
        {lesson[0].map((item) => {
          return (
            <button
              className="mb-1 mx-2 px-4 py-1 cursor-pointer from-dark-blue bg-gradient-to-l to-stone-900 text-left text-main-green text-sm"
              key={uuidv4()}
              onClick={(e) => console.log(e.target.textContent)}
            >
              {item.english}
            </button>
          );
        })}
      </div>
    </div>
  );
}
