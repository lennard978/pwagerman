import { useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../i18n/LanguageProvider";
import { theme } from "../styles/theme";

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

export const InstallHelp = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  if (isStandaloneDisplay()) return null;

  const isIos = isIosDevice();

  return (
    <>
      <InstallButton type="button" onClick={() => setOpen(true)}>
        {t("install.cta")}
      </InstallButton>
      {open && (
        <Overlay
          role="dialog"
          aria-modal="true"
          aria-label={t("install.cta")}
          onClick={() => setOpen(false)}
        >
          <Card onClick={(event) => event.stopPropagation()}>
            <CardTitle>{t("install.cta")}</CardTitle>
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
            <CloseButton type="button" onClick={() => setOpen(false)}>
              {t("install.close")}
            </CloseButton>
          </Card>
        </Overlay>
      )}
    </>
  );
};

const InstallButton = styled.button`
  min-block-size: 2.5rem;
  padding-inline: 1rem;
  color: ${theme.colors.primary};
  background: ${theme.colors.primarySoft};
  border: 1px solid ${theme.colors.primarySoft};
  border-radius: ${theme.radius.pill};
  font-weight: 700;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 1rem;
  background: rgba(31, 41, 51, 0.4);
  z-index: 40;

  @media (min-width: 640px) {
    align-items: center;
  }
`;

const Card = styled.div`
  display: grid;
  gap: 0.75rem;
  inline-size: min(100%, 24rem);
  padding: 1.25rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border-radius: ${theme.radius.large};
  box-shadow: ${theme.shadow.soft};
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
`;

const Steps = styled.ol`
  margin: 0;
  padding-inline-start: 1.2rem;
  display: grid;
  gap: 0.4rem;
  color: ${theme.colors.textMuted};
`;

const CloseButton = styled.button`
  justify-self: end;
  min-block-size: 2.5rem;
  padding-inline: 1rem;
  color: white;
  background: ${theme.colors.primary};
  border: 0;
  border-radius: ${theme.radius.small};
  font-weight: 700;
`;
