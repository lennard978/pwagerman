# German B1 vocabulary sources and provenance

Last reviewed: 2026-11-01

## Official reference boundary

The current [Goethe-Zertifikat B1 Wortliste](https://www.goethe.de/pro/relaunch/prf/id/Goethe-Zertifikat_B1_Wortliste.pdf) is used only as a coverage and level reference. The PDF describes the underlying B1 vocabulary as approximately 2,400 lexical units; the repository's reproducible normalization produces 3,176 units from 3,218 raw lexical records, so 2,400 is not treated as an exact machine target.

Reference fingerprint: SHA-256 `8860f7f0c916831b2365f66239a3ceba3be81ddba28e1224846ca8420807fe42` (104 pages, retrieved 2026-10-31 from the current official Goethe URL).

The repository does not include the PDF, official layout, official example sentences, or explanatory prose. The machine-readable inventory retains only lexical entries and the minimum lexical metadata needed for coverage review: articles, lemmas, plural/inflection notation, variants, regional markers, and app mappings.

## App-authored content

All English meanings, German example sentences, English example translations, learner notes, categories, exercises, and UI presentation are original content authored for this application. Every production record uses `sourceType: "original-curated"`.

Allowed product wording:

> Vocabulary coverage aligned with the Goethe-Zertifikat B1 Wortliste.

Required positioning:

> Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.

The app must not be described as official or as providing 100% Goethe coverage.

## Extraction and normalization method

1. Extract the alphabetical lexical section and machine-readable thematic word groups from the official PDF.
2. Normalize Unicode with NFKC and retain each raw record with a stable raw ID and source page/section.
3. Separate noun article, lemma, plural notation, and a mechanically expanded plural form where the notation is deterministic.
4. Preserve reflexive markers, separable markers, slash variants, arrow-linked variants, and Germany/Austria/Switzerland markers.
5. Keep homographs distinct by normalized lemma, article, and part of speech; merge only matching identities and retain every contributing raw ID.
6. Map app lexemes by explicit reference key, then classify normalized units as `covered`, `partially-covered`, `variant-covered`, or `uncovered`.
7. Validate identifiers, metadata, examples, grammar references, Unicode, and reference mappings automatically.

The extractor is intentionally conservative. Ambiguous source notation remains visible in `rawEntry`/`pluralNotation` rather than being silently interpreted. The generated sample report is automated and is not a claim of complete linguistic human review.

## Current Phase 10.3 production and decision audit

- Production lexemes: 2,367 (800 retained + 1,567 cumulative Phase 10 additions).
- Final POS: 1,155 nouns; 660 verbs; 242 adjectives; 99 adverbs; 56 connectors; 30 prepositions; 125 functional phrases.
- Phase 10.3 additions: 417 (247 nouns, 100 verbs, 40 adjectives, 15 adverbs, 1 connector, 4 prepositions, 10 phrases).
- Original German/English example pairs: 2,367.
- Fully covered normalized reference units: 2,196 (2,186 exact + 10 variant-covered).
- Partial mappings: 0; unresolved uncovered units: 0; excluded with reason: 980; full coverage: 69.14%.
- Source type: 100% `original-curated` for learner-facing cards.

Phase 10.3 classifies every pre-phase partial/uncovered unit by lexical type, normalization confidence, regional status, and final decision. Intentional exclusions use explicit reason codes instead of silent deletion. Regional alternatives remain evidence-first metadata unless a separate learner card has independent value.

Reproducibility artifacts:

- `scripts/vocabulary/phase10-curation.cjs` is the compact curation source.
- `scripts/vocabulary/build-phase10-lexemes.cjs` regenerates specs, inventory, summary, full gap analysis, and audit sample.
- `src/data/vocabulary/phase10LexemeSpecs.json` contains 1,567 cumulative generated additions, including 417 tagged Phase 10.3 records.
- `docs/GERMAN-B1-WORTLISTE-GAP-ANALYSIS.json` records all 1,764 reviewed starting gaps and their decisions.
- `docs/GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json` explicitly disclaims complete external expert review.

## Archived pre-Phase-10.3 production batch

The following figures preserve the exact 1,950-word checkpoint from which the Phase 10.3 audit was computed.

### Phase 10.2 production batch

- Production lexemes: 1,950 (800 retained + 600 Phase 10 entries + 550 Phase 10.2 entries)
- Categories: 25, weighted by practical and exam relevance rather than equal size
- Original German examples and English translations: 1,950 pairs
- Nouns: 908; verbs: 560; adjectives: 202; adverbs: 84; connectors: 55; prepositions: 26; functional phrases: 115
- Phase 10.2 additions: 250 nouns, 170 verbs, 60 adjectives, 25 adverbs, 10 connectors, 5 prepositions, and 30 functional phrases
- Source type: 100% `original-curated`
- Fully covered normalized reference units: 1,412 (1,402 exact + 10 variant-covered)
- Partial mappings: 409; uncovered normalized reference units: 1,355; full coverage: 44.46%

The production curriculum prioritizes high-frequency, everyday, administrative, travel, work, education, health, communication, opinion, connector, and functional exam language. It remains a quality-controlled subset of the normalized inventory.

### Phase 10/10.2 reproducibility

- `scripts/vocabulary/phase10-curation.cjs` is the compact, reviewed curation source.
- `scripts/vocabulary/build-phase10-lexemes.cjs` validates and deterministically regenerates the Phase 10 specs, coverage inventory, summary, and audit sample.
- `src/data/vocabulary/phase10LexemeSpecs.json` contains the 1,150 generated learner-facing additions.
- `docs/GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json` records a deterministic 141-entry developer audit sample and explicitly disclaims complete expert review.
- The builder preserves prior Phase 9 regional variant mappings and can be rerun without changing its output hashes.
