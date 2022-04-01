import React from "react";
import { BtnList } from "../../components/BtnList";

export const ChooseWrite = ({ data }) => {
  return <BtnList dataList={data} title="Write" nav="choosewrite" />;
};
