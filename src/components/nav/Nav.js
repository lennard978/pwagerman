import {
  FaHome,
  FaFile,
  FaEye,
  FaPen,
  FaBookOpen,
  FaTrophy,
  FaFolderPlus,
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

  return (
    <>
      <Container as="nav" aria-label="Primary navigation">
        <Row>
          <NavLink to="/home" title={t("navigation.home")} active={location.pathname === "/home" || location.pathname === "/"}>
            <FaHome />
          </NavLink>
          <NavLink to="/chooselesson" title={t("navigation.lesson")} active={location.pathname.startsWith("/chooselesson")}>
            <FaFile />
          </NavLink>
          <NavLink to="/choosepair" title={t("navigation.pair")} active={location.pathname.startsWith("/choosepair")}>
            <FaEye />
          </NavLink>
          <NavLink to="/choosewrite" title={t("navigation.write")} active={location.pathname.startsWith("/choosewrite")}>
            <FaPen />
          </NavLink>
          <NavLink to="/choosecards" title={t("navigation.cards")} active={location.pathname.startsWith("/choosecards")}>
            <FaFolderPlus />
          </NavLink>
          <NavLink to="/choosetest" title={t("navigation.test")} active={location.pathname.startsWith("/choosetest")}>
            <FaBookOpen />
          </NavLink>
          <NavLink to="/choosequiz" title={t("navigation.quiz")} active={location.pathname.startsWith("/choosequiz")}>
            <FaTrophy />
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

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  max-inline-size: 42rem;
  margin-inline: auto;
  padding: 0.35rem 0.25rem;
`;

const Paragraph = styled.p`
  min-inline-size: 0;
  font-size: 0.68rem;
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
  font-size: 1rem;
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
