import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../../styles/theme";

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
  padding-top: 3.5rem;
  padding-bottom: ${theme.navHeight};
  display: flex;
  justify-content: center;
  position: relative;
  background: ${theme.colors.background};
`;
