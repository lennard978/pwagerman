import React from "react";
import { BtnList } from "../../components/BtnList";

export const ChoosePair = ({ data }) => {
  return <BtnList dataList={data} title="Pair" nav="choosepair" />;
};
