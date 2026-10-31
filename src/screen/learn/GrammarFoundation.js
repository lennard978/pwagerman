import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

export const GrammarFoundation = () => {
  const { t } = useLanguage();
  return (
    <Wrapper>
      <h1>{t("learn.grammar")}</h1>
      <Card>
        <strong>{t("foundation.upcoming")}</strong>
        <p>{t("foundation.grammar")}</p>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.main`inline-size: min(100%, 42rem); min-block-size: 100vh; padding: 1.25rem 1rem 7rem; & h1 { margin-top: 0; }`;
const Card = styled.section`padding: 1.25rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.large}; box-shadow: ${theme.shadow.soft}; & strong { color: ${theme.colors.primaryPressed}; } & p { margin-bottom: 0; color: ${theme.colors.textMuted}; line-height: 1.55; }`;
