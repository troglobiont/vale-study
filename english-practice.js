(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ValePractice=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KINDS=['vocabulary','grammar'];
const text=(ru,sr,en)=>({ru,sr,en});
const GRAMMAR=[
 {id:'present-simple',title:'Present Simple',unit:'3',page:29,exercise:4,
  summary:text('То, что происходит обычно или регулярно.','Оно што се дешава обично или редовно.','Things that happen regularly or are generally true.'),
  rules:[text('I / you / we / they + глагол. He / she / it + глагол с -s или -es.','I / you / we / they + глагол. He / she / it + глагол са -s или -es.','I / you / we / they + base verb. He / she / it + verb with -s or -es.'),text('В отрицании: don’t / doesn’t + глагол без -s. В вопросе: Do / Does + кто + глагол без -s?','Одрично: don’t / doesn’t + основни глагол. Питање: Do / Does + субјекат + основни глагол?','Negative: don’t / doesn’t + base verb. Question: Do / Does + subject + base verb?')],
  formula:'She works. → Does she work? → She doesn’t work.',
  questions:[
   {id:'ps-1',prompt:'He ___ fires.',choices:['fight','fights','fighting'],answer:1,item:1,verb:'fight',reason:text('He: добавляем -s.','He: додајемо -s.','With he, add -s.')},
   {id:'ps-3',prompt:'She ___ planes.',choices:['fly','flying','flies'],answer:2,item:3,verb:'fly',reason:text('She: fly → flies.','She: fly → flies.','With she, fly becomes flies.')},
   {id:'ps-4',prompt:'She ___ bread.',choices:['makes','make','making'],answer:0,item:4,verb:'make',reason:text('She: make → makes.','She: make → makes.','With she, make becomes makes.')},
   {id:'ps-6',prompt:'She ___ animals.',choices:['helping','helps','help'],answer:1,item:6,verb:'help',reason:text('She: добавляем -s.','She: додајемо -s.','With she, add -s.')}
  ]},
 {id:'present-continuous',title:'Present Continuous',unit:'2',page:17,exercise:3,
  summary:text('То, что происходит сейчас.','Оно што се дешава сада.','Things happening now.'),
  rules:[text('I am / he, she, it is / you, we, they are + глагол с -ing.','I am / he, she, it is / you, we, they are + глагол са -ing.','I am / he, she, it is / you, we, they are + verb with -ing.'),text('В отрицании добавь not после am / is / are. В вопросе перенеси am / is / are в начало.','Одрично додај not после am / is / are. У питању стави am / is / are на почетак.','For negatives, add not after am / is / are. For questions, put am / is / are first.')],
  formula:'She is diving. → Is she diving? → She isn’t diving.',
  questions:[
   {id:'pc-2',prompt:'It ___.',choices:['is swimming','are swimming','swim'],answer:0,item:2,verb:'swim',reason:text('It → is. Swim → swimming.','It → is. Swim → swimming.','It takes is. Swim becomes swimming.')},
   {id:'pc-3',prompt:'He ___.',choices:['are diving','dives','is diving'],answer:2,item:3,verb:'dive',reason:text('He → is. Dive → diving, без e.','He → is. Dive → diving, без e.','He takes is. Drop the e in diving.')},
   {id:'pc-4',prompt:'He ___.',choices:['is waterskiing','waterskis','are waterskiing'],answer:0,item:4,verb:'waterski',reason:text('He → is + глагол с -ing.','He → is + глагол са -ing.','He takes is + verb with -ing.')},
   {id:'pc-6',prompt:'She ___.',choices:['fishes','are fishing','is fishing'],answer:2,item:6,verb:'fish',reason:text('She → is + глагол с -ing.','She → is + глагол са -ing.','She takes is + verb with -ing.')}
  ]}
];
const blankResult=()=>({attempts:0,correct:0,total:0,last:null,byScope:{}});
const fresh=()=>({practice:{vocabulary:null,grammar:null},results:{vocabulary:blankResult(),grammar:blankResult()}});
const key=s=>String(s||'').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g,' ').trim();
function shuffled(list,rng=Math.random){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(rng()*(i+1))));[a[i],a[j]]=[a[j],a[i]];}return a;}
function vocabularyQuestions(pool,all,limit=8,locale='ru',rng=Math.random){
 const language=locale==='sr'?'sr':'ru',unique=[...new Map(pool.map(w=>[w.id,w])).values()],questions=[];
 for(const w of shuffled(unique,rng)){
  const meaning=w[language];if(!w.en||!meaning)continue;
  const alternatives=[...new Map([...shuffled(all.filter(x=>x.unit===w.unit),rng),...shuffled(all.filter(x=>x.unit!==w.unit),rng)].filter(x=>key(x.en)!==key(w.en)&&key(x[language])!==key(meaning)).map(x=>[key(x[language]),x[language]])).values()].filter(Boolean).slice(0,3);
  if(!alternatives.length)continue;
  const choices=shuffled([meaning,...alternatives],rng);
  questions.push({id:'word-'+w.id,wordId:w.id,prompt:w.en,choices,answer:choices.indexOf(meaning)});
  if(questions.length>=Math.min(8,Math.max(1,limit)))break;
 }
 return questions;
}
function grammarQuestions(id,rng=Math.random){const topic=GRAMMAR.find(t=>t.id===id);if(!topic)return [];return shuffled(topic.questions,rng).map(q=>({...q,choices:[...q.choices],source:{page:topic.page,exercise:topic.exercise,item:q.item}}));}
function validQuestion(q){return q&&typeof q.id==='string'&&/^[\w.-]{1,100}$/.test(q.id)&&typeof q.prompt==='string'&&q.prompt.length<=200&&Array.isArray(q.choices)&&q.choices.length>=2&&q.choices.length<=4&&q.choices.every(x=>typeof x==='string'&&x.length>0&&x.length<=200)&&new Set(q.choices.map(key)).size===q.choices.length&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.choices.length;}
function validResult(r){return r&&Number.isInteger(r.score)&&Number.isInteger(r.total)&&r.total>0&&r.total<=8&&r.score>=0&&r.score<=r.total&&Number.isFinite(r.at)&&r.at>=0&&typeof r.scope==='string'&&r.scope.length<=100;}
function validSession(s){
 return s&&typeof s.id==='string'&&/^[a-z0-9-]{1,100}$/.test(s.id)&&typeof s.scope==='string'&&s.scope.length<=100&&['ru','sr'].includes(s.locale)&&Array.isArray(s.questions)&&s.questions.length>0&&s.questions.length<=8&&s.questions.every(validQuestion)&&new Set(s.questions.map(q=>q.id)).size===s.questions.length&&Array.isArray(s.answers)&&s.answers.length===s.questions.length&&s.answers.every((a,i)=>a===null||(Number.isInteger(a)&&a>=0&&a<s.questions[i].choices.length))&&Number.isInteger(s.index)&&s.index>=0&&s.index<=s.questions.length&&s.answers.every((a,i)=>i<s.index?a!==null:i>s.index?a===null:true)&&Number.isFinite(s.started)&&s.started>=0&&(!s.finished||s.index===s.questions.length);
}
function normalise(input){
 const out=fresh();
 for(const kind of KINDS){
  const session=input?.practice?.[kind];if(validSession(session))out.practice[kind]=JSON.parse(JSON.stringify(session));
  const r=input?.results?.[kind];if(r&&Number.isInteger(r.attempts)&&r.attempts>=0&&Number.isInteger(r.correct)&&r.correct>=0&&Number.isInteger(r.total)&&r.total>=r.correct){const byScope={};for(const [id,value]of Object.entries(r.byScope||{}).slice(0,100))if(/^[\w-]{1,100}$/.test(id)&&!['__proto__','constructor','prototype'].includes(id)&&validResult(value))byScope[id]={...value};out.results[kind]={attempts:r.attempts,correct:r.correct,total:r.total,last:validResult(r.last)?{...r.last}:null,byScope};}
 }
 return out;
}
function begin(state,kind,questions,scope='all',locale='ru',now=Date.now(),rng=Math.random){
 if(!KINDS.includes(kind)||!questions.length||questions.length>8||!questions.every(validQuestion)||new Set(questions.map(q=>q.id)).size!==questions.length)return null;
 const session={id:now.toString(36)+'-'+rng().toString(36).slice(2,10),scope,locale:locale==='sr'?'sr':'ru',questions:JSON.parse(JSON.stringify(questions)),answers:questions.map(()=>null),index:0,started:now,finished:false};
 return {...state,practice:{...fresh().practice,...state.practice,[kind]:session},results:{...fresh().results,...state.results}};
}
function answer(state,kind,sessionId,questionId,choice){
 const s=state.practice?.[kind],q=s?.questions[s.index];
 if(!s||s.id!==sessionId||s.finished||!q||q.id!==questionId||s.answers[s.index]!==null||!Number.isInteger(choice)||choice<0||choice>=q.choices.length)return null;
 const answers=[...s.answers];answers[s.index]=choice;return {...state,practice:{...state.practice,[kind]:{...s,answers}}};
}
function score(session){return session.questions.reduce((n,q,i)=>n+(session.answers[i]===q.answer?1:0),0);}
function advance(state,kind,sessionId,questionId,now=Date.now()){
 const s=state.practice?.[kind],q=s?.questions[s.index];if(!s||s.id!==sessionId||s.finished||!q||q.id!==questionId||s.answers[s.index]===null)return null;
 const next={...s,index:s.index+1},practice={...state.practice,[kind]:next};
 if(next.index<next.questions.length)return {...state,practice};
 next.finished=true;const result={score:score(next),total:next.questions.length,at:now,scope:s.scope},old=state.results?.[kind]||blankResult();
 return {...state,practice,results:{...state.results,[kind]:{attempts:old.attempts+1,correct:old.correct+result.score,total:old.total+result.total,last:result,byScope:{...old.byScope,[s.scope]:result}}}};
}
function mistakes(session){return session?session.questions.filter((q,i)=>session.answers[i]!==null&&session.answers[i]!==q.answer):[];}
return {GRAMMAR,KINDS,fresh,normalise,shuffled,vocabularyQuestions,grammarQuestions,validQuestion,validSession,begin,answer,advance,score,mistakes};
});
