import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

export const BtnList = ({ dataList, title, nav }) => {
  return (
    <Container>
      <Row>
        {dataList.map((lesson, index) => (
          <Button key={index} to={`/${nav}/${index}`}>
            {title} {index + 1}
          </Button>
        ))}
        <Outlet />
      </Row>
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  margin: 5px;
  padding-block: 0.5rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  &:hover {
    border-bottom: 1px solid rgba(57, 255, 20, 1);
    border-left: 1px solid rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;
