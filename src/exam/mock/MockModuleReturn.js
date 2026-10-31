import { Link } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";
import { loadMockSession } from "../core/mockPersistence";
import { isLinkedToActiveMock } from "../core/mockModuleBridge";

export const MockModuleReturn = ({ moduleId, sessionId }) => {
  const mock = loadMockSession();
  if (!isLinkedToActiveMock(moduleId, sessionId, mock)) return null;
  return (
    <Return role="status">
      <div><strong>Full B1 Practice Mock</strong><span>This submitted module is locked. Continue with the next module when ready.</span></div>
      <Link to="/exam/full-mock-b1/session">Continue mock →</Link>
    </Return>
  );
};

const Return = styled.aside`
  inline-size:min(100%,58rem);display:flex;align-items:center;justify-content:space-between;gap:1rem;
  margin:1rem auto;padding:1rem;border:2px solid ${theme.colors.primary};border-radius:${theme.radius.medium};
  background:${theme.colors.primarySoft};span,strong{display:block;}span{margin-top:.2rem;color:${theme.colors.textMuted};font-size:.82rem;}
  a{min-block-size:2.8rem;display:inline-flex;align-items:center;padding:.6rem .8rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-decoration:none;}
  @media(max-width:34rem){align-items:stretch;flex-direction:column;}
`;
