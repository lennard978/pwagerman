import React, { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { Lesson1 } from "./components/Data/data";
import { v4 as uuidv4 } from "uuid";

function App() {
  const list = Lesson1.map((item) => {
    return (
      <div
        key={uuidv4()}
        className="flex justify-between p-1 flex-row border-2 border-slate-800 m-1 p-4 cursor-pointer"
        onClick={() =>
          speak({ rate: 0.6, pitch: 0.2, voice, text: item.german })
        }
      >
        <p className="font-bold text-left">{item.german}</p>
        <p className="text-right italic">{item.english}</p>
      </div>
    );
  });
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices.find(({ lang }) => lang.startsWith("de"));

  return (
    <div className="bg-slate-100">
      <h1 className="flex justify-center text-2xl font-serif font-bold uppercase p-3">
        Lesson 1
      </h1>
      <div>{list}</div>
    </div>
  );
}

export default App;
