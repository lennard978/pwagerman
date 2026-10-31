import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCheck, FaSearch, FaVolumeUp } from "react-icons/fa";
import { CompactSoundButton } from "../../components/CompactSoundButton";
import { WordStatusActions } from "../../components/WordStatusActions";
import { TARGET_LANGUAGE, TARGET_LANGUAGE_NAME } from "../../config/course";
import {
  formatLexemeTarget,
  getLexemeMetadata,
  getLexemeSpeechText,
  matchesVocabularySearch,
} from "../../data/vocabulary/presentation";
import { theme } from "../../styles/theme";

const FILTERS = ["all", "learning", "known", "favorites"];
const INITIAL_LIMIT = 30;

export const VocabularyLibrary = ({ data }) => {
  const requestedFilter = new URLSearchParams(window.location.search).get("filter");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState(FILTERS.includes(requestedFilter) ? requestedFilter : "all");
  const [visibleLimit, setVisibleLimit] = useState(INITIAL_LIMIT);
  const lexemes = useMemo(() => data.flatMap((category) => category.items), [data]);
  const filtered = useMemo(() => lexemes.filter((lexeme) => {
    if (!matchesVocabularySearch(lexeme, query)) return false;
    if (filter === "known") return lexeme.status === "known";
    if (filter === "learning") return lexeme.status === "learning";
    if (filter === "favorites") return lexeme.favorite;
    return true;
  }), [filter, lexemes, query]);
  const showLibrary = Boolean(query.trim()) || filter !== "all";

  const chooseFilter = (next) => {
    setFilter(next);
    setVisibleLimit(INITIAL_LIMIT);
  };

  return (
    <Wrapper>
      <Header>
        <h1>Vocabulary</h1>
        <p>Browse 250 original German B1 lexemes across practical exam-relevant categories.</p>
      </Header>
      <SearchLabel>
        <span>Search English or German</span>
        <SearchField>
          <FaSearch aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleLimit(INITIAL_LIMIT);
            }}
            placeholder="Try appointment, Termin, or zuverlässig"
          />
        </SearchField>
      </SearchLabel>
      <Filters aria-label="Vocabulary filters">
        {FILTERS.map((name) => (
          <FilterButton key={name} type="button" $active={filter === name} aria-pressed={filter === name} onClick={() => chooseFilter(name)}>
            {name === "all" ? "All" : name[0].toUpperCase() + name.slice(1)}
          </FilterButton>
        ))}
      </Filters>

      {!showLibrary ? (
        <CategoryGrid aria-label="Vocabulary categories">
          {data.map((category) => {
            const known = category.items.filter((item) => item.status === "known").length;
            const learning = category.items.filter((item) => item.status === "learning").length;
            return (
              <CategoryCard key={category.id} to={`/learn/vocabulary/${category.id}`}>
                <strong>{category.title}</strong>
                <span>{category.description}</span>
                <CategoryMeta>
                  <b>{category.items.length} words</b>
                  <span><FaCheck aria-hidden="true" /> {known} known</span>
                  <span>{learning} learning</span>
                </CategoryMeta>
              </CategoryCard>
            );
          })}
        </CategoryGrid>
      ) : (
        <Results aria-live="polite">
          <ResultCount>{filtered.length} matching words</ResultCount>
          {filtered.slice(0, visibleLimit).map((lexeme) => (
            <LexemeCard key={lexeme.id}>
              <LexemeTop>
                <div>
                  <Source>{lexeme.source}</Source>
                  <Target>{formatLexemeTarget(lexeme)}</Target>
                  <Part>{lexeme.partOfSpeech}</Part>
                </div>
                <CompactSoundButton
                  text={getLexemeSpeechText(lexeme)}
                  lang={TARGET_LANGUAGE}
                  ariaLabel={`Hear ${TARGET_LANGUAGE_NAME} pronunciation: ${formatLexemeTarget(lexeme)}`}
                >
                  <FaVolumeUp aria-hidden="true" />
                </CompactSoundButton>
              </LexemeTop>
              <details>
                <summary>Example and grammar</summary>
                <Example lang="de">{lexeme.example}</Example>
                <Translation>{lexeme.exampleTranslation}</Translation>
                {getLexemeMetadata(lexeme).map((line) => <Metadata key={line}>{line}</Metadata>)}
                {lexeme.note && <Metadata>{lexeme.note}</Metadata>}
              </details>
              <WordStatusActions word={lexeme} />
            </LexemeCard>
          ))}
          {filtered.length > visibleLimit && (
            <LoadMore type="button" onClick={() => setVisibleLimit((limit) => limit + INITIAL_LIMIT)}>
              Show more
            </LoadMore>
          )}
          {filtered.length === 0 && <Empty>No vocabulary matches this search and filter.</Empty>}
        </Results>
      )}
      <CoverageNote>
        Vocabulary coverage aligned with the Goethe-Zertifikat B1 Wortliste. Independent preparation tool; not affiliated with or endorsed by the Goethe-Institut.
      </CoverageNote>
    </Wrapper>
  );
};

const Wrapper = styled.main`box-sizing: border-box; inline-size: min(100%, 64rem); min-block-size: 100vh; padding: 1rem 1rem 7rem;`;
const Header = styled.header`& h1 { margin: 0; color: ${theme.colors.text}; font-size: 1.8rem; } & p { margin: 0.4rem 0 1rem; color: ${theme.colors.textMuted}; line-height: 1.45; }`;
const SearchLabel = styled.label`display: grid; gap: 0.4rem; color: ${theme.colors.textMuted}; font-size: 0.82rem; font-weight: 700;`;
const SearchField = styled.div`min-block-size: 2.9rem; display: flex; align-items: center; gap: 0.65rem; padding-inline: 0.85rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; & svg { flex: 0 0 auto; color: ${theme.colors.primary}; } & input { min-inline-size: 0; min-block-size: 2.75rem; inline-size: 100%; border: 0; outline: 0; color: ${theme.colors.text}; background: transparent; font: inherit; } &:focus-within { outline: 3px solid ${theme.colors.primarySoft}; border-color: ${theme.colors.primary}; }`;
const Filters = styled.div`display: flex; gap: 0.45rem; margin: 0.75rem 0 1rem; overflow-x: auto; padding-bottom: 0.2rem;`;
const FilterButton = styled.button`flex: 0 0 auto; min-block-size: 2.75rem; padding-inline: 0.95rem; color: ${(p) => p.$active ? "white" : theme.colors.textMuted}; background: ${(p) => p.$active ? theme.colors.navy : theme.colors.surface}; border: 1px solid ${(p) => p.$active ? theme.colors.navy : theme.colors.border}; border-radius: ${theme.radius.pill}; font-weight: 700;`;
const CategoryGrid = styled.div`display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr)); gap: 0.75rem;`;
const CategoryCard = styled(Link)`min-inline-size: 0; min-block-size: 9.5rem; display: grid; align-content: start; gap: 0.5rem; padding: 1rem; color: ${theme.colors.text}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; text-decoration: none; & > strong { font-size: 1.02rem; } & > span { color: ${theme.colors.textMuted}; font-size: 0.82rem; line-height: 1.4; } &:focus-visible { outline: 3px solid ${theme.colors.primarySoft}; outline-offset: 2px; }`;
const CategoryMeta = styled.div`display: flex; flex-wrap: wrap; gap: 0.35rem 0.65rem; margin-top: auto; color: ${theme.colors.textMuted}; font-size: 0.72rem; & b { color: ${theme.colors.primaryPressed}; } & span { display: inline-flex; align-items: center; gap: 0.2rem; }`;
const Results = styled.section`display: grid; gap: 0.7rem;`;
const ResultCount = styled.p`margin: 0; color: ${theme.colors.textMuted}; font-size: 0.82rem;`;
const LexemeCard = styled.article`min-inline-size: 0; display: grid; gap: 0.8rem; padding: 1rem; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.medium}; box-shadow: ${theme.shadow.soft}; & details { border-top: 1px solid ${theme.colors.border}; padding-top: 0.65rem; } & summary { min-block-size: 2.75rem; display: flex; align-items: center; color: ${theme.colors.primaryPressed}; cursor: pointer; font-weight: 700; }`;
const LexemeTop = styled.div`display: flex; align-items: start; justify-content: space-between; gap: 0.8rem; min-inline-size: 0; & > div { min-inline-size: 0; }`;
const Source = styled.p`margin: 0; color: ${theme.colors.textMuted}; font-weight: 700; overflow-wrap: anywhere;`;
const Target = styled.p`margin: 0.2rem 0; color: ${theme.colors.primaryPressed}; font-size: 1.2rem; font-weight: 850; overflow-wrap: anywhere;`;
const Part = styled.span`display: inline-block; padding: 0.15rem 0.45rem; color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.pill}; font-size: 0.68rem;`;
const Example = styled.p`margin: 0.5rem 0 0; color: ${theme.colors.text}; line-height: 1.45;`;
const Translation = styled.p`margin: 0.25rem 0 0.5rem; color: ${theme.colors.textMuted}; font-size: 0.88rem; line-height: 1.45;`;
const Metadata = styled.p`margin: 0.2rem 0; color: ${theme.colors.textMuted}; font-size: 0.78rem;`;
const LoadMore = styled.button`min-block-size: 2.75rem; color: ${theme.colors.navy}; background: ${theme.colors.surface}; border: 1px solid ${theme.colors.border}; border-radius: ${theme.radius.small}; font-weight: 700;`;
const Empty = styled.p`padding: 1.5rem; color: ${theme.colors.textMuted}; background: ${theme.colors.surfaceMuted}; border-radius: ${theme.radius.medium}; text-align: center;`;
const CoverageNote = styled.p`margin: 1rem 0 0; color: ${theme.colors.textMuted}; font-size: 0.72rem; line-height: 1.45; text-align: center;`;
