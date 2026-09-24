import { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../i18n/LanguageProvider";
import { useProgress } from "../i18n/ProgressProvider";
import { theme } from "../styles/theme";

export const Onboarding = () => {
  const { t } = useLanguage();
  const { completeOnboarding } = useProgress();
  const [screen, setScreen] = useState(0);
  const pages = [
    { title: t("app.name"), text: t("app.tagline") },
    { title: t("navigation.learn"), text: t("onboarding.learn") },
    { title: t("onboarding.practiceTitle"), text: t("onboarding.practice") },
  ];
  const page = pages[screen];

  return (
    <Overlay role="dialog" aria-modal="true" aria-label={t("onboarding.title")}>
      <Card>
        {screen === 0 && (
          <Logo src={`${process.env.PUBLIC_URL}/serbian-a1-wordmark.png`} alt="" />
        )}
        <Title>{page.title}</Title>
        <Text>{page.text}</Text>
        <Dots aria-label={`${screen + 1} / ${pages.length}`}>
          {pages.map((_, index) => <Dot key={index} $active={index === screen} />)}
        </Dots>
        <Actions>
          <Skip type="button" onClick={completeOnboarding}>{t("onboarding.skip")}</Skip>
          <Continue
            type="button"
            onClick={() => screen === pages.length - 1
              ? completeOnboarding()
              : setScreen((value) => value + 1)}
          >
            {screen === pages.length - 1 ? t("home.startLearning") : t("onboarding.continue")}
          </Continue>
        </Actions>
      </Card>
    </Overlay>
  );
};

const Overlay = styled.div`position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 1rem; background: ${theme.colors.background};`;
const Card = styled.section`inline-size: min(100%, 28rem); display: grid; justify-items: center; gap: 1rem; padding: 1.5rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.large}; box-shadow: ${theme.shadow.soft}; text-align: center;`;
const Logo = styled.img`inline-size: min(100%, 14rem); block-size: auto;`;
const Title = styled.h1`margin: 0; color: ${theme.colors.navy}; font-size: 1.8rem;`;
const Text = styled.p`margin: 0; max-inline-size: 22rem; color: ${theme.colors.textMuted}; line-height: 1.55;`;
const Dots = styled.div`display: flex; gap: 0.4rem;`;
const Dot = styled.span`inline-size: 0.55rem; block-size: 0.55rem; border-radius: 50%; background: ${(props) => props.$active ? theme.colors.primary : theme.colors.border};`;
const Actions = styled.div`inline-size: 100%; display: flex; justify-content: space-between; gap: 0.75rem;`;
const Skip = styled.button`min-block-size: 2.75rem; padding-inline: 1rem; color: ${theme.colors.textMuted}; background: transparent; border: 0; font-weight: 700;`;
const Continue = styled.button`min-block-size: 2.75rem; padding-inline: 1.25rem; color: white; background: ${theme.colors.primary}; border: 0; border-radius: ${theme.radius.small}; font-weight: 700;`;
