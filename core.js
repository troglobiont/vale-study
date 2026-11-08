(function(root){
 'use strict';
 const MAX=1000000000000000000n;
 function parseInteger(raw){
  const s=String(raw??'');
  if([...s].length>64)return {ok:false,error:'long'};
  const v=s.replace(/^[ \u00a0\u202f]+|[ \u00a0\u202f]+$/g,'');
  if(!v)return {ok:false,error:'empty'};
  if(/^[-−]/.test(v))return {ok:false,error:'negative'};
  if(!/^(?:[0-9]+|[0-9]{1,3}(?:[ \u00a0\u202f][0-9]{3})+)$/.test(v))return {ok:false,error:'format'};
  const n=BigInt(v.replace(/[ \u00a0\u202f]/g,''));
  if(n>MAX)return {ok:false,error:'range'};
  return {ok:true,value:n.toString()};
 }
 function check(task, draft={}){
  if(task.type==='choice'){
   if(!task.options.some(o=>o.id===draft.choice))return {valid:false,error:'choose'};
   return {valid:true,correct:draft.choice===task.answer,normalized:{choice:draft.choice},wrong:draft.choice!==task.answer?['choice']:[]};
  }
  if(task.type==='sort'){
   const order=draft.order||[];
   if(order.length!==task.items.length||new Set(order).size!==order.length||order.some(x=>!/^\d+$/.test(x)||Number(x)>=task.items.length))return {valid:false,error:'order'};
   return {valid:true,correct:order.every((x,i)=>x===task.answer[i]),normalized:{order:[...order]},wrong:order.map((x,i)=>x===task.answer[i]?null:'sort'+i).filter(Boolean)};
  }
  if(task.type==='match'){
   const matches=draft.matches||[];
   if(task.left.some((_,i)=>!/^\d+$/.test(matches[i]||'')||Number(matches[i])>=task.right.length))return {valid:false,error:'pairs'};
   return {valid:true,correct:task.answers.every((x,i)=>x===matches[i]),normalized:{matches:[...matches]},wrong:task.answers.map((x,i)=>x===matches[i]?null:'match'+i).filter(Boolean)};
  }
  if(task.type==='measurement')return {valid:false,error:'measurement'};
  const values=[];
  for(let i=0;i<task.fields.length;i++){
   const p=parseInteger((draft.values||[])[i]);
   if(!p.ok)return {valid:false,error:p.error,field:i};
   values.push(p.value);
  }
  if(task.leadChoice&&!task.leadChoice.options.some(o=>o.id===draft.choice))return {valid:false,error:'choose'};
  const wrong=values.map((x,i)=>x===task.fields[i].answer?null:'field'+i).filter(Boolean);
  if(task.leadChoice&&draft.choice!==task.leadChoice.answer)wrong.push('choice');
  return {valid:true,correct:wrong.length===0,wrong,normalized:{values,...(task.leadChoice?{choice:draft.choice}:{})}};
 }
 function measurement(task,raw){
  const n=task.measurement==='square'?2:7;
  const v=[];
  for(let i=0;i<n;i++){
   const p=parseInteger(raw[i]);
   if(!p.ok)return {valid:false,error:p.error,field:i};
   v.push(BigInt(p.value));
  }
  if((task.measurement==='square'?[v[0]]:v.slice(0,4)).some(x=>x===0n||x>10000n))return {valid:false,error:'measureRange'};
  if(task.measurement==='square')return {valid:true,correct:v[0]*v[0]===v[1],computed:[(v[0]*v[0]).toString()]};
  const a=v[0]*v[1],b=v[2]*v[3],diff=a>b?a-b:b-a;
  return {valid:true,correct:a===v[4]&&b===v[5]&&diff===v[6],computed:[a.toString(),b.toString(),diff.toString()]};
 }
 function digest(value){return JSON.stringify(value);}
 function apply(record,result){
  if(!result.valid)return {record,changed:false};
  if(record.locked)return {record,changed:false};
  const fingerprint=digest(result.normalized);
  if(record.lastDigest===fingerprint)return {record,changed:false};
  const next={...record,lastDigest:fingerprint,attempts:(record.attempts||0)+1};
  if(!next.first&&record.originalOutcome!=='revealed')next.first={correct:result.correct,assisted:!!record.help||!!record.everHelp,answer:result.normalized};
  if(!next.roundFirst)next.roundFirst={correct:result.correct,assisted:!!record.help};
  next.lastCorrect=result.correct;
  if(result.correct){
   next.locked=true;next.solved=true;
   next.lastOutcome=!next.roundFirst.correct?'corrected':next.roundFirst.assisted?'helped':'independent';
   if(!next.originalOutcome)next.originalOutcome=next.lastOutcome;
  }
  return {record:next,changed:true};
 }
 const api={parseInteger,check,measurement,apply,digest};
 root.ValeCore=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window==='undefined'?globalThis:window);
