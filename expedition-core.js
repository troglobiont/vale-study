(function(root,factory){
 const api=factory(typeof module==='object'&&module.exports?require('./nature-core.js'):root.ValeNatureCore);
 if(typeof module==='object'&&module.exports)module.exports=api;else root.ValeExpeditionCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(N){
'use strict';
const TASK='p16-6',NOTE='p15-3';
const SCENES=['letter','map','answer','explanation','note','design','atlas'];
const COLORS=['#2167cf','#75b8fa','#557e65','#cf6f59','#d7ad52','#17364b'];
const FRAMES=['plain','waves','stamps'],PATTERNS=['plain','waves','custom'];
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const integer=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
const text=(v,max)=>typeof v==='string'?v.slice(0,max):'';
const postcard=()=>({title:'',paper:0,frame:'plain',pattern:'waves',pixels:Array(36).fill(-1)});
const fresh=()=>({schemaVersion:1,scene:'letter',help:0,first:null,explanationSeen:false,awarded:false,finishedAt:null,bird:true,birdName:'',motion:true,cover:0,postcard:postcard(),shelf:[]});
function designValue(input){
 const d=postcard();if(!object(input))return d;
 d.title=text(input.title,80);if(integer(input.paper,0,2))d.paper=input.paper;
 if(FRAMES.includes(input.frame))d.frame=input.frame;
 if(PATTERNS.includes(input.pattern))d.pattern=input.pattern;
 if(Array.isArray(input.pixels)&&input.pixels.length===36&&input.pixels.every(p=>integer(p,-1,COLORS.length-1)))d.pixels=[...input.pixels];
 return d;
}
function normalise(input){
 const s=fresh();if(!object(input)||input.schemaVersion!==1)return s;
 if(SCENES.includes(input.scene))s.scene=input.scene;
 if(integer(input.help,0,2))s.help=input.help;
 if(object(input.first)&&typeof input.first.correct==='boolean'&&typeof input.first.assisted==='boolean')s.first={correct:input.first.correct,assisted:input.first.assisted};
 s.explanationSeen=input.explanationSeen===true||s.help===2;
 s.awarded=input.awarded===true;
 s.finishedAt=s.awarded&&Number.isFinite(input.finishedAt)&&input.finishedAt>=0?input.finishedAt:null;
 s.bird=input.bird!==false;s.motion=input.motion!==false;s.birdName=text(input.birdName,30);
 if(integer(input.cover,0,2))s.cover=input.cover;
 s.postcard=designValue(input.postcard);
 if(s.awarded&&Array.isArray(input.shelf))for(const p of input.shelf){
  if(object(p)&&['boat','postcard'].includes(p.id)&&integer(p.slot,0,2)&&!s.shelf.some(x=>x.id===p.id||x.slot===p.slot))s.shelf.push({id:p.id,slot:p.slot});
 }
 return s;
}
const task=(data,id=TASK)=>Array.isArray(data?.tasks)?data.tasks.find(q=>q.id===id):undefined;
function status(exp,nature,data){
 const s=normalise(exp),q=task(data),r=nature?.records?.[TASK];
 const result=q&&r?.checked?.valid&&r.checked.correct?N.check(q,r.draft):null;
 const solved=!!(result?.valid&&result.correct);
 const legacy=solved&&!s.first;
 const assisted=s.help>0||s.first?.assisted===true;
 const corrected=solved&&(s.first?.correct===false||r?.first?.correct===false);
 const canFinish=s.explanationSeen&&(solved||s.help===2||s.awarded);
 return {solved,legacy,assisted,corrected,canFinish};
}
function move(exp,scene,nature,data){
 const s=normalise(exp);if(!SCENES.includes(scene))return s;
 const p=status(s,nature,data);
 if(scene==='explanation'&&!p.solved&&s.help!==2&&!s.awarded)return {...s,scene:'answer'};
 if(['note','design'].includes(scene)&&!p.canFinish)return {...s,scene:p.solved||s.help===2?'explanation':'answer'};
 return {...s,scene};
}
function set(exp,key,value){
 const s=normalise(exp);
 if(['bird','motion'].includes(key)&&typeof value==='boolean')return {...s,[key]:value};
 if(key==='birdName'&&typeof value==='string')return {...s,birdName:text(value,30)};
 if(key==='cover'&&integer(value,0,2))return {...s,cover:value};
 return s;
}
function hint(exp,level){
 const s=normalise(exp);if(!integer(level,1,2))return s;
 const help=Math.max(s.help,level);
 return {...s,help,...(level===2?{explanationSeen:true,scene:'explanation'}:{})};
}
function answer(exp,nature,data,value,now=Date.now()){
 const s=normalise(exp),q=task(data),source=nature||N.fresh();
 if(!q)return {expedition:s,nature:source,result:{valid:false,missing:['f0']}};
 const field=q.fields[0]?.id||'f0',v=text(value,300),old=source.records?.[q.id];
 const wasSolved=status(s,source,data).solved;
 const next=old?.draft?.[field]===v?source:N.draft(source,q,field,v,now);
 const checked=N.submit(next,q,now),result=checked.result;
 // An unchanged already-correct legacy answer is a prior result, not a new independent attempt.
 const first=s.first||((result.valid&&!wasSolved)?{correct:result.correct,assisted:s.help>0}:null);
 return {expedition:{...s,scene:'answer',first},nature:checked.state,result};
}
function explanation(exp,nature,data){
 const s=normalise(exp),p=status(s,nature,data);
 if(!p.solved&&s.help!==2&&!s.awarded)return {...s,scene:'answer'};
 return {...s,scene:'explanation',explanationSeen:true};
}
function note(exp,nature,data,value,now=Date.now()){
 const s=normalise(exp),q=task(data,NOTE),source=nature||N.fresh();
 if(!q)return {expedition:s,nature:source};
 const field=q.fields[0]?.id||'f0',v=text(value,5000);
 return {expedition:s,nature:source.records?.[q.id]?.draft?.[field]===v?source:N.draft(source,q,field,v,now)};
}
function design(exp,patch){
 const s=normalise(exp);if(!object(patch))return s;
 const p={...s.postcard};
 if(typeof patch.title==='string')p.title=text(patch.title,80);
 if(integer(patch.paper,0,2))p.paper=patch.paper;
 if(FRAMES.includes(patch.frame))p.frame=patch.frame;
 if(PATTERNS.includes(patch.pattern))p.pattern=patch.pattern;
 if(Array.isArray(patch.pixels)&&patch.pixels.length===36&&patch.pixels.every(v=>integer(v,-1,COLORS.length-1)))p.pixels=[...patch.pixels];
 return {...s,postcard:p};
}
function finish(exp,nature,data,now=Date.now()){
 const s=normalise(exp);if(!status(s,nature,data).canFinish)return null;
 return {...s,scene:'atlas',awarded:true,finishedAt:s.awarded?s.finishedAt:(Number.isFinite(now)&&now>=0?now:0)};
}
function place(exp,id,slot){
 const s=normalise(exp);if(!s.awarded||!['boat','postcard'].includes(id)||!integer(slot,0,2))return null;
 const own=s.shelf.find(p=>p.id===id),other=s.shelf.find(p=>p.slot===slot&&p.id!==id);
 const shelf=s.shelf.filter(p=>p.id!==id&&p.slot!==slot);
 if(own&&other)shelf.push({id:other.id,slot:own.slot});
 shelf.push({id,slot});return {...s,shelf};
}
function remove(exp,id){
 const s=normalise(exp);if(!s.awarded||!s.shelf.some(p=>p.id===id))return null;
 return {...s,shelf:s.shelf.filter(p=>p.id!==id)};
}
return {TASK,NOTE,SCENES,COLORS,FRAMES,PATTERNS,fresh,normalise,task,status,move,set,hint,answer,explanation,note,design,finish,place,remove};
});
