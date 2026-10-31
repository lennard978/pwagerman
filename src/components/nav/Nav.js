import {
  FaHome,
  FaGraduationCap,
  FaClipboardCheck,
  FaDumbbell,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../../i18n/LanguageProvider";
import { theme } from "../../styles/theme";

const NavLink = ({ to, title, children, active }) => {
  return (
    <Button to={to} $active={active} aria-current={active ? "page" : undefined}>
      <div>{children}</div>
      <Paragraph $active={active}>{title}</Paragraph>
    </Button>
  );
};
export default function Nav() {
  const { t } = useLanguage();
  const location = useLocation();

  if (["/exam/reading/simulation", "/exam/listening/simulation", "/exam/writing/simulation", "/exam/speaking/solo-simulation", "/exam/speaking/pair-simulation", "/exam/full-mock-b1/session"].includes(location.pathname)) return null;

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <Container as="nav" aria-label="Primary navigation">
        <Row>
          <NavLink to="/home" title={t("navigation.home")} active={location.pathname === "/home" || location.pathname === "/"}>
            <FaHome />
          </NavLink>
          <NavLink to="/learn" title={t("navigation.learn")} active={location.pathname.startsWith("/learn")}>
            <FaGraduationCap />
          </NavLink>
          <NavLink to="/practice" title={t("navigation.practice")} active={location.pathname.startsWith("/practice")}>
            <FaDumbbell />
          </NavLink>
          <NavLink to="/exam" title={t("navigation.exam")} active={location.pathname.startsWith("/exam")}>
            <FaClipboardCheck />
          </NavLink>
        </Row>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  inline-size: 100%;
  z-index: 10;
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.nav};
  box-shadow: ${theme.shadow.nav};
`;

const SkipLink = styled.a`
  position: fixed;
  inset-block-start: .5rem;
  inset-inline-start: .5rem;
  z-index: 200;
  padding: .65rem .85rem;
  color: white;
  background: ${theme.colors.navy};
  border-radius: ${theme.radius.small};
  transform: translateY(-150%);
  &:focus { transform: translateY(0); }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  max-inline-size: 42rem;
  margin-inline: auto;
  padding: 0.35rem 0.25rem;
`;

const Paragraph = styled.p`
  min-inline-size: 0;
  font-size: 0.75rem;
  color: ${(props) => (props.$active ? theme.colors.primary : theme.colors.textMuted)};
  margin: 0;
  transition: color 180ms ease;
`;

const Button = styled(Link)`
  min-inline-size: 0;
  min-block-size: 4rem;
  padding: 0.25rem 0.1rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.$active ? theme.colors.primary : theme.colors.textMuted)};
  font-size: 1.15rem;
  transition: color 180ms ease, transform 160ms ease;
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: -2px;
    border-radius: ${theme.radius.small};
  }
  &:hover {
    color: ${theme.colors.primary};
  }
  &:active {
    transform: scale(0.97);
  }
`;
