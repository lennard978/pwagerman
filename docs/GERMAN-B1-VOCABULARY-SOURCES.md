# German B1 vocabulary sources and provenance

Last reviewed: 2026-10-31

## Official reference boundary

The [Goethe-Zertifikat B1 Wortliste](https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf) is used only as a coverage and level reference. Its introduction describes the B1 vocabulary base as approximately 2,400 lexical units and explains that the list is intended as information about the expected level.

This repository does not reproduce the PDF, its formatting, annotations, example sentences, or a bulk transcription of its entries. Developer coverage records contain only normalized reference keys needed to map independently authored app lexemes.

The official preparation page is also recorded in [GERMAN-B1-SOURCES.md](./GERMAN-B1-SOURCES.md).

## App-authored content

All English meanings, German example sentences, English example translations, categories, notes, exercises, and UI presentation are original-curated content for this application. Production lexemes use `sourceType: "original-curated"`.

Allowed product wording:

> Vocabulary coverage aligned with the Goethe-Zertifikat B1 Wortliste.

Required disclaimer:

> Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut.

The app must not be described as an official Goethe vocabulary product.

## Review method

1. Select a high-frequency, exam-relevant lexical item from practical B1 domains.
2. Confirm its lemma and useful learner form against reputable German usage and the official coverage reference.
3. Write an original learner-friendly English gloss.
4. Write an original A2/B1-accessible German example and accurate English translation.
5. Add noun or verb metadata needed for learning.
6. Run machine validation for IDs, categories, metadata, examples, duplicates, and encoding.
7. Record a normalized coverage key without copying official example material.

## Current production batch

- Production lexemes: 250
- Categories: 25
- Lexemes per category: 10
- Original examples with English translations: 250
- Nouns with article, gender, and plural metadata: 124
- Verbs with supported B1 form metadata: 73
- Adjectives, adverbs, connectors, prepositions, and functional phrases: 53
- Source type: 100% `original-curated`

This is a first production batch, not complete B1 lexical coverage.
