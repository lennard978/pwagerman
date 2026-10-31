# German B1 grammar curriculum

## Positioning

This is an independent German B1 grammar curriculum aligned with CEFR B1 communication needs and Goethe-Zertifikat B1 exam preparation. It is **not an official Goethe grammar syllabus**. The Goethe-Institut describes skills and four exam modules; it does not publish this 24-lesson sequence.

The curriculum uses two learner-facing bands:

- **Foundation Review** reinforces high-value A2 structures without treating them as remedial work.
- **B1 Core** develops the structures needed for connected reading, listening, writing, and speaking.

Each lesson is immutable, original-curated content. Learner state, attempts, mastery, and mistakes are stored separately. Every lesson has three rule blocks, six original German examples with English translations and German TTS, two common-mistake patterns, eight typed exercises, prerequisites, and exam-skill tags.

## Curriculum inventory

| # | Stable lesson ID | Band | Focus | Exam skills |
|---:|---|---|---|---|
| 1 | `de-b1-word-order-foundation` | Foundation Review | Word order, questions, negation, sentence bracket | Reading, Listening, Writing, Speaking |
| 2 | `de-b1-case-articles` | Foundation Review | Nominative, accusative, dative articles | Reading, Listening, Writing, Speaking |
| 3 | `de-b1-pronouns` | Foundation Review | Personal, possessive, reflexive, object pronouns | Reading, Listening, Writing, Speaking |
| 4 | `de-b1-modal-verbs` | Foundation Review | Modal verbs and sentence bracket | Listening, Writing, Speaking |
| 5 | `de-b1-separable-reflexive-verbs` | Foundation Review | Separable and reflexive verbs | Reading, Listening, Writing, Speaking |
| 6 | `de-b1-perfekt` | Foundation Review | Conversational past narration | Reading, Listening, Writing, Speaking |
| 7 | `de-b1-preterite-common-verbs` | Foundation Review | `sein`, `haben`, and high-frequency modal forms | Reading, Listening, Writing, Speaking |
| 8 | `de-b1-two-way-local-temporal-prepositions` | Foundation Review | Location, direction, and time | Reading, Listening, Writing, Speaking |
| 9 | `de-b1-adjective-endings` | Foundation Review | Practical adjective agreement | Reading, Writing, Speaking |
| 10 | `de-b1-comparative-superlative` | Foundation Review | Comparison, `als`, and `wie` | Reading, Listening, Writing, Speaking |
| 11 | `de-b1-subordinate-clauses` | B1 Core | `weil`, `dass`, `wenn`, `obwohl` | Reading, Listening, Writing, Speaking |
| 12 | `de-b1-main-clause-connectors` | B1 Core | `deshalb`, `trotzdem`, `sonst`, and related connectors | Reading, Listening, Writing, Speaking |
| 13 | `de-b1-temporal-clauses` | B1 Core | `als`, `wenn`, `bevor`, `nachdem`, and related clauses | Reading, Listening, Writing, Speaking |
| 14 | `de-b1-relative-clauses` | B1 Core | Nominative, accusative, dative, and prepositional relatives | Reading, Writing, Speaking |
| 15 | `de-b1-indirect-questions` | B1 Core | `ob` and W-word indirect questions | Listening, Writing, Speaking |
| 16 | `de-b1-infinitive-zu` | B1 Core | Infinitive clauses with `zu` | Reading, Writing, Speaking |
| 17 | `de-b1-purpose-um-zu-damit` | B1 Core | Purpose with shared and different subjects | Reading, Writing, Speaking |
| 18 | `de-b1-passive-voice` | B1 Core | Present and past passive | Reading, Listening, Writing |
| 19 | `de-b1-konjunktiv-ii` | B1 Core | Politeness, wishes, advice, hypotheticals | Writing, Speaking |
| 20 | `de-b1-prepositional-verbs` | B1 Core | Fixed prepositions and da-/wo-compounds | Reading, Listening, Writing, Speaking |
| 21 | `de-b1-genitive-basics` | B1 Core | Common written genitive structures | Reading, Writing |
| 22 | `de-b1-future-meaning` | B1 Core | Present-for-future and Futur I | Listening, Writing, Speaking |
| 23 | `de-b1-cohesive-connectors` | B1 Core | Cause, concession, result, and balanced contrast | Reading, Writing, Speaking |
| 24 | `de-b1-noun-verb-writing` | B1 Core | Noun-verb combinations and cohesive writing | Writing, Speaking |

## Content totals and contract

- 24 lessons: 10 Foundation Review and 14 B1 Core
- 72 rule blocks
- 144 translated examples
- 48 common-mistake patterns
- 192 exercises
- 20 diagnostic questions, exactly two for each Foundation Review lesson
- All lesson and exercise IDs are unique and validated
- Every prerequisite and vocabulary `grammarRefs` value resolves to a production lesson

## Prerequisite strategy

Foundation Review lessons can be opened in any order. B1 Core prerequisites express useful sequencing, not locks. For example, subordinate clauses build on basic word order; relative clauses build on cases and subordinate-clause order; purpose clauses build on `zu`-infinitives and subordinate clauses. Learners remain in control of navigation and completion.

The optional diagnostic samples every Foundation Review lesson. A two-out-of-two result is labelled **Strong**; any other result is **Review recommended**. It is not a placement test, does not certify a CEFR level, and never skips or completes a lesson automatically. “Mark reviewed” is always an explicit learner action.

## Exercise engine

Every lesson uses the same typed engine:

1. multiple choice
2. fill blank
3. sentence ordering
4. transformation
5. error correction
6. matching
7. connector choice
8. case/article choice

Choice, ordering, and matching answers use stable IDs. Text answers use Unicode-preserving normalization: canonical Unicode composition, trimmed/collapsed whitespace, and terminal punctuation tolerance. Meaningful differences remain distinct, including `das`/`dass`, `wurde`/`würde`, umlauts, and `ß`.

## Progress and review

Static lesson content never contains learner state. Persistent grammar state records status, timestamps, correct/incorrect counters, and mastery. Grammar mistakes retain prompt, learner answer, correct answer, explanation, creation time, and resolution time. Resolved mistakes are retained for auditability and excluded from the active review queue.

Grammar Review has clearly separated sources: unresolved grammar mistakes, incomplete lessons, low-mastery lessons, and completed lessons. Vocabulary review remains independent.

## Limitations

- Lesson mastery is practice feedback, not Goethe scoring or an exam-readiness claim.
- The diagnostic is a lightweight study guide, not an official placement test.
- The curriculum does not reproduce Goethe or textbook questions.
- This phase does not add Goethe Reading or Listening modules, free-writing scoring, microphone speaking assessment, AI scoring, or a full mock B1 exam.
