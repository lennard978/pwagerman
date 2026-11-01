# German B1 vocabulary coverage analysis

Analysis date: 2026-11-01

This is a developer coverage analysis, not an official coverage certificate or a claim of complete expert linguistic review. `Fully covered` combines exact and variant-covered normalized reference units. `Partially covered` records an explicit lexical mapping whose production part of speech differs from the conservative reference classification and therefore remains visible for later review.

## Current Phase 10.3 result

Phase 10.3 reviewed every one of the 1,764 records that was partially covered or uncovered at the verified 1,950-word checkpoint. Official Goethe/ÖSD examples and prose are not reproduced.

| Metric | Starting checkpoint | Phase 10.3 result |
| --- | ---: | ---: |
| Raw lexical reference records | 3,218 | 3,218 |
| Normalized lexical units | 3,176 | 3,176 |
| Production app lexemes | 1,950 | 2,367 |
| Exact covered units | 1,402 | 2,186 |
| Variant-covered units | 10 | 10 |
| Fully covered units | 1,412 | 2,196 |
| Partially covered units | 409 | 0 |
| Uncovered units requiring a decision | 1,355 | 0 |
| Excluded with an explicit reason | 0 | 980 |
| Full coverage percentage | 44.46% | 69.14% |

The percentage is `2196 / 3176 × 100`. Exclusions never inflate full coverage. The normalized inventory is not a learner-card target because it contains regional metadata, inflected forms, abbreviations, cross-references, duplicate references, and extraction artifacts.

Phase 10.3 added 417 original learner cards: 247 nouns, 100 verbs, 40 adjectives, 15 adverbs, 1 connector, 4 prepositions, and 10 functional phrases. It classified the 409 uncovered `other` records, reclassified another 363 `other` records inside the partial set, and resolved all 409 partial mappings without leaving a high-value or human-review decision unresolved.

Final production POS: 1,155 nouns; 660 verbs; 242 adjectives; 99 adverbs; 56 connectors; 30 prepositions; and 125 functional phrases.

Explicit exclusions: 703 `LOW_VALUE_SPECIALIST`, 112 `REGIONAL_METADATA_ONLY`, 47 `INFLECTION_ONLY`, 41 `NOT_STANDALONE_LEXEME`, 38 `EXTRACTION_ARTIFACT`, 22 `DUPLICATE_REFERENCE`, 9 `PROPER_NAME`, and 8 `ABBREVIATION`.

The complete per-record trail is in `GERMAN-B1-WORTLISTE-GAP-ANALYSIS.json`. The inventory retains classification, normalization confidence, regional evidence, final decision, exclusion reason, and production mappings. The audit sample contains every new Phase 10.3 verb, representative new nouns/descriptors, all new function words and phrases, structurally unusual entries, and the remaining-verb decisions.

Built-in content remains immutable until a learner changes a status. Search and filters operate across all 2,367 records, while rendering remains incremental. Practice stays bounded at Pair 10, Spelling 10, Cards 12, Quiz 10, Vocabulary Test 10, Review 20, and Learning 10.

## Archived pre-Phase-10.3 checkpoint

The remainder of this document preserves the exact starting checkpoint used by the deterministic Phase 10.3 audit.

### Exact Phase 10.2 inventory result

| Metric | Phase 10.2 result |
| --- | ---: |
| Raw lexical reference records | 3,218 |
| Normalized lexical units | 3,176 |
| Variant groups | 170 |
| Duplicate/merged groups | 42 |
| Production app lexemes | 1,950 |
| Exact covered units | 1,402 |
| Variant-covered units | 10 |
| Fully covered units | 1,412 |
| Partially covered units | 409 |
| Uncovered units | 1,355 |
| Full coverage percentage | 44.46% |

The percentage is computed as `1412 / 3176 × 100`. Partial mappings are reported separately and are not counted as fully covered. The official prose's approximate 2,400 figure is contextual only; all Phase 10.2 status counts use the exact normalized inventory.

### Reference breakdown by inferred part of speech

| Reference POS | Exact | Variant | Partial | Uncovered | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Noun | 867 | 9 | 25 | 810 | 1,711 |
| Verb | 534 | 1 | 17 | 103 | 655 |
| Phrase | 1 | 0 | 4 | 33 | 38 |
| Other/unclassified | 0 | 0 | 363 | 409 | 772 |
| **Total** | **1,402** | **10** | **409** | **1,355** | **3,176** |

The conservative inference leaves many adjectives, adverbs, abbreviations, and thematic-list items as `other`; it does not invent unsupported source POS metadata.

### Production category distribution

| Category | Lexemes | Category | Lexemes |
| --- | ---: | --- | ---: |
| personal-identity | 36 | family-relationships | 42 |
| home-living | 72 | daily-life | 62 |
| food-eating-out | 52 | shopping-money | 75 |
| work-profession | 137 | school-education | 105 |
| travel-transport | 118 | city-services | 79 |
| health-body | 105 | appointments-services | 63 |
| media-communication | 120 | technology-internet | 54 |
| leisure-sport | 64 | holidays-accommodation | 39 |
| environment-weather | 64 | society-community | 73 |
| feelings-opinions | 102 | problems-solutions | 91 |
| plans-goals-time | 91 | high-frequency-verbs | 30 |
| adjectives-adverbs | 76 | connectors-prepositions | 85 |
| functional-exam-phrases | 115 | **Total** | **1,950** |

### Production part-of-speech distribution

| POS | Before Phase 10 | Phase 10 | Phase 10.2 | Final |
| --- | ---: | ---: | ---: | ---: |
| Noun | 473 | 185 | 250 | 908 |
| Verb | 210 | 180 | 170 | 560 |
| Adjective | 52 | 90 | 60 | 202 |
| Adverb | 14 | 45 | 25 | 84 |
| Connector | 20 | 25 | 10 | 55 |
| Preposition | 6 | 15 | 5 | 26 |
| Functional phrase | 25 | 60 | 30 | 115 |
| **Total** | **800** | **600** | **550** | **1,950** |

### State, search, and practice scale

Built-in content remains immutable. New learner status is derived until a learner mutates a word; only favorites, known/learning changes, answers, and review dates create persisted state rows. Category metrics derive from actual category sizes. The vocabulary library renders 30 matching cards at a time and exposes more on demand.

Practice rounds remain bounded at Pair 10, Spelling 10, Cards 12, Quiz 10, Vocabulary Test 10, and Review 20. The expansion does not create 1,950 persistence records at startup and does not enlarge a single practice session.

### Phase 10.2 curation and validation

- Added 550 learner-facing entries in Phase 10.2, bringing the cumulative Phase 10 batch to 1,150 and production vocabulary to 1,950.
- Strengthened verbs, adjectives, adverbs, connectors, prepositions, and functional Writing/Speaking phrases while retaining useful noun growth.
- Every new item has an original German example, English translation, stable ID, category, grammar reference, and explicit reference mapping.
- Nouns retain article-first display, gender, and plural state; mechanically ambiguous plurals were curated explicitly.
- Verbs retain auxiliary, Partizip II, Präteritum, separability, reflexive status, case government, and governed prepositions where applicable.
- Regional Wortliste evidence remains in the inventory; learner notes identify supported Austria/Switzerland/Germany variants without replacing the broadly standard-German default.
- The generation pipeline is deterministic and idempotent; the focused inventory test verifies schema, counts, mappings, Unicode, examples, and metadata.

### Artifacts and limitations

- `GERMAN-B1-WORTLISTE-INVENTORY.json` contains raw and normalized lexical records, variants, regions, status, and lexeme mappings. It excludes official examples and prose.
- `GERMAN-B1-VOCABULARY-AUDIT-SAMPLE.json` contains a 141-entry deterministic Phase 10.2 sample across every production part of speech, plus structurally unusual verbs and regional entries.
- Machine extraction cannot replace expert linguistic review of every homograph, sense, plural, and regional nuance.
- The 409 partial mappings remain visible rather than being promoted to full coverage.
- No normalized record is excluded. Future batches should prioritize the remaining 1,355 uncovered units while preserving the same quality and validation boundary.
