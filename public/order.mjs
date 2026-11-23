import {QUESTIONS,HARD_QUESTIONS,ALL_QUESTIONS,HARD_START} from './questions.mjs';
export const GAME_VERSION='order-v3';
export const TITLES=Object.fromEntries(ALL_QUESTIONS.map(q=>[q.id,q.title]));
export const facts=ALL_QUESTIONS;
export {HARD_QUESTIONS,HARD_START};
export const day=()=>new Date().toISOString().slice(0,10);
export function random(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>{h+=0x6d2b79f5;let t=Math.imul(h^h>>>15,h|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
export function shuffle(array,r){const a=[...array];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let hardDeals;
function hardDeal(r){
 if(!hardDeals){
  hardDeals=[];const medium=HARD_QUESTIONS.filter(f=>f.difficulty==='medium'),surprise=HARD_QUESTIONS.filter(f=>f.difficulty==='surprise'),reasoning=HARD_QUESTIONS.filter(f=>f.difficulty==='reasoning');
  for(const a of reasoning)for(let i=0;i<medium.length;i++)for(let j=i+1;j<medium.length;j++)for(let k=0;k<surprise.length;k++)for(let l=k+1;l<surprise.length;l++){
   const cards=[a,medium[i],medium[j],surprise[k],surprise[l]],values=cards.map(f=>f.answer).sort((a,b)=>a-b);
   if(new Set(values).size!==5||new Set(cards.map(f=>f.family)).size!==5||new Set(cards.map(f=>f.topic)).size<3||cards.some(f=>cards.filter(x=>x.topic===f.topic).length>2)||values[4]/values[0]>4)continue;
   if(values.slice(1).filter((v,i)=>v/values[i]<=1.3).length<2)continue;
   hardDeals.push(cards);
  }
  if(!hardDeals.length)throw Error('No balanced challenging puzzles');
 }
 return [...hardDeals[Math.floor(r()*hardDeals.length)]];
}
export function create(mode='daily',seed=day()){
 const r=random(GAME_VERSION+':'+(mode==='practice'?'practice:':'')+seed),hard=mode==='practice'||seed>=HARD_START,chosen=hard?hardDeal(r):[];
 for(const difficulty of hard?[]:['surprise','medium','anchor','anchor','anchor']){
  const options=shuffle(QUESTIONS.filter(f=>f.difficulty===difficulty),r);
  const f=options.find(f=>!chosen.some(x=>x.id===f.id||x.answer===f.answer||x.family===f.family)&&chosen.filter(x=>x.topic===f.topic).length<2&&!(f.answer<=10&&chosen.some(x=>x.answer<=10)));
  if(!f)throw Error('Could not build a balanced puzzle');chosen.push(f);
 }
 const ids=shuffle(chosen.map(f=>f.id),r),order=shuffle(ids,r);
 if(order.every((id,i)=>id===[...ids].sort((a,b)=>facts.find(f=>f.id===b).answer-facts.find(f=>f.id===a).answer)[i]))[order[0],order[1]]=[order[1],order[0]];
 return {version:4,mode,seed,ids,order,locked:[],attempts:[],done:false,won:false};
}
export const fact=id=>facts.find(f=>f.id===id);
export const solution=run=>[...run.ids].sort((a,b)=>fact(b).answer-fact(a).answer);
export function move(run,from,to){if(run.done||from===to||from<0||to<0||from>4||to>4||run.locked.includes(from)||run.locked.includes(to))return false;const slots=[0,1,2,3,4].filter(i=>!run.locked.includes(i)),values=slots.map(i=>run.order[i]),a=slots.indexOf(from),b=slots.indexOf(to);const [value]=values.splice(a,1);values.splice(b,0,value);slots.forEach((slot,i)=>run.order[slot]=values[i]);return true}
export function check(run){if(run.done)return;const truth=solution(run),matches=run.order.map((id,i)=>id===truth[i]);run.attempts.push({order:[...run.order],matches});run.locked=matches.flatMap((v,i)=>v?[i]:[]);run.won=run.locked.length===5;run.done=run.won||run.attempts.length===3;return matches}
export function restore(raw){if(!raw||raw.version!==4||!['daily','practice'].includes(raw.mode)||typeof raw.seed!=='string'||raw.seed.length>64||!Array.isArray(raw.attempts)||raw.attempts.length>3)throw Error('Invalid game');const run=create(raw.mode,raw.seed);for(const a of raw.attempts){if(!Array.isArray(a.order)||a.order.length!==5||new Set(a.order).size!==5||a.order.some(id=>!run.ids.includes(id))||run.done)throw Error('Invalid attempt');for(const i of run.locked)if(a.order[i]!==run.order[i])throw Error('Moved a locked card');run.order=[...a.order];check(run)}if(!Array.isArray(raw.order)||raw.order.length!==5||new Set(raw.order).size!==5||raw.order.some(id=>!run.ids.includes(id)))throw Error('Invalid order');for(const i of run.locked)if(raw.order[i]!==run.order[i])throw Error('Moved a locked card');if(run.done&&raw.order.some((id,i)=>id!==run.order[i]))throw Error('Changed final order');run.order=[...raw.order];return run}
export function share(run,url){return `Out of Order · ${run.mode==='daily'?run.seed:'challenge'}\n${run.attempts.map(a=>a.matches.map(v=>v?'🟩':'⬛').join('')).join('\n')}\n${run.won?`Solved in ${run.attempts.length}/3`:'Not this time'}\n${url}`}
