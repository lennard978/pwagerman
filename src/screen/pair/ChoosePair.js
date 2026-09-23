import React from "react";
import { BtnList } from "../../components/BtnList";
import { useLanguage } from "../../i18n/LanguageProvider";

export const ChoosePair = ({ data }) => {
  const { t } = useLanguage();

  return <BtnList dataList={data} title={t("navigation.pair")} nav="choosepair" />;
};
