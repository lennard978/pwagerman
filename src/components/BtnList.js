import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { useLanguage } from "../i18n/LanguageProvider";
import { theme } from "../styles/theme";

export const BtnList = ({ dataList, title, nav }) => {
  const { t } = useLanguage();

  return (
    <Container>
      <Row>
        {dataList.map((lesson, index) => (
          <Button key={lesson.id || index} to={`/${nav}/${index}`}>
            <ItemTitle>
              {lesson.titleKey ? t(lesson.titleKey) : `${title} ${index + 1}`}
            </ItemTitle>
            {lesson.descriptionKey && (
              <Description>{t(lesson.descriptionKey)}</Description>
            )}
          </Button>
        ))}
        <Outlet />
      </Row>
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  inline-size: min(100%, 48rem);
  padding: 0.75rem 1rem 7rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Row = styled.div`
  inline-size: 100%;
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  box-sizing: border-box;
  inline-size: 100%;
  max-inline-size: 42rem;
  min-block-size: 5.5rem;
  display: block;
  overflow-wrap: anywhere;
  padding: 1rem 1.1rem;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadow.soft};
  background: ${theme.colors.surface};
  text-decoration: none;
  border-radius: ${theme.radius.medium};
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  @media (hover: hover) {
    &:hover {
      border-color: ${theme.colors.primary};
      box-shadow: 0 12px 28px rgba(31, 41, 51, 0.12);
      transform: translateY(-2px);
    }
  }
  &:active {
    transform: scale(0.985);
  }
  &:focus-visible {
    outline: 3px solid ${theme.colors.primarySoft};
    outline-offset: 2px;
  }
`;

const ItemTitle = styled.span`
  display: block;
  font-size: 1.05rem;
  font-weight: 700;
`;

const Description = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.7rem;
  font-weight: 400;
  color: ${theme.colors.textMuted};
  line-height: 1.45;
`;
