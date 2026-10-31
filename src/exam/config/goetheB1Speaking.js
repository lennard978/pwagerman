export const SPEAKING_CONTENT_VERSION = "speaking-v1";
export const SPEAKING_RUBRIC_VERSION = "b1-speaking-v1";
export const GOETHE_B1_SPEAKING_CONFIG = Object.freeze({module:"speaking",level:"B1",preparationSeconds:900,pairDurationSeconds:900,individualDurationSeconds:600,parts:3,contentVersion:SPEAKING_CONTENT_VERSION,rubricVersion:SPEAKING_RUBRIC_VERSION,disclaimer:"Independent preparation tool. Not affiliated with or endorsed by the Goethe-Institut."});
export const SPEAKING_PARTS = Object.freeze([
  Object.freeze({number:1,title:"Plan something together",recommendedSeconds:180}),
  Object.freeze({number:2,title:"Present a topic",recommendedSeconds:240}),
  Object.freeze({number:3,title:"Discuss and answer questions",recommendedSeconds:120}),
]);
export const SPEAKING_RUBRIC = Object.freeze([
  ["taskFulfilment","Task fulfilment"],["interaction","Interaction"],["fluency","Fluency / coherence"],["vocabulary","Vocabulary / register"],["grammar","Grammar / structures"],["pronunciation","Pronunciation / intelligibility"],
].map(([id,label])=>Object.freeze({id,label})));
export const SPEAKING_SCALE=Object.freeze([[3,"Strong"],[2,"Mostly successful"],[1,"Needs improvement"],[0,"Not achieved"]].map(([value,label])=>Object.freeze({value,label})));
export const SPEAKING_SKILL_TAGS=Object.freeze(["suggestion","agreement","disagreement","negotiation","interaction","presentation-structure","personal-experience","advantages-disadvantages","opinion","examples","follow-up","feedback","formal-register","informal-register","fluency","pronunciation"]);
