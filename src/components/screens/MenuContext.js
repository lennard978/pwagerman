import React, { createContext, useState } from "react";
import { Lesson1, Lesson2 } from "../Data/data";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const lessonList = [Lesson1, Lesson2];
  const [lesson, setLesson] = useState(lessonList);
  return (
    <MenuContext.Provider value={{ lesson, setLesson }}>
      {children}
    </MenuContext.Provider>
  );
};
