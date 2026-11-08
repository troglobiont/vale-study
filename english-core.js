(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ValeEnglishCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const DAY=86400000,INTERVALS=[1,3,7,14,30];
const fresh=()=>({schemaVersion:1,records:{},customWords:[],session:null});
function audioURL(raw){
 if(!String(raw||'').trim())return '';
 try{const u=new URL(String(raw).trim());return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}
}
function validWord(w){return w&&typeof w.id==='string'&&/^custom-[\w-]+$/.test(w.id)&&typeof w.en==='string'&&w.en.trim().length>0&&w.en.length<=80&&typeof w.ru==='string'&&w.ru.trim().length>0&&w.ru.length<=160&&typeof w.sr==='string'&&w.sr.length<=160&&audioURL(w.audio)!==null;}
function normalise(input){
 const out=fresh();if(!input||input.schemaVersion!==1)return out;
 if(input.records&&typeof input.records==='object'&&!Array.isArray(input.records)){
  for(const [id,r] of Object.entries(input.records))if(r&&Number.isInteger(r.stage)&&r.stage>=0&&r.stage<=5&&Number.isFinite(r.due)&&r.due>=0&&Number.isInteger(r.reviews)&&r.reviews>0)out.records[id]={stage:r.stage,due:r.due,reviews:r.reviews,last:Number.isFinite(r.last)?r.last:0};
 }
 const seen=new Set();
 if(Array.isArray(input.customWords))out.customWords=input.customWords.filter(w=>validWord(w)&&!seen.has(w.id)&&seen.add(w.id)).slice(0,300).map(w=>({...w,unit:'custom',audio:audioURL(w.audio)}));
 const s=input.session;
 if(s&&Array.isArray(s.ids)&&s.ids.length<=12&&s.ids.every(id=>typeof id==='string')&&new Set(s.ids).size===s.ids.length&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.ids.length)out.session={ids:s.ids,index:s.index,revealed:s.revealed===true,scope:typeof s.scope==='string'?s.scope:'all'};
 return out;
}
function inScope(w,scope){return scope==='all'||String(w.unit)===String(scope);}
function stats(words,state,now=Date.now()){
 const s={total:words.length,new:0,due:0,later:0,learned:0};
 for(const w of words){const r=state.records[w.id];if(!r)s.new++;else {if(r.due<=now)s.due++;else s.later++;if(r.stage>=3)s.learned++;}}
 return s;
}
function queue(words,state,scope='all',now=Date.now(),limit=8){
 const selected=words.filter(w=>inScope(w,scope));
 const due=selected.filter(w=>state.records[w.id]?.due<=now).sort((a,b)=>state.records[a.id].due-state.records[b.id].due);
 const unseen=selected.filter(w=>!state.records[w.id]);
 return [...due,...unseen].slice(0,Math.max(1,Math.min(12,limit))).map(w=>w.id);
}
function schedule(record,rating,now=Date.now()){
 if(!['again','hard','know'].includes(rating)||!Number.isFinite(now)||now<0)throw Error('Invalid review');
 const old=record||{stage:0,reviews:0};
 const stage=rating==='again'?0:rating==='hard'?Math.max(0,old.stage-1):Math.min(5,old.stage+1);
 const delay=rating==='again'?600000:rating==='hard'?DAY:INTERVALS[Math.max(0,stage-1)]*DAY;
 return {stage,due:now+delay,reviews:old.reviews+1,last:now};
}
function rate(state,words,rating,now=Date.now()){
 const s=state.session;if(!s||!s.revealed||s.index>=s.ids.length)return null;
 const id=s.ids[s.index];if(!words.some(w=>w.id===id))return null;
 return {...state,records:{...state.records,[id]:schedule(state.records[id],rating,now)},session:{...s,index:s.index+1,revealed:false}};
}
return {DAY,INTERVALS,fresh,normalise,audioURL,validWord,inScope,stats,queue,schedule,rate};
});
