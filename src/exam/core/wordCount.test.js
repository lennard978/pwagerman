import { countWritingParagraphs, countWritingWords, getWordTargetGuidance, getWritingWords } from "./wordCount";

describe("documented German Writing word count", () => {
  test.each([
    ["Hallo Welt", 2, "normal words"],
    ["Hallo, Welt! Wie geht es?", 5, "punctuation"],
    ["eins   zwei\t drei", 3, "multiple spaces"],
    ["Erster Absatz.\n\nZweiter Absatz.", 4, "paragraphs"],
    ["Donaudampfschifffahrtsgesellschaft", 1, "German compound"],
    ["E-Mail Online-Kurs", 2, "hyphenated forms"],
    ["Wie geht's? D’Artagnan", 3, "apostrophes"],
    ["Grüße aus Köln. Straße und Fußgänger.", 6, "umlauts and ß"],
    ["", 0, "empty content"],
    ["  Kopierter\nText mit   Abständen.  ", 4, "pasted content"],
  ])("counts %s as %s words (%s)", (text, expected) => expect(countWritingWords(text)).toBe(expected));

  test("returns stable tokens and paragraph counts", () => {
    expect(getWritingWords("E-Mail geht's")).toEqual(["E-Mail", "geht's"]);
    expect(countWritingParagraphs("Eins.\n\nZwei.\nDrei.")).toBe(2);
    expect(countWritingParagraphs("  ")).toBe(0);
  });

  test("provides gentle target guidance rather than an error", () => {
    expect(getWordTargetGuidance(74, 80)).toMatch(/close/i);
    expect(getWordTargetGuidance(20, 80)).toMatch(/more detail/i);
    expect(getWordTargetGuidance(120, 80)).toMatch(/every sentence/i);
  });
});
