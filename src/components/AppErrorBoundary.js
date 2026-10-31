import React from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    if (process.env.NODE_ENV !== "test") console.error("German B1 UI recovery boundary", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <Recovery role="alert">
        <div>
          <h1>The page could not be displayed</h1>
          <p>Your locally saved progress has not been cleared. Return home and try again.</p>
          <a href="/pwagerman/home">Return to German B1 Home</a>
        </div>
      </Recovery>
    );
  }
}

const Recovery = styled.main`
  min-block-size: 100vh;
  display: grid;
  place-items: center;
  padding: 1rem;
  color: ${theme.colors.text};
  background: ${theme.colors.background};
  > div {
    inline-size: min(100%, 30rem);
    padding: 1.25rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius.large};
    background: ${theme.colors.surface};
    box-shadow: ${theme.shadow.soft};
  }
  h1 { margin-top: 0; color: ${theme.colors.navy}; }
  p { line-height: 1.55; }
  a {
    min-block-size: 2.75rem;
    display: inline-flex;
    align-items: center;
    padding-inline: 1rem;
    border-radius: ${theme.radius.small};
    color: white;
    background: ${theme.colors.primary};
    font-weight: 800;
    text-decoration: none;
  }
`;
