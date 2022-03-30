import React from "react";
import { BtnList } from "../../components/BtnList";

export const ChooseLesson = ({ data }) => {
  return <BtnList dataList={data} title="Lesson" nav="chooselesson" />;
};
