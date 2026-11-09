const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const X=require('../expedition-core.js'),N=require('../nature-core.js'),ND=require('../nature-data.js');
const E=require('../english-core.js'),ED=require('../english-data.js'),M=require('../math-test-core.js'),G=require('../garden-core.js'),B=require('../book.json');
const STORE='vale-study-book-v02',cases=[];
const test=(name,fn)=>cases.push([name,fn]);
const copy=v=>JSON.parse(JSON.stringify(v));
function setup(route='nature/expedition',data={},savedInput){
 const initial={schemaVersion:1,locale:'ru',size:8,large:false,records:{},session:null,english:E.fresh(),nature:N.fresh(),...data};
 const saved=savedInput||new Map([[STORE,JSON.stringify(initial)]]),events={},app={innerHTML:''};let failure=false,currentHash='#'+route,lastHash=currentHash;
 const noop=()=>{},dummy={setAttribute:noop,removeAttribute:noop,focus:noop,remove:noop,scrollIntoView:noop,querySelectorAll:()=>[],classList:{toggle:noop,remove:noop},style:{}};
 const location={href:'http://localhost/#'+route,protocol:'file:'};Object.defineProperty(location,'hash',{get:()=>currentHash,set:v=>{currentHash='#'+String(v).replace(/^#/,'');}});
 const document={documentElement:{},body:dummy,querySelector:q=>q==='#app'?app:dummy,querySelectorAll:()=>[],addEventListener:(name,fn)=>(events['document:'+name]||=[]).push(fn)};
 const window={VALE_NATURE:ND,ValeNatureCore:N,ValeExpeditionCore:X,ValeGardenCore:G,VALE_BOOK:B,VALE_ENGLISH:ED,ValeMathTestCore:M,ValeCore:require('../core.js'),ValeEnglishCore:E,ValeAvatar:{read:()=>''},ValeEnglish:{create:()=>({stopMedia:noop,handleClick:()=>false})},ValeUpdates:{create:()=>({state:()=>({status:'idle'}),inspect:noop})},addEventListener:(name,fn)=>(events[name]||=[]).push(fn),scrollTo:noop};
 const context=vm.createContext({window,document,location,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>{if(failure)throw Error('Storage full');saved.set(k,v);}},navigator:{onLine:true},matchMedia:()=>({matches:false}),URL,setTimeout:()=>1,clearTimeout:noop,console});
 for(const file of ['expedition-data.js','expedition-map.js','math-test-ui.js','garden-ui.js','nature-ui.js','expedition-ui.js','app.js'])vm.runInContext(fs.readFileSync(__dirname+'/../'+file,'utf8'),context,{filename:file});
 async function dispatch(name,event){for(const fn of events[name]||[])await fn(event);}
 async function flush(){for(let i=0;i<5&&currentHash!==lastHash;i++){lastHash=currentHash;await dispatch('hashchange');}}
 async function go(path){location.hash=path;lastHash=currentHash;await dispatch('hashchange');await flush();}
 async function click(action,dataset={}){const element={dataset:{action,...dataset}};await dispatch('document:click',{target:{closest:selector=>selector==='[data-action]'?element:null}});await flush();}
 async function locale(lang){const element={dataset:{lang}};await dispatch('document:click',{target:{closest:selector=>selector==='[data-lang]'?element:null}});await flush();}
 async function input(key,value){const target={dataset:{expInput:key},value,type:'text',matches:()=>false,removeAttribute:noop};await dispatch('document:input',{target});await flush();}
 async function sourceInput(value){const target={dataset:{natureField:'f0'},value,type:'text',matches:()=>false,removeAttribute:noop};await dispatch('document:input',{target});await flush();}
 async function submit(id){let prevented=false;await dispatch('document:submit',{target:{id},preventDefault:()=>{prevented=true;}});await flush();assert(prevented,'form submission is handled');}
 async function change(key,value){await dispatch('document:change',{target:{dataset:{expSetting:key},checked:value,matches:()=>false}});await flush();}
 return {html:()=>app.innerHTML,go,click,locale,input,sourceInput,submit,change,state:()=>JSON.parse(saved.get(STORE)),saved,fail:v=>{failure=v;},route:()=>currentHash,texts:window.VALE_EXPEDITION.texts,flush};
}
async function revealAndDesign(a){await a.go('nature/expedition/answer');await a.click('exp-hint',{level:'1'});await a.click('exp-hint',{level:'2'});assert.equal(a.route(),'#nature/expedition/explanation');await a.click('exp-next',{scene:'note'});await a.click('exp-next',{scene:'design'});}
test('new subject navigation exposes both modes and empty atlas without manufacturing progress',async()=>{
 const a=setup('nature');assert(a.html().includes('href="#nature/expedition"'));assert.equal((a.html().match(/class="chapter"/g)||[]).length,19);await a.go('nature/expedition');assert(a.html().includes(a.texts.episodeTitle.ru));await a.go('nature/expedition/atlas');assert(a.html().includes(a.texts.atlasEmpty.ru));assert.equal(a.state().expedition?.awarded||false,false);assert.equal(a.state().nature.records['p16-6'],undefined);
});
test('complete helped story saves optional shared note, authored postcard and separate shelf',async()=>{
 const a=setup();await a.click('exp-next',{scene:'letter'});await a.click('exp-next',{scene:'map'});await a.click('exp-next',{scene:'answer'});await a.click('exp-hint',{level:'1'});assert(a.html().includes(a.texts.hintOne.ru));await a.click('exp-hint',{level:'2'});assert(a.html().includes(a.texts.explanation.ru));assert.equal(a.state().nature.records['p16-6'],undefined);
 await a.click('exp-next',{scene:'note'});await a.input('note','Река помогает перевозить грузы.');await a.submit('exp-note-form');assert.equal(a.route(),'#nature/expedition/design');await a.input('title','Моя речная открытка');await a.click('exp-design',{key:'paper',value:'2'});await a.click('exp-design',{key:'frame',value:'stamps'});await a.click('exp-design',{key:'pattern',value:'custom'});await a.click('exp-ink',{value:'3'});await a.click('exp-pixel',{index:'7'});await a.click('exp-finish');
 const s=a.state();assert.equal(a.route(),'#nature/expedition/atlas');assert.equal(s.expedition.awarded,true);assert.equal(s.expedition.postcard.pixels[7],3);assert.equal(s.expedition.postcard.title,'Моя речная открытка');assert.equal(s.nature.records['p15-3'].draft.f0,'Река помогает перевозить грузы.');assert.equal(s.nature.records['p15-3'].checked,null);assert(a.html().includes(a.texts.statsAssisted.ru));
 await a.go('garden');assert(a.html().includes(a.texts.shelfTitle.ru));await a.click('exp-select',{item:'boat'});await a.click('exp-place',{slot:'0'});await a.click('exp-select',{item:'postcard'});await a.click('exp-place',{slot:'1'});assert.deepEqual(a.state().expedition.shelf,[{id:'boat',slot:0},{id:'postcard',slot:1}]);assert.equal(a.state().garden.placements[0].id,'fern');
 await a.go('nature/task/p15-3');assert(a.html().includes('Река помогает перевозить грузы.'));await a.go('stats/nature');assert(a.html().includes(a.texts.statsAssisted.ru));assert(a.html().includes(a.texts.statsNote.ru));
});
test('first wrong answer and later helped correction stay shared with the ordinary exercise',async()=>{
 const a=setup('nature/expedition/answer');await a.input('answer','Сава');await a.submit('exp-answer-form');assert(a.html().includes(a.texts.incorrect.ru));assert.equal(a.state().nature.records['p16-6'].first.correct,false);assert.equal(a.state().expedition.first.correct,false);
 await a.click('exp-hint',{level:'1'});await a.input('answer','Дунай');await a.submit('exp-answer-form');assert(a.html().includes(a.texts.correctAfterHelp.ru));const r=a.state().nature.records['p16-6'];assert.equal(r.first.correct,false);assert.equal(r.attempts,2);assert.equal(r.completed,'auto');assert.equal(X.status(a.state().expedition,a.state().nature,ND).corrected,true);
 await a.submit('exp-answer-form');assert.equal(a.state().nature.records['p16-6'].attempts,2);await a.go('nature/task/p16-6');assert(a.html().includes('value="Дунай"'));await a.go('nature/expedition/answer');assert.equal(a.state().nature.records['p16-6'].attempts,2);
});
test('ordinary workbook answer is reused as a legacy result without forced regrading',async()=>{
 const a=setup('nature/task/p16-6');await a.sourceInput('Danube');await a.submit('nature-answer-form');const attempts=a.state().nature.records['p16-6'].attempts;assert.equal(attempts,1);
 await a.go('nature/expedition/answer');assert(a.html().includes(a.texts.existingAnswer.ru));await a.click('exp-next',{scene:'explanation'});assert(a.html().includes(a.texts.existingUnknown.ru));await a.click('exp-next',{scene:'design'});await a.click('exp-finish');assert.equal(a.state().expedition.awarded,true);assert.equal(a.state().nature.records['p16-6'].attempts,attempts);assert.equal(a.state().expedition.first,null);
});
test('unfinished deep links and forged finish clicks cannot unlock a reward',async()=>{
 for(const route of ['explanation','note','design']){const a=setup('nature/expedition/'+route);await a.flush();assert.equal(a.route(),'#nature/expedition/answer');assert(a.html().includes('id="exp-answer-form"'));await a.click('exp-finish');assert.equal(a.state().expedition.awarded,false);}
});
test('locale switching preserves authored title, note, answer and mosaic; render uses localized text',async()=>{
 const a=setup('nature/expedition/answer');await a.input('answer','Дунай');await a.submit('exp-answer-form');await a.click('exp-next',{scene:'explanation'});await a.click('exp-next',{scene:'note'});await a.input('note','Моя заметка о водe');await a.click('exp-next',{scene:'design'});await a.input('title','Моя river прича');await a.click('exp-design',{key:'pattern',value:'custom'});await a.click('exp-ink',{value:'4'});await a.click('exp-pixel',{index:'35'});const before=copy(a.state());
 for(const locale of ['en','sr','ru']){await a.locale(locale);assert(a.html().includes(a.texts.designTitle[locale]));assert(a.html().includes('value="Моя river прича"'));assert.deepEqual(a.state().expedition.postcard,before.expedition.postcard);assert.deepEqual(a.state().nature,before.nature);}
 await a.click('exp-finish');await a.go('garden');await a.click('exp-select',{item:'postcard'});await a.click('exp-place',{slot:'2'});const restored=setup('garden',{},new Map(a.saved));assert.deepEqual(restored.state().expedition,a.state().expedition);assert(restored.html().includes('Моя river прича'));
});
test('complete replay and page editing retain one reward and original completion time',async()=>{
 const a=setup();await revealAndDesign(a);await a.click('exp-finish');const finished=a.state().expedition.finishedAt;await a.click('exp-next',{scene:'design'});await a.input('title','Вторая рамка той же открытки');await a.click('exp-finish');assert.equal(a.state().expedition.finishedAt,finished);assert.equal(a.state().expedition.awarded,true);await a.go('garden');await a.click('exp-place',{slot:'0'});await a.click('exp-place',{slot:'2'});assert.deepEqual(a.state().expedition.shelf,[{id:'boat',slot:2}]);await a.click('exp-remove',{item:'boat'});assert.deepEqual(a.state().expedition.shelf,[]);assert.equal(a.state().expedition.awarded,true);
});
test('expedition never changes paused maths, English or the mathematical garden collection',async()=>{
 const english=E.fresh();english.session={ids:[ED.words[0].id],index:0,revealed:true,scope:'1'};const mathTests=M.fresh();mathTests.journey.small.cleared=[1];let garden=G.place(G.fresh(),'daisy',0,1);garden=G.decorate(garden,'daisy',{base:3,pattern:'stripes',pixels:Array(36).fill(-1)},1);const records={[B.tasks[0].id]:{draft:{values:['123']},attempts:0}},session={ids:[B.tasks[0].id],index:0,ended:false};
 const a=setup('nature/expedition',{english,mathTests,garden,records,session});await revealAndDesign(a);await a.click('exp-finish');await a.go('garden');await a.click('exp-place',{slot:'0'});const state=a.state();assert.deepEqual(state.english,english);assert.deepEqual(state.mathTests,mathTests);assert.deepEqual(state.garden,garden);assert.deepEqual(state.records,records);assert.deepEqual(state.session,session);
});
test('all scene states render in all three languages without raw fallback keys',async()=>{
 for(const locale of ['ru','sr','en']){
  const expedition=X.finish(X.hint(X.fresh(),2),N.fresh(),ND);const a=setup('nature/expedition',{locale,expedition});
  for(const scene of ['','letter','map','answer','explanation','note','design','atlas']){await a.go('nature/expedition'+(scene?'/'+scene:''));const html=a.html();assert(!html.includes('undefined'));assert(!html.includes('[object Object]'));for(const [key,translations]of Object.entries(a.texts)){if(translations[locale]!==key)assert(!html.includes('>'+key+'<'),'raw text key '+locale+'/'+scene+'/'+key);}assert(html.includes(a.texts.expedition[locale]));}
  await a.click('exp-design',{key:'pattern',value:'custom'});await a.go('nature/expedition/design');assert(a.html().includes(a.texts.patternCustom[locale]));await a.go('garden');assert(a.html().includes(a.texts.shelfTitle[locale]));
 }
});
test('settings and map interactions persist preferences without changing study evidence',async()=>{
 const a=setup('nature/expedition/map');const before=copy(a.state().nature);await a.click('exp-map-expand');await a.click('exp-zoom',{value:'2'});await a.click('exp-river',{river:'sava'});assert(a.html().includes('width:200%'));assert(a.html().includes('aria-pressed="true"'));await a.change('bird',false);await a.change('motion',false);await a.input('birdName','Парус');await a.click('exp-cover',{value:'2'});assert.equal(a.state().expedition.bird,false);assert.equal(a.state().expedition.motion,false);assert.equal(a.state().expedition.cover,2);assert.equal(a.state().expedition.birdName,'Парус');assert.deepEqual(a.state().nature,before);
});
test('failed saves retain title and pixels in the UI until an explicit successful retry',async()=>{
 const a=setup();await revealAndDesign(a);await a.click('exp-design',{key:'pattern',value:'custom'});const persisted=copy(a.state());a.fail(true);await a.input('title','Не потеряй мою открытку');await a.click('exp-ink',{value:'2'});await a.click('exp-pixel',{index:'8'});assert.deepEqual(a.state(),persisted);assert(a.html().includes('value="Не потеряй мою открытку"'));assert(a.html().includes(a.texts.saveError.ru));assert(a.html().includes('data-action="exp-retry-save"'));assert(a.html().includes('--pixel:'+X.COLORS[2]));a.fail(false);await a.click('exp-retry-save');assert.equal(a.state().expedition.postcard.title,'Не потеряй мою открытку');assert.equal(a.state().expedition.postcard.pixels[8],2);assert(!a.html().includes('data-action="exp-retry-save"'));await a.click('exp-finish');assert.equal(a.state().expedition.awarded,true);
});
test('failed source draft save remains transient and can be atomically retried',async()=>{
 const a=setup('nature/expedition/answer');const original=copy(a.state());a.fail(true);await a.input('answer','Дунай');await a.submit('exp-answer-form');assert.deepEqual(a.state(),original);assert(a.html().includes('value="Дунай"'));assert(a.html().includes(a.texts.saveError.ru));a.fail(false);await a.click('exp-retry-save');assert.equal(a.state().nature.records['p16-6'].draft.f0,'Дунай');assert.equal(a.state().nature.records['p16-6'].completed,'auto');assert.equal(a.state().expedition.first.correct,true);
});
test('retry of a failed final save restores the atlas transition as well as the award',async()=>{
 const a=setup();await revealAndDesign(a);await a.input('title','Готовая история');a.fail(true);await a.click('exp-finish');assert.equal(a.route(),'#nature/expedition/design');assert.equal(a.state().expedition.awarded,false);assert(a.html().includes(a.texts.saveError.ru));a.fail(false);await a.click('exp-retry-save');assert.equal(a.route(),'#nature/expedition/atlas');assert.equal(a.state().expedition.scene,'atlas');assert.equal(a.state().expedition.awarded,true);assert(a.html().includes('Готовая история'));
});
test('pending expedition retry merges with newly saved unrelated workbook work',async()=>{
 const a=setup('nature/expedition/answer');a.fail(true);await a.input('answer','Danube');await a.submit('exp-answer-form');a.fail(false);await a.go('nature/task/p29-5');await a.sourceInput('Отдельная работа в тетради');assert.equal(a.state().nature.records['p29-5'].draft.f0,'Отдельная работа в тетради');await a.go('nature/expedition/answer');await a.click('exp-retry-save');assert.equal(a.state().nature.records['p16-6'].completed,'auto');assert.equal(a.state().nature.records['p29-5'].draft.f0,'Отдельная работа в тетради');assert.equal(a.state().expedition.first.correct,true);
});
(async()=>{for(const [name,fn]of cases){try{await fn();}catch(error){throw Error(name,{cause:error});}}console.log(JSON.stringify({status:'PASS',expeditionIntegrationTests:cases.length}));})().catch(error=>{console.error(error);process.exitCode=1;});
