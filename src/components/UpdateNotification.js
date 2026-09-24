import { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSyncAlt } from "react-icons/fa";
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
      <UpdateIcon aria-hidden="true"><FaSyncAlt /></UpdateIcon>
      <Copy>
        <Message>{t("update.available")}</Message>
        <Description>{t("update.description")}</Description>
      </Copy>
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
  inline-size: min(28rem, calc(100% - 2rem));
  padding: 0.85rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surface};
  border: 1px solid #fed7aa;
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.shadow.soft};

  @media (max-width: 24rem) {
    right: 1rem;
    align-items: stretch;
    flex-wrap: wrap;
  }
`;

const UpdateIcon = styled.span`
  flex: 0 0 2.5rem;
  inline-size: 2.5rem;
  block-size: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  background: ${theme.colors.primarySoft};
  border-radius: ${theme.radius.small};
`;

const Copy = styled.div`
  min-inline-size: 0;
  flex: 1;
  display: grid;
  gap: 0.15rem;
`;

const Message = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 800;
`;

const Description = styled.p`
  margin: 0;
  color: ${theme.colors.textMuted};
  font-size: 0.78rem;
  line-height: 1.35;
`;

const UpdateButton = styled.button`
  min-block-size: 2.75rem;
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

  @media (max-width: 24rem) {
    inline-size: 100%;
  }
`;