import React from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

export const ChooseLesson = ({ data }) => {
  return (
    <Container>
      <Row>
        {data.map((lesson, index) => (
          <div key={index}>
            <Button to={`/chooselesson/${index}`}>Lesson {index + 1}</Button>
          </div>
        ))}
        <Outlet />
      </Row>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 100vw;
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
