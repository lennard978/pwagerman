import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaLanguage } from "react-icons/fa";
import { theme } from "../../styles/theme";

const modes = [
  ["Cases & Articles", "cases", "Case and article lessons with focused practice sets."],
  ["Verb Forms", "verbs", "Modal, tense, passive, and verb-form practice."],
  ["Word Order", "word-order", "Main, subordinate, question, and relative-clause order."],
  ["Connectors", "connectors", "Reason, result, contrast, and cohesive writing links."],
  ["Adjective Endings", "adjectives", "Adjective agreement plus comparative forms."],
];

export const GrammarPracticeHub = () => (
  <Wrapper><Header><p>German grammar practice</p><h1>Choose a focus</h1><span>Each card filters the same validated lesson engine; content is not duplicated.</span></Header><Grid>{modes.map(([title, focus, description]) => <Card key={focus} to={`/learn/grammar?focus=${focus}`}><FaLanguage aria-hidden="true" /><strong>{title}</strong><span>{description}</span></Card>)}</Grid><BackLink to="/practice">Back to Practice</BackLink></Wrapper>
);

const Wrapper = styled.main`inline-size: min(100%, 48rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`& p { margin: 0; color: ${theme.colors.primaryPressed}; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.08em; } & h1 { margin: 0.2rem 0; color: ${theme.colors.navy}; } & span { color: ${theme.colors.textMuted}; }`;
const Grid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr)); gap: 0.75rem; margin-top: 1rem;`;
const Card = styled(Link)`min-block-size: 9rem; display: flex; flex-direction: column; justify-content: center; gap: 0.5rem; padding: 1rem; color: ${theme.colors.text}; background: white; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; text-decoration: none; & svg { color: ${theme.colors.primary}; font-size: 1.4rem; } & span { color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.4; }`;
const BackLink = styled(Link)`min-block-size: 2.75rem; display: inline-flex; align-items: center; margin-top: 1rem; padding-inline: 1rem; color: ${theme.colors.text}; background: white; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; text-decoration: none; font-weight: 800;`;
