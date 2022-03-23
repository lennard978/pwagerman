import React from "react";
import { Lesson1 } from "../Data/data";
import SoundButton from "../SoundButton";
import { v4 as uuidv4 } from "uuid";

export default function Lesson() {
  return (
    <div className="from-dark-blue bg-gradient-to-l to-stone-900">
      <h1 className="flex justify-center text-2xl text-main-green font-serif uppercase p-3">
        Lesson 1
      </h1>
      {Lesson1.map((item) => {
        return (
          <SoundButton
            className="flex justify-between p-2 flex-row m-1 cursor-pointer from-dark-blue bg-gradient-to-r to-stone-900"
            german={item.german}
            key={uuidv4()}
          >
            <p className="text-left text-main-green">{item.german}</p>
            <p className="text-right italic text-white">{item.english}</p>
          </SoundButton>
        );
      })}
    </div>
  );
}
