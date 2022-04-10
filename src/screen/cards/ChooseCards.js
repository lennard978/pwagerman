import React from "react";
import { BtnList } from "../../components/BtnList";

export const ChooseCards = ({ data }) => {
  return <BtnList dataList={data} title="Cards" nav="choosecards" />;
};
