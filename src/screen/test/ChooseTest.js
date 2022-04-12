import React from "react";
import { BtnList } from "../../components/BtnList";

export const ChooseTest = ({ data }) => {
  return <BtnList dataList={data} title="Test" nav="choosetest" />;
};
