# German B1 vocabulary coverage analysis

Analysis date: 2026-10-31

This is a developer coverage analysis, not an official coverage certificate. `covered` includes exact and variant-covered normalized reference units. `partially-covered` records an explicit lexical mapping whose production part of speech differs from the normalized reference record and therefore still requires review.

## Exact inventory result

| Metric | Phase 9B result |
| --- | ---: |
| Raw lexical reference records | 3,218 |
| Normalized lexical units | 3,176 |
| Variant groups | 170 |
| Duplicate/merged groups | 42 |
| Production app lexemes | 800 |
| Covered units | 626 |
| Partially covered units | 128 |
| Uncovered units | 2,422 |
| Exact covered percentage | 19.71% |

The percentage is computed as `626 / 3176 × 100`. Partial mappings are reported separately and are not counted as fully covered. The official prose's approximate 2,400 figure is contextual only; all Phase 9B status counts use the exact normalized inventory.

## Reference breakdown by inferred part of speech

| Reference POS | Covered | Variant-covered | Partial | Uncovered | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Noun | 432 | 9 | 16 | 1,254 | 1,711 |
| Verb | 184 | 1 | 14 | 456 | 655 |
| Phrase | 0 | 0 | 3 | 35 | 38 |
| Other/unclassified | 0 | 0 | 95 | 677 | 772 |
| **Total** | **616** | **10** | **128** | **2,422** | **3,176** |

The conservative inference leaves many adjectives, adverbs, abbreviations, and thematic-list items as `other`; it does not invent unsupported source POS metadata.

## Production category distribution

| Category | Lexemes | Category | Lexemes |
| --- | ---: | --- | ---: |
| personal-identity | 20 | family-relationships | 25 |
| home-living | 35 | daily-life | 35 |
| food-eating-out | 35 | shopping-money | 30 |
| work-profession | 45 | school-education | 35 |
| travel-transport | 45 | city-services | 40 |
| health-body | 45 | appointments-services | 30 |
| media-communication | 40 | technology-internet | 25 |
| leisure-sport | 30 | holidays-accommodation | 30 |
| environment-weather | 30 | society-community | 30 |
| feelings-opinions | 30 | problems-solutions | 30 |
| plans-goals-time | 25 | high-frequency-verbs | 30 |
| adjectives-adverbs | 30 | connectors-prepositions | 25 |
| functional-exam-phrases | 25 | **Total** | **800** |

## Production part-of-speech distribution

| POS | Count |
| --- | ---: |
| Noun | 473 |
| Verb | 210 |
| Adjective | 52 |
| Adverb | 14 |
| Connector | 20 |
| Preposition | 6 |
| Phrase | 25 |

## State and scale behavior

Built-in content stays immutable. New status is derived until a learner mutates a word; only favorites, known/learning changes, answers, and review dates create persisted state rows. Category metrics derive from actual category sizes. Practice rounds remain bounded at Pair 10, Spelling 10, Cards 12, Quiz 10, Test 10, and Review 20. The vocabulary library renders 30 matching cards at a time and exposes more on demand.

## Artifacts and limitations

- `GERMAN-B1-WORTLISTE-INVENTORY.json` contains raw and normalized lexical records, variants, regions, status, and lexeme mappings. It excludes official examples and prose.
- `GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json` contains at least five Phase 9B entries per category plus mechanically detected unusual entries, with learner content and reference mapping.
- Machine extraction cannot replace expert linguistic review of every homograph, sense, plural, and regional nuance.
- The 128 partial mappings remain visible rather than being promoted to full coverage.
- No normalized record is excluded in Phase 9B; unsupported exclusions were not invented.
- Future batches should expand the uncovered inventory while retaining original learner-facing content and the same validation boundary.
