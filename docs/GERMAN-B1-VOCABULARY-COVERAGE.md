# German B1 vocabulary coverage analysis

Analysis date: 2026-10-31

This document reports a developer coverage analysis. It is not an official coverage certificate or a guarantee that every lexical variant required in a specific exam form is implemented.

## Current result

| Metric | Phase 2 result |
| --- | ---: |
| Approximate official reference size | 2,400 lexical units |
| Reviewed reference items in the app subset | 250 |
| Normalized reference keys in the reviewed subset | 250 |
| Duplicate/variant groups in the reviewed subset | 0 |
| Production app lexemes | 250 |
| Covered estimate | 10.42% |
| Uncovered estimate | 2,150 |
| Coverage status | Partial reviewed subset |

The approximate 2,400-unit figure comes from the introduction to the official Goethe-Zertifikat B1 Wortliste. The uncovered figure is a roadmap estimate calculated as `2400 - reviewed covered keys`; it is not an official count of missing app words because inflected forms, lexical variants, multiword expressions, and homographs require human review.

## Normalization methodology

- Unicode is normalized with NFKC and German-aware lowercasing.
- A noun article is stored separately and removed from its normalized reference key.
- Separable markers such as `ab|fahren` normalize to the lemma `abfahren`.
- Reflexive forms retain `sich` so they are not merged automatically with non-reflexive uses.
- Part of speech is included in the internal coverage identity so unrelated homographs are not equated.
- Ellipses and final display punctuation are removed from functional-phrase keys.
- Duplicate keys form one review group with one or more app lexeme IDs; duplicates are never silently discarded.

Each developer record answers:

- official reference key used for review;
- normalized key;
- part of speech;
- whether the app covers it;
- mapped app lexeme ID or IDs;
- review status;
- a provenance note.

## Category distribution

The batch contains 25 categories with 10 lexemes each: personal identity; family; home; daily life; food; shopping; work; education; travel; public services; health; appointments; media; technology; leisure; holidays; environment; society; feelings; problems; plans; high-frequency verbs; adjectives/adverbs; connectors/prepositions; and functional exam phrases.

## Completion and user state

Built-in content is immutable. Favorite, new/learning/known status, review dates, and answer counters are stored separately in the German lexeme-state namespace.

A vocabulary category is considered complete when either:

1. every lexeme in the category is marked Known; or
2. the learner explicitly completes the category through the existing completion action.

Categories are considered started only after a lexeme has been reviewed, marked Learning/Known, or the category has recorded activity. No completion is inferred from merely opening a screen.

## Limitations and next steps

- The remaining estimated coverage has not been normalized into source control.
- This phase does not bulk-copy the official list.
- Homographs and multiple meanings require continued manual review.
- Later batches should expand coverage while retaining original translations, examples, notes, and exercises.
- Official links and reference wording must be checked again before later content releases.
