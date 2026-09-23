import { useEffect, useState } from "react";
import styled from "styled-components";
import { useLanguage } from "../i18n/LanguageProvider";
import {
  activateWaitingServiceWorker,
  getWaitingRegistration,
  subscribeToServiceWorkerUpdate,
} from "../services/serviceWorkerUpdate";
import { theme } from "../styles/theme";

export const UpdateNotification = () => {
  const { t } = useLanguage();
  const [registration, setRegistration] = useState(getWaitingRegistration);

  useEffect(() => subscribeToServiceWorkerUpdate(setRegistration), []);

  if (!registration) return null;

  return (
    <Toast role="status" aria-live="polite">
      <Message>{t("update.available")}</Message>
      <UpdateButton type="button" onClick={activateWaitingServiceWorker}>
        {t("update.action")}
      </UpdateButton>
    </Toast>
  );
};

const Toast = styled.aside`
  position: fixed;
  right: max(1rem, env(safe-area-inset-right));
  bottom: calc(${theme.navHeight} + 0.75rem + env(safe-area-inset-bottom));
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  max-inline-size: calc(100% - 2rem);
  padding: 0.75rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
`;

const UpdateButton = styled.button`
  min-block-size: 2.5rem;
  flex: 0 0 auto;
  padding-inline: 0.9rem;
  color: white;
  background: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: ${theme.radius.small};
  font-weight: 700;
  cursor: pointer;
  transition: transform 160ms ease, background-color 180ms ease;
  &:active {
    background: ${theme.colors.primaryPressed};
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;