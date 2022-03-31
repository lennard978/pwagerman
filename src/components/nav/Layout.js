import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

export const Layout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  min-block-size: 100vh;
  min-inline-size: 100vw;
  display: flex;
  justify-content: center;
  position: absolute;
  z-index: -1;
  background-image: linear-gradient(to top, #243b50, #141e30);
`;
