import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import styled from "styled-components";
export default function SoundButton({ children, german, className }) {
  const { speak, voices } = useSpeechSynthesis();
  const voice = voices.find(({ lang }) => lang.startsWith("de"));
  return (
    <Row onClick={() => speak({ rate: 0.6, pitch: 0, voice, text: german })}>
      {children}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #141e30;
  border-right: 1px solid #141e30;
  border-top: 1px solid #243b50;
  border-left: 1px solid #243b50;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.3);
  background-image: linear-gradient(to top, #243b50, #141e30);
  text-decoration: none;
  border-radius: 0.2rem;
  padding-block: 0.5rem;
  padding-inline: 2rem;
  margin: 0.2rem;
  cursor: pointer;
`;
