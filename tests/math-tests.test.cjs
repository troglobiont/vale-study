const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../math-test-core.js'),C=require('../core.js'),B=require('../book.json');
let passed=0;function test(name,fn){try{fn();passed++;}catch(error){throw Error(name,{cause:error});}}
const parse=C.parseInteger,now=1700000000000;
const scales={'mm²':1,'cm²':100,'dm²':10000,'m²':1000000,a:100000000,ha:10000000000,'km²':1000000000000};
function expected(q){const m=q.model;switch(m.kind){
 case 'convert':return m.amount*scales[m.from]/scales[m.to];
 case 'combine':return (m.a*scales[m.from]+(m.subtract?-1:1)*m.b*scales[m.other])/scales[m.to];
 case 'rectangle':return m.a*m.b;case 'square':return m.a*m.a;case 'missing':return m.area/m.a;
 case 'mixedSmall':case 'park':return m.a*10000+m.b*100-m.c;
 case 'mixedRectangle':return m.a*10*m.b;case 'perimeter':return (m.perimeter/2-m.a)*m.a;
 case 'cut':return m.a*m.b-m.c*m.d;case 'tiles':return m.a*m.b*100/m.tile;
 case 'windows':return m.a*m.b-2*m.c*m.d;case 'squareSide':return Math.sqrt(m.area);
 case 'squarePerimeter':return (m.perimeter/4)**2;case 'squareDm':return m.a*m.a*100;
 case 'factor':return m.k**2;case 'squareDifference':return m.a*m.a-m.b*m.b;
 case 'squareTiles':return (m.a*100/m.tileSide)**2;case 'frame':return (m.a+2*m.border)**2-m.a*m.a;
 case 'price':return m.a*m.b*m.price;default:throw Error(m.kind);
}}
function fill(state,wrong=[]){for(let i=0;i<state.session.size;i++){const q=state.session.questions[i],answer=wrong.includes(i)?q.type==='choice'?String((Number(q.answer)+1)%4):String(Number(q.answer)+1):q.answer;state=M.saveAnswer(state,state.session.id,i,answer);}return state;}
function start(chapter='small',size=8,seed=17){return M.begin(M.fresh(),chapter,size,seed,now);}
test('all six sections and all batch sizes generate valid mixed questions',()=>{for(const chapter of M.CHAPTERS)for(const size of [5,8,10])for(const level of [1,2,3]){const qs=M.generate(chapter,size,15,level);assert.equal(qs.length,size);assert.equal(new Set(qs.map(q=>q.id)).size,size);assert.equal(new Set(qs.map(q=>q.prompt.en)).size,size);assert(qs.some(q=>q.type==='numeric'));assert(qs.some(q=>q.type==='choice'));assert(qs.every(M.validQuestion));assert(qs.every(q=>q.difficulty===level));}});
test('8100 generated sets agree with independent unit and geometry calculations',()=>{for(let seed=1;seed<=150;seed++)for(const chapter of M.CHAPTERS)for(const size of [5,8,10])for(const level of [1,2,3])for(const q of M.generate(chapter,size,seed,level)){const answer=q.type==='choice'?q.options.find(o=>o.id===q.answer).value:q.answer;assert.equal(Number(answer),expected(q),chapter+' '+q.template+' seed '+seed);assert(Number.isSafeInteger(Number(answer)));assert(Number(answer)>=0);}});
test('new seeds change values and saved seeds reproduce every question',()=>{assert.deepEqual(M.generate('check',10,19),M.generate('check',10,19));assert.notDeepEqual(M.generate('check',10,19),M.generate('check',10,20));});
test('unsupported section or batch size never starts a broken test',()=>{assert.throws(()=>M.generate('unknown',8));assert.throws(()=>M.generate('small',6));});
test('old or absent data gains independent empty test state',()=>{assert.deepEqual(M.normalise(),M.fresh());assert.deepEqual(M.normalise({schemaVersion:7}),M.fresh());});
test('recording and changing drafts never marks answers or alters totals',()=>{let s=start();s=M.saveAnswer(s,s.session.id,0,'123');s=M.saveAnswer(s,s.session.id,0,'999');assert.equal(s.session.drafts[0],'999');assert.equal(s.session.first,null);assert.equal(s.totals.attempts,0);assert.equal(s.totals.correct,0);});
test('navigation allows revisiting questions and review without correctness feedback',()=>{let s=start();s=M.position(s,s.session.id,8);assert.equal(s.session.index,8);s=M.position(s,s.session.id,0);assert.equal(s.session.index,0);assert.equal(s.session.first,null);assert.equal(M.position(s,s.session.id,9),null);});
test('unanswered and malformed inputs prevent grading the whole test',()=>{let s=start();assert.equal(M.validate(s,parse).length,8);assert.equal(M.grade(s,s.session.id,parse),null);s=fill(s);s=M.saveAnswer(s,s.session.id,0,'1.5');assert.equal(M.validate(s,parse)[0].index,0);assert.equal(M.grade(s,s.session.id,parse),null);assert.equal(s.totals.attempts,0);});
test('invalid choice IDs are not accepted as test answers',()=>{let s=fill(start());const i=s.session.questions.findIndex(q=>q.type==='choice');s=M.saveAnswer(s,s.session.id,i,'4');assert(M.validate(s,parse).some(e=>e.index===i));assert.equal(M.grade(s,s.session.id,parse),null);});
test('the single final submission grades all answers together',()=>{const s=fill(start(),[0]);const graded=M.grade(s,s.session.id,parse,now+1);assert.equal(graded.session.first.score,7);assert.equal(graded.session.first.total,8);assert.equal(graded.session.first.correct[0],false);assert.equal(graded.totals.attempts,1);assert.equal(graded.totals.correct,7);assert.equal(graded.totals.total,8);assert.equal(graded.totals.byChapter.small.score,7);assert.equal(s.session.first,null);});
test('repeated final clicks cannot overwrite the first score',()=>{const s=M.grade(fill(start()),start().session.id,parse);assert.equal(M.grade(s,s.session.id,parse),null);assert.equal(M.saveAnswer(s,s.session.id,0,'1'),null);assert.equal(M.position(s,s.session.id,0),null);});
test('corrections are impossible before final submission',()=>{const s=start();assert.equal(M.correctAnswer(s,s.session.id,0,s.session.questions[0].answer,parse),null);});
test('recalculating an error preserves the first answer and updates only the correction counter',()=>{let s=M.grade(fill(start(),[0]),start().session.id,parse),first=JSON.stringify(s.session.first);const wrong=M.correctAnswer(s,s.session.id,0,'1',parse);assert(wrong.valid);assert.equal(wrong.correct,false);s=wrong.state;const result=M.correctAnswer(s,s.session.id,0,s.session.questions[0].answer,parse);assert(result.correct);assert.equal(result.state.totals.corrected,1);assert.equal(result.state.totals.correct,7);assert.equal(result.state.totals.attempts,1);assert.equal(JSON.stringify(result.state.session.first),first);assert.equal(M.correctAnswer(result.state,s.session.id,0,s.session.questions[0].answer,parse),null);});
test('malformed correction is not counted as an answer or a new attempt',()=>{const s=M.grade(fill(start(),[0]),start().session.id,parse),r=M.correctAnswer(s,s.session.id,0,'-3',parse);assert.deepEqual(r,{valid:false,error:'negative'});assert.equal(s.totals.corrected,0);});
test('already-correct questions cannot be edited as corrections',()=>{const s=M.grade(fill(start()),start().session.id,parse);assert.equal(M.correctAnswer(s,s.session.id,0,'1',parse),null);});
test('paused drafts, final scores and corrections survive reload',()=>{let s=fill(start(),[0]);assert.deepEqual(M.normalise(JSON.parse(JSON.stringify(s))),s);s=M.grade(s,s.session.id,parse);s=M.correctAnswer(s,s.session.id,0,s.session.questions[0].answer,parse).state;assert.deepEqual(M.normalise(JSON.parse(JSON.stringify(s))),s);});
test('starting another test keeps completed totals and rejects stale events',()=>{let s=M.grade(fill(start()),start().session.id,parse);const old=s.session.id;s=M.begin(s,'square',5,99,now+100);assert.equal(s.totals.attempts,1);assert.equal(s.session.first,null);assert.equal(M.saveAnswer(s,old,0,'123'),null);assert.equal(M.grade(s,old,parse),null);});
test('corrupt questions or first-score data discard the session but keep valid totals',()=>{for(const change of [s=>s.session.questions[0].answer='NaN',s=>s.session.first.score=99,s=>s.session.drafts.pop(),s=>s.session.index=30]){const s=M.grade(fill(start()),start().session.id,parse);change(s);const out=M.normalise(s);assert.equal(out.session,null);assert.equal(out.totals.attempts,1);}});
test('all app distributions include maths test code',()=>{for(const file of ['index.html','sw.js','mobile/scripts/build.mjs','.github/workflows/pages.yml']){const src=fs.readFileSync(__dirname+'/../'+file,'utf8');for(const name of ['math-test-core.js','math-test-ui.js'])assert(src.includes(name),file+' '+name);}});
test('test UI shows no correctness, answer key or calculation before final grading',()=>{
 const source=fs.readFileSync(__dirname+'/../math-test-ui.js','utf8'),context={window:{ValeMathTestCore:M},document:{querySelector(){return null;}},location:{hash:''},FormData:class{constructor(form){this.form=form;}get(key){return this.form.values?.[key];}},Math};vm.runInNewContext(source,context);
 let state=fill(start(),[0]),html='';const ui=context.window.ValeMathTestUI.create({getState:()=>state,saveState:n=>(state=n,true),lang:()=> 'ru',chapter:id=>B.chapters.find(c=>c.id===id),mathNav:()=>'',tabs:()=>'',shell:out=>html=out,parse});
 ui.render('small','run');assert(!html.includes('С первого раза:'));assert(!html.includes('test-answer-wrong'));assert(!html.includes(state.session.questions[0].calculation));
 ui.handleClick({dataset:{action:'math-test-move',session:state.session.id,index:'8'}});assert(html.includes('Проверить весь тест'));assert(!html.includes('test-answer-correct'));assert(!html.includes('test-answer-wrong'));
 ui.handleClick({dataset:{action:'math-test-grade',session:state.session.id}});assert(html.includes('С первого раза: 7 из 8'));assert(html.includes('Пересчитать'));assert(html.includes('test-answer-wrong'));
});
test('every Start question uses one step, bounded numbers and no mixed units, even at the end',()=>{
 for(let seed=1;seed<=150;seed++)for(const chapter of M.CHAPTERS)for(const q of M.generate(chapter,10,seed,1)){
  const m=q.model;assert(['convert','rectangle','square'].includes(m.kind));
  if(m.kind==='convert'){assert([100,.01].includes(scales[m.from]/scales[m.to]));assert(m.amount<=1500);}
  if(m.kind==='rectangle'){assert(m.a<=6);assert(m.b<=6);}if(m.kind==='square')assert(m.a<=10);
 }
});
test('higher levels include the promised reverse or multi-step problems',()=>{
 for(let seed=1;seed<=50;seed++)for(const chapter of M.CHAPTERS){
  const middle=M.generate(chapter,5,seed,2),hard=M.generate(chapter,5,seed,3);
  assert(middle.some(q=>['combine','missing','mixedRectangle','squareSide','squarePerimeter','squareDm','price'].includes(q.model.kind)),chapter);
  assert(hard.some(q=>['combine','mixedSmall','park','cut','perimeter','tiles','windows','squareDifference','squareTiles','frame','squarePerimeter','price'].includes(q.model.kind)),chapter);
 }
});
test('locked levels cannot be started directly',()=>{for(const chapter of M.CHAPTERS){assert.equal(M.begin(M.fresh(),chapter,5,7,now,2),null);assert.equal(M.begin(M.fresh(),chapter,5,7,now,3),null);}assert.throws(()=>M.generate('small',5,1,4));});
test('five correct answers earn a crystal and unlock the next level in that section only',()=>{
 let s=M.begin(M.fresh(),'small',5,7,now,1);s=M.grade(fill(s),s.session.id,parse);
 assert.equal(M.collection(s),1);assert.deepEqual(s.session.reward,{level:1,newCrystal:true});assert.equal(M.levelProgress(s,'small').unlocked,2);assert.equal(M.levelProgress(s,'small').recommended,2);
 assert.equal(M.levelProgress(s,'large').unlocked,1);assert(M.begin(s,'small',5,8,now+1,2));assert.equal(M.begin(s,'small',5,8,now+1,3),null);
});
test('mistakes earn no crystal until corrected, then give the full reward without changing the first score',()=>{
 let s=M.begin(M.fresh(),'rectangle',5,7,now,1);s=M.grade(fill(s,[0,1]),s.session.id,parse);const first=JSON.stringify(s.session.first);
 assert.equal(M.collection(s),0);assert.equal(s.session.reward,null);assert.equal(M.resolved(s.session),3);
 s=M.correctAnswer(s,s.session.id,0,s.session.questions[0].answer,parse).state;assert.equal(M.collection(s),0);assert.equal(M.resolved(s.session),4);
 s=M.correctAnswer(s,s.session.id,1,s.session.questions[1].answer,parse).state;assert.equal(M.collection(s),1);assert.equal(M.resolved(s.session),5);assert.equal(JSON.stringify(s.session.first),first);assert.equal(s.session.first.score,3);assert.equal(M.levelProgress(s,'rectangle').unlocked,2);
 assert.deepEqual(M.normalise(JSON.parse(JSON.stringify(s))),s);
});
test('replays never duplicate crystals or remove earlier progress and best scores',()=>{
 let s=M.begin(M.fresh(),'small',5,7,now,1);s=M.grade(fill(s),s.session.id,parse);
 s=M.begin(s,'small',10,8,now+1,1);s=M.grade(fill(s),s.session.id,parse);assert.equal(M.collection(s),1);assert.equal(s.session.reward.newCrystal,false);
 s=M.begin(s,'small',5,9,now+2,1);s=M.grade(fill(s,[0]),s.session.id,parse);assert.equal(M.collection(s),1);assert.equal(M.levelProgress(s,'small').unlocked,2);assert.deepEqual(M.levelProgress(s,'small').best[1],{score:5,total:5});
});
test('all three batch lengths earn the same crystal and unlock',()=>{
 for(const size of [5,8,10]){let s=M.begin(M.fresh(),'square',size,7,now,1);s=M.grade(fill(s),s.session.id,parse);assert.equal(M.collection(s),1);assert.equal(M.levelProgress(s,'square').unlocked,2);}
});
test('the full collection contains exactly eighteen permanent crystals',()=>{
 let s=M.fresh();for(const chapter of M.CHAPTERS)for(const level of [1,2,3]){s=M.begin(s,chapter,5,123+level,now+level,level);s=M.grade(fill(s),s.session.id,parse);assert(s.session.reward.newCrystal);}
 assert.equal(M.collection(s),18);for(const chapter of M.CHAPTERS)assert.deepEqual(M.levelProgress(s,chapter).cleared,[1,2,3]);assert.deepEqual(M.normalise(s),s);
});
test('legacy saved tests retain questions and scores without awarding new-level crystals',()=>{
 let s=fill(start(),[0]);delete s.journey;delete s.session.level;delete s.session.reward;const questions=JSON.stringify(s.session.questions);s=M.normalise(s);
 assert.equal(s.session.level,null);assert.equal(JSON.stringify(s.session.questions),questions);s=M.grade(s,s.session.id,parse);s=M.correctAnswer(s,s.session.id,0,s.session.questions[0].answer,parse).state;
 assert.equal(s.session.first.score,7);assert.equal(M.collection(s),0);assert.equal(s.session.reward,null);
});
test('malformed progress cannot unlock disconnected levels or crash migration',()=>{
 const s=M.fresh();s.journey.small={cleared:[3],best:{1:{score:99,total:5}}};s.journey.large={cleared:'123',best:null};const out=M.normalise(s);assert.equal(M.collection(out),0);assert.equal(M.levelProgress(out,'small').unlocked,1);
});
test('all three interface languages expose levels, lock guidance and collection',()=>{
 const source=fs.readFileSync(__dirname+'/../math-test-ui.js','utf8'),context={window:{ValeMathTestCore:M},document:{querySelector(){return null;}},location:{hash:''},FormData:class{constructor(form){this.form=form;}get(key){return this.form.values?.[key];}},Math};vm.runInNewContext(source,context);
 for(const lang of ['ru','sr','en']){let state=M.fresh(),html='';const ui=context.window.ValeMathTestUI.create({getState:()=>state,saveState:n=>(state=n,true),lang:()=>lang,chapter:id=>B.chapters.find(c=>c.id===id),mathNav:()=>'',tabs:()=>'',shell:out=>html=out,parse});
  ui.render('small');assert.equal((html.match(/name="level"/g)||[]).length,3);assert.equal((html.match(/disabled/g)||[]).length,2);assert(!html.includes('undefined'));assert(ui.collectionSummary().includes('18'));assert(ui.statistics().includes('journey-shelf'));
  ui.handleSubmit({id:'math-test-start',dataset:{chapter:'small'},values:{size:'5',level:'2'}});assert.equal(state.session,null);
  ui.handleSubmit({id:'math-test-start',dataset:{chapter:'small'},values:{size:'5',level:'1'}});assert.equal(state.session.level,1);assert.equal(state.session.size,5);
 }
});
console.log(JSON.stringify({status:'PASS',mathTestChecks:passed,generatedSetsChecked:8100,sections:6,levels:3}));
