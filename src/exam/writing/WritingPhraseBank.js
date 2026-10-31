import { Link } from "react-router-dom";
import styled from "styled-components";
import { getGermanGrammarLesson } from "../../data/grammar/lessons";
import { theme } from "../../styles/theme";
import { writingPhraseBank } from "./phraseBank";

export const WritingPhraseBank = () => (
  <Page>
    <Back to="/practice">← Practice</Back>
    <span>Writing study resource</span><h1>B1 useful phrase bank</h1>
    <Intro>Original planning phrases for personal email, opinion, and formal email tasks. Use them during study—not during a full Writing simulation.</Intro>
    <Grid>{writingPhraseBank.map((category) => <Card key={category.id}><h2>{category.title}</h2><dl>{category.groups.map(([label, phrase]) => <div key={label}><dt>{label}</dt><dd lang="de">{phrase}</dd></div>)}</dl><Links>{category.grammarRefs.map((id) => { const lesson = getGermanGrammarLesson(id); return lesson ? <Link key={id} to={`/learn/grammar/${id}`}>{lesson.title}</Link> : null; })}</Links></Card>)}</Grid>
    <Actions><Link to="/exam/writing/practice/1">Practice Task 1</Link><Link to="/exam/writing/practice/2">Practice Task 2</Link><Link to="/exam/writing/practice/3">Practice Task 3</Link></Actions>
    <FinePrint>These phrases are original study guidance, not official Goethe material or a memorisable answer.</FinePrint>
  </Page>
);

const Page = styled.main`inline-size:min(100%,64rem);min-block-size:100vh;padding:1.25rem 1rem 7rem;color:${theme.colors.text};>span{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;}h1{margin:.25rem 0;}`;
const Back = styled(Link)`display:inline-block;margin-bottom:1rem;color:${theme.colors.primaryPressed};font-weight:800;text-decoration:none;`;
const Intro = styled.p`max-inline-size:46rem;margin:.4rem 0 1.25rem;color:${theme.colors.textMuted};line-height:1.55;`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem;@media(max-width:48rem){grid-template-columns:1fr;}`;
const Card = styled.section`min-inline-size:0;padding:1rem;border:1px solid ${theme.colors.border};border-radius:${theme.radius.large};background:${theme.colors.surface};box-shadow:${theme.shadow.soft};h2{margin:0 0 .8rem;}dl{margin:0;}div{padding:.6rem 0;border-top:1px solid ${theme.colors.border};}dt{color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:900;text-transform:uppercase;}dd{margin:.2rem 0 0;line-height:1.45;}`;
const Links = styled.div`display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.8rem;a{padding:.35rem .55rem;border-radius:${theme.radius.pill};background:${theme.colors.primarySoft};color:${theme.colors.primaryPressed};font-size:.72rem;font-weight:800;text-decoration:none;}`;
const Actions = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;a{display:inline-flex;min-block-size:2.8rem;align-items:center;padding:.6rem .8rem;border-radius:${theme.radius.small};background:${theme.colors.primary};color:white;font-weight:900;text-decoration:none;}`;
const FinePrint = styled.p`color:${theme.colors.textMuted};font-size:.72rem;`;
