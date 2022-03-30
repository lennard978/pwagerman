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
  background-image: linear-gradient(to top, #243b50, #141e30);
  min-block-size: 100vh;
`;
