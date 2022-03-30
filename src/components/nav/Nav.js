import {
  FaHome,
  FaFile,
  FaEye,
  FaPen,
  FaBookOpen,
  FaTrophy,
  FaFolderPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styled from "styled-components";

const NavLink = ({ to, title, children }) => {
  return (
    <Button to={to}>
      <div>{children}</div>
      <Paragraph>{title}</Paragraph>
    </Button>
  );
};
export default function Nav() {
  return (
    <>
      <Container>
        <Row>
          <NavLink to="/home" title="Home">
            <FaHome />
          </NavLink>
          <NavLink to="/chooselesson" title="Lesson">
            <FaFile />
          </NavLink>
          <NavLink to="/choosepair" title="Pair">
            <FaEye />
          </NavLink>
          <NavLink to="/choosewrite" title="Write">
            <FaPen />
          </NavLink>
          <NavLink to="/choosecards" title="Cards">
            <FaFolderPlus />
          </NavLink>
          <NavLink to="/choosetest" title="Test">
            <FaBookOpen />
          </NavLink>
          <NavLink to="/choosequiz" title="Quiz">
            <FaTrophy />
          </NavLink>
        </Row>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  inline-size: 100vw;
  border-top: 1px outset black;
  background-image: linear-gradient(to top, #243b50, #141e30);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: white;
  margin: 0;
  &:focus {
    color: rgba(57, 255, 20, 1);
  }
  &:hover {
    color: rgba(57, 255, 20, 1);
  }
`;

const Button = styled(Link)`
  padding-top: 0.2rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(57, 255, 20, 1);
  font-size: 1.2rem;
  &:focus {
    color: white;
  }
  &:hover {
    color: white;
  }
`;
