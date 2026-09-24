import { useState } from "react";
import styled from "styled-components";
import { FaDownload } from "react-icons/fa";
import { useLanguage } from "../i18n/LanguageProvider";
import { theme } from "../styles/theme";

export const INSTALL_HELP_DISMISSED_KEY = "serbian-a1.installHelp.dismissed.v1";

// display-mode covers Chrome/Android installed PWAs; navigator.standalone
// covers iOS Safari Add-to-Home-Screen, which never reports display-mode.
export const isStandaloneDisplay = () => {
  if (typeof window === "undefined") return false;
  const matchesDisplayMode =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(display-mode: standalone)").matches;
  const isIosStandalone = window.navigator && window.navigator.standalone === true;
  return Boolean(matchesDisplayMode || isIosStandalone);
};

export const isIosDevice = () => {
  if (typeof navigator === "undefined") return false;
  const isAppleTouchDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // iPadOS 13+ identifies as a Mac; touch points distinguish it from a real Mac.
  const isIpadDesktopMode =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isAppleTouchDevice || isIpadDesktopMode;
};

export const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;
  return isIosDevice() || /Android|Mobile/i.test(navigator.userAgent);
};

const wasDismissed = () => {
  try {
    return window.localStorage.getItem(INSTALL_HELP_DISMISSED_KEY) === "true";
  } catch (error) {
    return false;
  }
};

export const InstallHelp = () => {
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(wasDismissed);

  if (isStandaloneDisplay() || !isMobileDevice() || dismissed) return null;

  const isIos = isIosDevice();
  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(INSTALL_HELP_DISMISSED_KEY, "true");
    } catch (error) {
      // Dismissal still works for this visit when storage is unavailable.
    }
  };

  return (
    <Card aria-label={t("install.cta")}>
      <Icon aria-hidden="true"><FaDownload /></Icon>
      <Content>
        <CardTitle>{t("install.cta")}</CardTitle>
        <Description>{t("install.description")}</Description>
        {isIos ? (
          <Steps>
            <li>{t("install.ios.step1")}</li>
            <li>{t("install.ios.step2")}</li>
            <li>{t("install.ios.step3")}</li>
          </Steps>
        ) : (
          <Steps>
            <li>{t("install.android.step1")}</li>
            <li>{t("install.android.step2")}</li>
          </Steps>
        )}
        <CloseButton type="button" onClick={dismiss}>
          {t("install.close")}
        </CloseButton>
      </Content>
    </Card>
  );
};

const Card = styled.aside`
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-top: 1rem;
  padding: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.primarySoft};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};
`;

const Icon = styled.span`
  flex: 0 0 2.5rem;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: ${theme.colors.primary};
  border-radius: ${theme.radius.small};
`;

const Content = styled.div`
  min-inline-size: 0;
  display: grid;
  gap: 0.55rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
`;

const Description = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 0.9rem;
  line-height: 1.45;
`;

const Steps = styled.ol`
  margin: 0;
  padding-inline-start: 1.2rem;
  display: grid;
  gap: 0.3rem;
  color: ${theme.colors.textMuted};
  font-size: 0.86rem;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  justify-self: start;
  min-block-size: 2.75rem;
  padding-inline: 1rem;
  color: ${theme.colors.primaryPressed};
  background: ${theme.colors.surface};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.small};
  font-weight: 700;
  &:focus-visible { outline: 3px solid ${theme.colors.primary}; outline-offset: 2px; }
`;
