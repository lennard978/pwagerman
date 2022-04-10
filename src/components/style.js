import styled from "styled-components";

export const Btn = styled.button`
  text-transform: capitalize;
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
  background: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  cursor: pointer;
  &:active {
    border: 1px inset rgba(57, 255, 20, 1);
    transition: all 0.5s ease;
  }
`;
