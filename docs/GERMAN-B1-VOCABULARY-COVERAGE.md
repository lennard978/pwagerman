# German B1 vocabulary coverage analysis

Analysis date: 2026-11-01

This is a developer coverage analysis, not an official coverage certificate or a claim of complete expert linguistic review. `Fully covered` combines exact and variant-covered normalized reference units. `Partially covered` records an explicit lexical mapping whose production part of speech differs from the conservative reference classification and therefore remains visible for later review.

## Exact Phase 10 inventory result

| Metric | Phase 10 result |
| --- | ---: |
| Raw lexical reference records | 3,218 |
| Normalized lexical units | 3,176 |
| Variant groups | 170 |
| Duplicate/merged groups | 42 |
| Production app lexemes | 1,400 |
| Exact covered units | 982 |
| Variant-covered units | 10 |
| Fully covered units | 992 |
| Partially covered units | 315 |
| Uncovered units | 1,869 |
| Full coverage percentage | 31.23% |

The percentage is computed as `992 / 3176 × 100`. Partial mappings are reported separately and are not counted as fully covered. The official prose's approximate 2,400 figure is contextual only; all Phase 10 status counts use the exact normalized inventory.

## Reference breakdown by inferred part of speech

| Reference POS | Exact | Variant | Partial | Uncovered | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Noun | 617 | 9 | 25 | 1,060 | 1,711 |
| Verb | 364 | 1 | 17 | 273 | 655 |
| Phrase | 1 | 0 | 4 | 33 | 38 |
| Other/unclassified | 0 | 0 | 269 | 503 | 772 |
| **Total** | **982** | **10** | **315** | **1,869** | **3,176** |

The conservative inference leaves many adjectives, adverbs, abbreviations, and thematic-list items as `other`; it does not invent unsupported source POS metadata.

## Production category distribution

| Category | Lexemes | Category | Lexemes |
| --- | ---: | --- | ---: |
| personal-identity | 25 | family-relationships | 31 |
| home-living | 46 | daily-life | 43 |
| food-eating-out | 45 | shopping-money | 38 |
| work-profession | 90 | school-education | 75 |
| travel-transport | 88 | city-services | 65 |
| health-body | 82 | appointments-services | 52 |
| media-communication | 67 | technology-internet | 44 |
| leisure-sport | 51 | holidays-accommodation | 36 |
| environment-weather | 48 | society-community | 48 |
| feelings-opinions | 67 | problems-solutions | 67 |
| plans-goals-time | 55 | high-frequency-verbs | 30 |
| adjectives-adverbs | 55 | connectors-prepositions | 67 |
| functional-exam-phrases | 85 | **Total** | **1,400** |

## Production part-of-speech distribution

| POS | Before Phase 10 | Added | Final |
| --- | ---: | ---: | ---: |
| Noun | 473 | 185 | 658 |
| Verb | 210 | 180 | 390 |
| Adjective | 52 | 90 | 142 |
| Adverb | 14 | 45 | 59 |
| Connector | 20 | 25 | 45 |
| Preposition | 6 | 15 | 21 |
| Functional phrase | 25 | 60 | 85 |
| **Total** | **800** | **600** | **1,400** |

## State, search, and practice scale

Built-in content remains immutable. New learner status is derived until a learner mutates a word; only favorites, known/learning changes, answers, and review dates create persisted state rows. Category metrics derive from actual category sizes. The vocabulary library renders 30 matching cards at a time and exposes more on demand.

Practice rounds remain bounded at Pair 10, Spelling 10, Cards 12, Quiz 10, Vocabulary Test 10, and Review 20. The expansion does not create 1,400 persistence records at startup and does not enlarge a single practice session.

## Phase 10 curation and validation

- Added 600 learner-facing entries selected for B1 usefulness rather than exhausting the reference inventory.
- Strengthened verbs, adjectives, adverbs, connectors, prepositions, and functional Writing/Speaking phrases while retaining useful noun growth.
- Every new item has an original German example, English translation, stable ID, category, grammar reference, and explicit reference mapping.
- Nouns retain article-first display, gender, and plural state; mechanically ambiguous plurals were curated explicitly.
- Verbs retain auxiliary, Partizip II, Präteritum, separability, reflexive status, case government, and governed prepositions where applicable.
- Regional Wortliste evidence remains in the inventory; learner notes identify supported Austria/Switzerland/Germany variants without replacing the broadly standard-German default.
- The generation pipeline is deterministic and idempotent; the focused inventory test verifies schema, counts, mappings, Unicode, examples, and metadata.

## Artifacts and limitations

- `GERMAN-B1-WORTLISTE-INVENTORY.json` contains raw and normalized lexical records, variants, regions, status, and lexeme mappings. It excludes official examples and prose.
- `GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json` contains a 68-entry representative Phase 10 sample across every production part of speech, plus structurally unusual verbs and regional entries.
- Machine extraction cannot replace expert linguistic review of every homograph, sense, plural, and regional nuance.
- The 315 partial mappings remain visible rather than being promoted to full coverage.
- No normalized record is excluded. Future batches should prioritize the remaining 1,869 uncovered units while preserving the same quality and validation boundary.
