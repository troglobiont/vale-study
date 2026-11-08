(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ValeMathTestCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CHAPTERS=['small','large','rectangle','square','practice','check'];
const T=(ru,sr,en)=>({ru,sr,en});
const UNITS={'mm²':T('мм²','mm²','mm²'),'cm²':T('см²','cm²','cm²'),'dm²':T('дм²','dm²','dm²'),'m²':T('м²','m²','m²'),a:T('а','a','a'),ha:T('га','ha','ha'),'km²':T('км²','km²','km²'),din:T('дин.','дин.','din')};
const SCALE={'mm²':1,'cm²':100,'dm²':10000,'m²':1000000,a:100000000,ha:10000000000,'km²':1000000000000};
const totals=()=>({attempts:0,correct:0,total:0,corrected:0,last:null,byChapter:{}});
const fresh=()=>({schemaVersion:1,session:null,totals:totals()});
const clone=x=>JSON.parse(JSON.stringify(x));
function random(seed){let n=seed>>>0;return ()=>{n+=0x6d2b79f5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
function shuffle(list,rng){const out=[...list];for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
const question=(prompt,answer,unit,model,calculation)=>({type:'numeric',prompt,answer:String(answer),unit,model,calculation});
function generated(chapter,slot,rng){
 const n=(a,b)=>a+Math.floor(rng()*(b-a+1)),math=s=>T(s,s,s);
 const convert=(amount,from,to)=>{const answer=amount*SCALE[from]/SCALE[to];return question(T(`${amount} ${UNITS[from].ru} = ? ${UNITS[to].ru}`,`${amount} ${UNITS[from].sr} = ? ${UNITS[to].sr}`,`${amount} ${from} = ? ${to}`),answer,to,{kind:'convert',amount,from,to},SCALE[from]>=SCALE[to]?`${amount} × ${SCALE[from]/SCALE[to]} = ${answer}`:`${amount} ÷ ${SCALE[to]/SCALE[from]} = ${answer}`);};
 const combine=(a,from,b,other,to,subtract=false)=>{const answer=(a*SCALE[from]+(subtract?-1:1)*b*SCALE[other])/SCALE[to],sign=subtract?'−':'+';return question(T(`${a} ${UNITS[from].ru} ${sign} ${b} ${UNITS[other].ru} = ? ${UNITS[to].ru}`,`${a} ${UNITS[from].sr} ${sign} ${b} ${UNITS[other].sr} = ? ${UNITS[to].sr}`,`${a} ${from} ${sign} ${b} ${other} = ? ${to}`),answer,to,{kind:'combine',a,from,b,other,to,subtract},`${a} × ${SCALE[from]/SCALE[to]} ${sign} ${b} × ${SCALE[other]/SCALE[to]} = ${answer}`);};
 const rect=(a,b)=>question(T(`Прямоугольник имеет стороны ${a} см и ${b} см. Найди площадь.`,`Правоугаоник има странице ${a} cm и ${b} cm. Израчунај површину.`,`A rectangle has sides ${a} cm and ${b} cm. Find its area.`),a*b,'cm²',{kind:'rectangle',a,b},`${a} × ${b} = ${a*b}`);
 const square=a=>question(T(`Сторона квадрата — ${a} см. Найди площадь.`,`Страница квадрата је ${a} cm. Израчунај површину.`,`A square has a side of ${a} cm. Find its area.`),a*a,'cm²',{kind:'square',a},`${a} × ${a} = ${a*a}`);
 const missing=(a,b)=>question(T(`Площадь прямоугольника — ${a*b} см², длина — ${a} см. Найди ширину в сантиметрах.`,`Површина правоугаоника је ${a*b} cm², дужина ${a} cm. Нађи ширину у центиметрима.`,`A rectangle has area ${a*b} cm² and length ${a} cm. Find its width in centimetres.`),b,'',{kind:'missing',area:a*b,a},`${a*b} ÷ ${a} = ${b}`);
 const perimeter=(a,b)=>question(T(`Периметр прямоугольника — ${2*(a+b)} см, длина — ${a} см. Найди площадь.`,`Обим правоугаоника је ${2*(a+b)} cm, дужина ${a} cm. Израчунај површину.`,`A rectangle has perimeter ${2*(a+b)} cm and length ${a} cm. Find its area.`),a*b,'cm²',{kind:'perimeter',perimeter:2*(a+b),a},`(${2*(a+b)} ÷ 2 − ${a}) × ${a} = ${a*b}`);
 const cut=(a,b,c,d)=>question(T(`Из прямоугольника ${a} × ${b} см вырезали прямоугольник ${c} × ${d} см. Найди оставшуюся площадь.`,`Из правоугаоника ${a} × ${b} cm исечен је правоугаоник ${c} × ${d} cm. Нађи преосталу површину.`,`A ${c} × ${d} cm rectangle is cut out of a ${a} × ${b} cm rectangle. Find the remaining area.`),a*b-c*d,'cm²',{kind:'cut',a,b,c,d},`${a} × ${b} − ${c} × ${d} = ${a*b-c*d}`);
 let q;
 if(chapter==='small'){
  if(slot===0)q=convert(n(2,9),'m²','dm²');
  if(slot===1)q=convert(n(12,45),'dm²','cm²');
  if(slot===2)q=convert(n(4,35)*100,'cm²','dm²');
  if(slot===3)q=convert(n(3,18),'cm²','mm²');
  if(slot===4)q=convert(n(3,20),'dm²','mm²');
  if(slot===5)q=convert(n(2,8)*10000,'cm²','m²');
  if(slot===6)q=combine(n(2,9),'m²',n(10,90),'dm²','dm²');
  if(slot===7)q=combine(n(3,12),'dm²',n(10,80),'cm²','cm²');
  if(slot===8)q=combine(n(3,9),'m²',n(20,190),'dm²','dm²',true);
  if(slot===9){const a=n(2,6),b=n(3,9),c=n(20,90),answer=a*10000+b*100-c;q=question(T(`${a} м² + ${b} дм² − ${c} см² = ? см²`,`${a} m² + ${b} dm² − ${c} cm² = ? cm²`,`${a} m² + ${b} dm² − ${c} cm² = ? cm²`),answer,'cm²',{kind:'mixedSmall',a,b,c},`${a} × 10 000 + ${b} × 100 − ${c} = ${answer}`);}
 }else if(chapter==='large'){
  if(slot===0)q=convert(n(2,18),'a','m²');
  if(slot===1)q=convert(n(2,12),'ha','a');
  if(slot===2)q=convert(n(2,19)*100,'a','ha');
  if(slot===3)q=convert(n(2,9),'km²','ha');
  if(slot===4)q=convert(n(2,11),'ha','m²');
  if(slot===5)q=convert(n(2,8)*1000000,'m²','km²');
  if(slot===6)q=combine(n(2,9),'ha',n(10,90),'a','a');
  if(slot===7)q=combine(n(2,5),'km²',n(10,80),'ha','ha');
  if(slot===8)q=combine(n(3,9),'ha',n(20,190),'a','m²',true);
  if(slot===9){const a=n(2,5),b=n(12,60),c=n(4,15)*100,answer=a*10000+b*100-c;q=question(T(`Парк занимает ${a} га ${b} а. Под площадку отвели ${c} м². Сколько квадратных метров осталось?`,`Парк има ${a} ha ${b} a. За игралиште је издвојено ${c} m². Колико квадратних метара је остало?`,`A park covers ${a} ha ${b} a. A playground takes ${c} m². How many square metres remain?`),answer,'m²',{kind:'park',a,b,c},`${a} × 10 000 + ${b} × 100 − ${c} = ${answer}`);}
 }else if(chapter==='rectangle'){
  if(slot===0)q=rect(n(3,9),n(3,9));
  if(slot===1){const a=n(2,7),b=n(12,29),answer=a*10*b;q=question(T(`Стороны прямоугольника — ${a} м и ${b} дм. Найди площадь в дм².`,`Странице правоугаоника су ${a} m и ${b} dm. Нађи површину у dm².`,`A rectangle has sides ${a} m and ${b} dm. Find its area in dm².`),answer,'dm²',{kind:'mixedRectangle',a,b},`${a} × 10 × ${b} = ${answer}`);}
  if(slot===2)q=missing(n(4,12),n(3,9));
  if(slot===3)q=rect(n(8,17),n(4,11));
  if(slot===4){const a=n(10,16),b=n(8,14),c=n(3,6),d=n(3,6);q=question(T(`Два прямоугольника: ${a} × ${b} см и ${c} × ${d} см. На сколько площадь первого больше?`,`Два правоугаоника: ${a} × ${b} cm и ${c} × ${d} cm. За колико је површина првог већа?`,`Two rectangles measure ${a} × ${b} cm and ${c} × ${d} cm. How much larger is the first area?`),a*b-c*d,'cm²',{kind:'cut',a,b,c,d},`${a} × ${b} − ${c} × ${d} = ${a*b-c*d}`);}
  if(slot===5)q=perimeter(n(8,15),n(3,7));
  if(slot===6){const a=n(3,7),b=n(3,8),tile=4,answer=a*b*100/tile;q=question(T(`Пол ${a} × ${b} м покрывают плитками площадью ${tile} дм². Сколько плиток нужно без запаса?`,`Под ${a} × ${b} m покрива се плочицама површине ${tile} dm². Колико плочица треба без резерве?`,`A ${a} × ${b} m floor is covered with tiles of area ${tile} dm². How many tiles are needed, with no extras?`),answer,'',{kind:'tiles',a,b,tile},`${a} × ${b} × 100 ÷ ${tile} = ${answer}`);}
  if(slot===7)q=cut(n(12,18),n(10,15),n(3,6),n(2,5));
  if(slot===8)q=perimeter(n(15,24),n(6,11));
  if(slot===9){const a=n(7,10),b=n(4,6),c=2,d=n(2,3),answer=a*b-2*c*d;q=question(T(`Стена ${a} × ${b} м имеет два окна по ${c} × ${d} м. Найди площадь стены без окон.`,`Зид ${a} × ${b} m има два прозора ${c} × ${d} m. Нађи површину зида без прозора.`,`A ${a} × ${b} m wall has two ${c} × ${d} m windows. Find the wall area excluding the windows.`),answer,'m²',{kind:'windows',a,b,c,d},`${a} × ${b} − 2 × ${c} × ${d} = ${answer}`);}
 }else if(chapter==='square'){
  if(slot===0)q=square(n(3,9));
  if(slot===1){const a=n(4,12);q=question(T(`Площадь квадрата — ${a*a} см². Найди сторону в сантиметрах.`,`Површина квадрата је ${a*a} cm². Нађи страницу у центиметрима.`,`A square has area ${a*a} cm². Find its side in centimetres.`),a,'',{kind:'squareSide',area:a*a},`${a} × ${a} = ${a*a}`);}
  if(slot===2)q=square(n(10,17));
  if(slot===3){const a=n(5,12);q=question(T(`Периметр квадрата — ${4*a} см. Найди площадь.`,`Обим квадрата је ${4*a} cm. Израчунај површину.`,`A square has perimeter ${4*a} cm. Find its area.`),a*a,'cm²',{kind:'squarePerimeter',perimeter:4*a},`(${4*a} ÷ 4) × (${4*a} ÷ 4) = ${a*a}`);}
  if(slot===4){const a=n(2,6),answer=a*a*100;q=question(T(`Сторона квадрата — ${a} м. Найди площадь в дм².`,`Страница квадрата је ${a} m. Нађи површину у dm².`,`A square has side ${a} m. Find its area in dm².`),answer,'dm²',{kind:'squareDm',a},`${a} × ${a} × 100 = ${answer}`);}
  if(slot===5){const k=n(2,4);q=question(T(`Сторону квадрата увеличили в ${k} раза. Во сколько раз увеличилась площадь?`,`Страница квадрата увећана је ${k} пута. Колико пута је увећана површина?`,`A square’s side is multiplied by ${k}. By what factor is its area multiplied?`),k*k,'',{kind:'factor',k},`${k} × ${k} = ${k*k}`);}
  if(slot===6){const a=n(10,16),b=n(3,8);q=question(T(`Стороны двух квадратов — ${a} см и ${b} см. На сколько площадь первого больше?`,`Странице два квадрата су ${a} cm и ${b} cm. За колико је површина првог већа?`,`Two squares have sides ${a} cm and ${b} cm. How much larger is the first area?`),a*a-b*b,'cm²',{kind:'squareDifference',a,b},`${a} × ${a} − ${b} × ${b} = ${a*a-b*b}`);}
  if(slot===7){const a=n(9,15);q=cut(a,a,n(2,5),n(2,5));}
  if(slot===8){const a=n(3,8);q=question(T(`Квадратный пол со стороной ${a} м покрывают плитками со стороной 20 см. Сколько плиток нужно без запаса?`,`Квадратни под странице ${a} m покрива се плочицама странице 20 cm. Колико плочица треба без резерве?`,`A square floor of side ${a} m is covered with square tiles of side 20 cm. How many tiles are needed, with no extras?`),a*a*25,'',{kind:'squareTiles',a,tileSide:20},`${a} × ${a} × 10 000 ÷ (20 × 20) = ${a*a*25}`);}
  if(slot===9){const a=n(6,12),border=2,answer=(a+2*border)**2-a*a;q=question(T(`Квадрат со стороной ${a} см окружили снаружи рамкой шириной ${border} см с каждой стороны. Найди площадь самой рамки.`,`Квадрат странице ${a} cm окружен је споља оквиром ширине ${border} cm са сваке стране. Нађи површину самог оквира.`,`A square of side ${a} cm has an outer frame ${border} cm wide on each side. Find the area of the frame itself.`),answer,'cm²',{kind:'frame',a,border},`(${a} + 2 × ${border})² − ${a}² = ${answer}`);}
 }else if(chapter==='practice'){
  if(slot===0){const a=n(4,8),b=n(3,6);q=rect(a,b);}
  if(slot===1)q=convert(n(3,14),'a','m²');
  if(slot===2)q=missing(n(8,15),n(4,9));
  if(slot===3)q=square(n(7,12));
  if(slot===4)q=perimeter(n(10,17),n(5,9));
  if(slot===5)q=combine(n(3,8),'ha',n(10,85),'a','a');
  if(slot===6){const a=n(3,6),b=n(3,7),price=n(2,5)*100; q=question(T(`Покраска потолка ${a} × ${b} м стоит ${price} динаров за 1 м². Сколько стоит вся работа?`,`Кречење плафона ${a} × ${b} m кошта ${price} динара за 1 m². Колико кошта цео посао?`,`Painting a ${a} × ${b} m ceiling costs ${price} dinars per m². What is the total cost?`),a*b*price,'din',{kind:'price',a,b,price},`${a} × ${b} × ${price} = ${a*b*price}`);}
  if(slot===7)q=cut(n(12,18),n(10,16),n(3,5),n(3,5));
  if(slot===8)q=generated('rectangle',6,rng);
  if(slot===9)q=generated('rectangle',9,rng);
 }else if(chapter==='check')q=generated(['small','large','rectangle','square','rectangle','large','square','practice','rectangle','square'][slot],slot,rng);
 if(!q)throw Error('Unknown test template');
 if(q.type==='choice'){q={...q,type:'numeric',answer:q.numericAnswer};delete q.options;delete q.numericAnswer;}
 if(!Number.isSafeInteger(Number(q.answer))||Number(q.answer)<0)throw Error('Invalid generated answer');
 q.template=chapter+'-'+slot;
 if([3,5,8].includes(slot)){
  const answer=Number(q.answer),values=shuffle([...new Set([answer,answer*10,Math.max(0,answer-1),answer+10,answer+1])].slice(0,4),rng);
  q={...q,type:'choice',options:values.map((value,i)=>({id:String(i),value:String(value)})),answer:String(values.indexOf(answer)),numericAnswer:String(answer)};
 }
 return q;
}
function generate(chapter,size=8,seed=Date.now()){
 if(!CHAPTERS.includes(chapter)||![5,8,10].includes(size))throw Error('Invalid test selection');
 const rng=random(seed),slots=Array.from({length:size},(_,i)=>Math.round(i*9/(size-1)));
 const seen=new Set();return slots.map((slot,i)=>{let q;do{q=generated(chapter,slot,rng);}while(seen.has(q.prompt.en));seen.add(q.prompt.en);return {...q,id:'q'+i,difficulty:i>=size-2?3:i>=Math.ceil(size/3)?2:1};});
}
function begin(state,chapter,size=8,seed=Date.now(),now=Date.now()){
 const questions=generate(chapter,size,seed),session={id:now.toString(36)+'-'+(seed>>>0).toString(36),chapter,size,index:0,seed:seed>>>0,started:now,questions,drafts:questions.map(()=>''),first:null,corrections:{}};
 return {...state,session};
}
function saveAnswer(state,sessionId,index,raw){
 const s=state.session;if(!s||s.id!==sessionId||s.first||!Number.isInteger(index)||!s.questions[index])return null;
 const value=String(raw??'');if(value.length>65)return null;const drafts=[...s.drafts];drafts[index]=value;return {...state,session:{...s,drafts}};
}
function position(state,sessionId,index){const s=state.session;if(!s||s.id!==sessionId||s.first||!Number.isInteger(index)||index<0||index>s.size)return null;return {...state,session:{...s,index}};}
function value(question,raw,parse){if(question.type==='choice')return question.options.some(o=>o.id===raw)?{ok:true,value:raw}:{ok:false,error:'choose'};return parse(raw);}
function validate(state,parse){const s=state.session;if(!s)return [{index:0,error:'empty'}];return s.questions.flatMap((q,index)=>{const p=value(q,s.drafts[index],parse);return p.ok?[]:[{index,error:p.error}];});}
function grade(state,sessionId,parse,now=Date.now()){
 const s=state.session;if(!s||s.id!==sessionId||s.first)return null;
 if(validate(state,parse).length)return null;
 const answers=s.questions.map((q,i)=>value(q,s.drafts[i],parse).value),correct=s.questions.map((q,i)=>q.answer===answers[i]),score=correct.filter(Boolean).length;
 const first={answers,correct,score,total:s.size,at:now},last={sessionId:s.id,chapter:s.chapter,score,total:s.size,at:now},old=state.totals;
 return {...state,session:{...s,index:s.size,first},totals:{...old,attempts:old.attempts+1,correct:old.correct+score,total:old.total+s.size,last,byChapter:{...old.byChapter,[s.chapter]:last}}};
}
function correctAnswer(state,sessionId,index,raw,parse,now=Date.now()){
 const s=state.session,q=s?.questions[index];if(!s||s.id!==sessionId||!s.first||!q||s.first.correct[index]||s.corrections[index]?.correct)return null;
 const checked=value(q,String(raw??''),parse);if(!checked.ok)return {valid:false,error:checked.error};
 const correct=checked.value===q.answer,corrections={...s.corrections,[index]:{answer:checked.value,correct,at:now}};
 return {valid:true,correct,state:{...state,session:{...s,corrections},totals:{...state.totals,corrected:state.totals.corrected+(correct?1:0)}}};
}
function validQuestion(q){return q&&/^q\d+$/.test(q.id)&&['numeric','choice'].includes(q.type)&&q.prompt&&['ru','sr','en'].every(l=>typeof q.prompt[l]==='string'&&q.prompt[l].length<600)&&/^\d+$/.test(q.answer)&&typeof q.calculation==='string'&&q.calculation.length<250&&typeof q.unit==='string'&&(q.unit===''||Object.hasOwn(UNITS,q.unit))&&(q.type!=='choice'||Array.isArray(q.options)&&q.options.length===4&&new Set(q.options.map(o=>o.value)).size===4&&q.options.every((o,i)=>o.id===String(i)&&/^\d+$/.test(o.value))&&Number(q.answer)<4);}
function validSummary(r){return r&&typeof r.sessionId==='string'&&CHAPTERS.includes(r.chapter)&&[5,8,10].includes(r.total)&&Number.isInteger(r.score)&&r.score>=0&&r.score<=r.total&&Number.isFinite(r.at)&&r.at>=0;}
function normalise(input){
 const out=fresh();if(!input||input.schemaVersion!==1)return out;
 const t=input.totals;if(t&&['attempts','correct','total','corrected'].every(k=>Number.isSafeInteger(t[k])&&t[k]>=0)&&t.correct<=t.total&&t.corrected<=t.total-t.correct){const byChapter={};for(const ch of CHAPTERS)if(validSummary(t.byChapter?.[ch]))byChapter[ch]=clone(t.byChapter[ch]);out.totals={attempts:t.attempts,correct:t.correct,total:t.total,corrected:t.corrected,last:validSummary(t.last)?clone(t.last):null,byChapter};}
 const s=input.session;
 if(!s||typeof s.id!=='string'||!/^[a-z0-9-]{1,80}$/.test(s.id)||!CHAPTERS.includes(s.chapter)||![5,8,10].includes(s.size)||!Number.isInteger(s.index)||s.index<0||s.index>s.size||!Number.isInteger(s.seed)||s.seed<0||!Number.isFinite(s.started)||s.started<0||!Array.isArray(s.questions)||s.questions.length!==s.size||!s.questions.every(validQuestion)||new Set(s.questions.map(q=>q.id)).size!==s.size||!Array.isArray(s.drafts)||s.drafts.length!==s.size||!s.drafts.every(x=>typeof x==='string'&&x.length<=65))return out;
 const first=s.first;
 if(first&&(!Array.isArray(first.answers)||first.answers.length!==s.size||!first.answers.every(x=>typeof x==='string'&&/^\d+$/.test(x))||!Array.isArray(first.correct)||first.correct.length!==s.size||!first.correct.every((v,i)=>typeof v==='boolean'&&v===(first.answers[i]===s.questions[i].answer))||first.score!==first.correct.filter(Boolean).length||first.total!==s.size||!Number.isFinite(first.at)||first.at<0))return out;
 const corrections={};if(first)for(let i=0;i<s.size;i++){const c=s.corrections?.[i];if(!first.correct[i]&&c&&typeof c.answer==='string'&&/^\d+$/.test(c.answer)&&c.correct===(c.answer===s.questions[i].answer)&&Number.isFinite(c.at)&&c.at>=0)corrections[i]={...c};}
 out.session={...clone(s),first:first?clone(first):null,corrections};return out;
}
return {CHAPTERS,UNITS,SCALE,fresh,generate,begin,saveAnswer,position,validate,grade,correctAnswer,normalise,validQuestion};
});
