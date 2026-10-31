import { STORAGE_CONFIG } from "../../config/course";
const key=mode=>mode.startsWith("practice")?STORAGE_CONFIG.speakingPracticeSession:STORAGE_CONFIG.speakingSession;
export const saveSpeakingSession=(s,storage=window.localStorage)=>{try{storage.setItem(key(s.mode),JSON.stringify(s));return true;}catch(e){return false;}};
export const loadSpeakingSession=(storage=window.localStorage,mode="solo-simulation")=>{try{const s=JSON.parse(storage.getItem(key(mode))||"null");return s?.module==="speaking"&&(mode.startsWith("practice")?s.mode.startsWith("practice"):s.mode===mode)?s:null;}catch(e){return null;}};
export const clearSpeakingSession=(storage=window.localStorage,mode="solo-simulation")=>{try{storage.removeItem(key(mode));return true;}catch(e){return false;}};
