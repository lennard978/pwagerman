import React, { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { theme } from "../../styles/theme";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const Layout = () => {
  const location = useLocation();

  return (
    <Container>
      <ScrollToTop />
      <Page key={location.pathname}>
        <Outlet />
      </Page>
    </Container>
  );
};

const enterPage = keyframes`
  from { opacity: 0; inset-block-start: 4px; }
  to { opacity: 1; inset-block-start: 0; }
`;

const Container = styled.div`
  min-block-size: 100vh;
  inline-size: 100%;
  min-inline-size: 0;
  padding-top: 3.5rem;
  padding-bottom: ${theme.navHeight};
  display: flex;
  justify-content: center;
  position: relative;
  background: ${theme.colors.background};
`;

const Page = styled.div`
  inline-size: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  animation: ${enterPage} 220ms ease-out both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
