import { Link } from "react-router-dom";
import styled from "styled-components";

export const BackBtn = ({ title, to }) => {
  return <Button to={to}>{title}</Button>;
};

const Button = styled(Link)`
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(57, 255, 20, 1);
  padding-block: 0.3rem;
  padding-inline: 2rem;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(to left, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
`;
