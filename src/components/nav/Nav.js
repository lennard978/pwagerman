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
      <Paragraph>{title}</Paragraph>
    </Button>
  );
};
export default function Nav() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  return (
    <>
      <Utility>
        <LanguageArea>
          <LanguageLabel htmlFor="language-select">
            {t("language.label")}
          </LanguageLabel>
          <LanguageSelect
            id="language-select"
            aria-label={t("language.label")}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            <option value="en">{t("language.english")}</option>
            <option value="sr-Latn">{t("language.serbian")}</option>
          </LanguageSelect>
        </LanguageArea>
      </Utility>
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
  inline-size: 100vw;
  z-index: 10;
  border-top: 1px solid ${theme.colors.border};
  background: ${theme.colors.nav};
  box-shadow: ${theme.shadow.nav};
`;

const Utility = styled.div`
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  block-size: 3.25rem;
  z-index: 12;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-inline: 0.75rem;
  pointer-events: none;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  max-inline-size: 42rem;
  margin-inline: auto;
  padding: 0.35rem 0.25rem;
`;

const LanguageArea = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.5rem;
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  box-shadow: ${theme.shadow.soft};
`;

const LanguageLabel = styled.label`
  color: ${theme.colors.textMuted};
  font-size: 0.7rem;
`;

const LanguageSelect = styled.select`
  min-block-size: 2.25rem;
  max-inline-size: 7rem;
  color: ${theme.colors.text};
  background: ${theme.colors.surfaceMuted};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.small};
  cursor: pointer;
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    border-color: ${theme.colors.primary};
  }
`;

const Paragraph = styled.p`
  min-inline-size: 0;
  font-size: 0.68rem;
  color: ${theme.colors.textMuted};
  margin: 0;
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
  transition: 180ms ease;
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: -2px;
    border-radius: ${theme.radius.small};
  }
  &:hover {
    color: ${theme.colors.primary};
  }
`;
