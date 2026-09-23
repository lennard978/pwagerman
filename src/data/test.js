const createQuestion = (prompt, options, answer) => ({
  prompt,
  options,
  answer,
});

export const Test1 = [
  createQuestion('"house" in Serbian is:', ["kuća", "voda", "stolica"], "kuća"),
  createQuestion('"thank you" in Serbian is:', ["hvala", "zdravo", "molim"], "hvala"),
  createQuestion('"good morning" in Serbian is:', ["dobro jutro", "laku noć", "doviđenja"], "dobro jutro"),
  createQuestion('"my name is..." in Serbian is:', ["zovem se...", "kako si?", "dobro sam"], "zovem se..."),
];

export const Test2 = [
  createQuestion('"mother" in Serbian is:', ["majka", "sestra", "ćerka"], "majka"),
  createQuestion('"friend" in Serbian is:', ["prijatelj", "roditelj", "čovek"], "prijatelj"),
  createQuestion('"water" in Serbian is:', ["voda", "kafa", "hleb"], "voda"),
];

export const Test3 = [
  createQuestion('"ticket" in Serbian is:', ["karta", "mapa", "stanica"], "karta"),
  createQuestion('"Monday" in Serbian is:', ["ponedeljak", "sreda", "petak"], "ponedeljak"),
  createQuestion('"where is the hotel?" in Serbian is:', ["gde je hotel?", "dobrodošli", "vidimo se"], "gde je hotel?"),
];
