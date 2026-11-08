const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const B=require('../book.json'),E=require('../english-core.js'),D=require('../english-data.js');
const cases=[];const test=(name,fn)=>cases.push([name,fn]);
const now=1700000000000;
function setup(hash='home',data={}){
 const initial={schemaVersion:1,locale:'ru',size:8,large:false,records:{},session:null,english:E.fresh(),...data};
 const saved=new Map([['vale-study-book-v02',JSON.stringify(initial)]]),events={},app={innerHTML:''},dummy={setAttribute(){},classList:{toggle(){}},style:{}},location={hash:'#'+hash,href:'http://localhost/#'+hash,protocol:'file:'};
 const document={documentElement:{},body:dummy,querySelector:q=>q==='#app'?app:dummy,querySelectorAll:()=>[],addEventListener:(name,fn)=>{(events['document:'+name]||=[]).push(fn);}};
 const window={VALE_BOOK:B,VALE_ENGLISH:D,ValeCore:require('../core.js'),ValeEnglishCore:E,ValeAvatar:{read:()=>''},ValeEnglish:{create:()=>({stopMedia(){},handleClick(){return false;}})},ValeUpdates:{create:()=>({state:()=>({status:'idle'}),inspect(){}})},addEventListener:(name,fn)=>{(events[name]||=[]).push(fn);},scrollTo(){}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/../app.js','utf8'),{window,document,location,localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},navigator:{onLine:true},matchMedia:()=>({matches:false}),URL,setTimeout,clearTimeout,console});
 const go=route=>{location.hash='#'+route;for(const fn of events.hashchange)fn();};
 const click=action=>{const element={dataset:{action}};for(const fn of events['document:click']||[])fn({target:{closest:selector=>selector==='[data-action]'?element:null}});};
 return {html:()=>app.innerHTML,go,click,location,events,saved,state:()=>JSON.parse(saved.get('vale-study-book-v02'))};
}
test('mathematics shows every section even with a paused task',()=>{
 const q=B.tasks.find(q=>q.type!=='measurement'),session={ids:[q.id],index:0,ended:false};const a=setup('home',{session});
 assert(a.html().includes('Продолжить задание'));
 for(const ch of B.chapters){assert(a.html().includes(`href="#chapter/${ch.id}"`));assert(a.html().includes(`href="#chapter/${ch.id}/rules"`));}
 a.click('resume');assert.equal(a.location.hash,'task/'+q.id);a.go('home');assert.equal((a.html().match(/class="contents-section"/g)||[]).length,6);assert.deepEqual(a.state().session,session);
});
test('chapter tasks and rules are separate views with a stable contents link',()=>{
 const ch=B.chapters[0],a=setup('chapter/'+ch.id);assert(a.html().includes('Все задания раздела'));assert(!a.html().includes('<ul class="note-list">'));assert(a.html().includes('☷ Всё содержание'));
 a.go('chapter/'+ch.id+'/rules');assert(a.html().includes('<ul class="note-list">'));assert(!a.html().includes('Все задания раздела'));assert(a.html().includes('aria-current="page">Правила'));
 a.go('home');assert(a.html().includes('class="contents-grid"'));
});
test('browsing contents, rules, statistics and profile preserves both paused sessions and drafts',()=>{
 const q=B.tasks.find(q=>q.type!=='measurement'),english=E.fresh();english.session={ids:[D.words[0].id],index:0,revealed:true,scope:'1'};
 const initial={session:{ids:[q.id],index:0,ended:false},records:{[q.id]:{draft:{values:['123']},attempts:0}},english};
 const a=setup('home',initial);for(const route of ['chapter/'+q.chapter+'/rules','stats','stats/english','profile','home'])a.go(route);
 assert.deepEqual(a.state().session,initial.session);assert.deepEqual(a.state().english,english);assert.deepEqual(a.state().records,initial.records);
});
test('statistics overview includes both subjects and no data management controls',()=>{
 const a=setup('stats');assert(a.html().includes('data-stat-subject="math"'));assert(a.html().includes('data-stat-subject="english"'));assert(a.html().includes('Решено 0 из 149 заданий'));assert(a.html().includes('Изучалось 0 из 156 слов'));assert(!a.html().includes('data-action="export"'));assert(!a.html().includes('data-setting='));
 a.go('parent');assert(a.html().includes('data-stat-subject="english"'));
});
test('English results include custom words and repeated reviews without counting orphan records',()=>{
 const english=E.fresh(),w=D.words[0];english.customWords=[{id:'custom-1',en:'leaf',ru:'лист',sr:'лист',audio:'',unit:'custom'}];
 english.records={[w.id]:{stage:3,reviews:4,last:now,due:now},'custom-1':{stage:0,reviews:2,last:now,due:now+1},orphan:{stage:5,reviews:99,last:now,due:now}};
 const result=E.progress([...D.words,...english.customWords],english,now);
 assert.deepEqual(result,{total:157,new:155,due:1,later:1,learned:1,seen:2,reviews:6});
 const a=setup('stats/english',{english});assert(a.html().includes('<b>6</b><span>Повторений слов'));assert(a.html().includes('Мои слова'));assert(a.html().includes('самооценка'));assert(!a.html().includes('Первые самостоятельные ответы'));
});
test('mathematics keeps first-answer evidence separate from measurements and English',()=>{
 const q=B.tasks.find(q=>q.type!=='measurement'),measure=B.tasks.find(q=>q.type==='measurement');
 const records={[q.id]:{solved:true,first:{correct:true,assisted:false}},[measure.id]:{measureChecked:true,first:{correct:true,assisted:false}}};
 const a=setup('stats/math',{records});assert(a.html().includes('Первые самостоятельные ответы: 1 / 1'));assert(!a.html().includes('Повторений слов'));
});
test('avatar opens photo followed by settings and data; old update links still work',()=>{
 const a=setup('profile'),html=a.html();assert(html.indexOf('Твоя фотография')<html.indexOf('class="panel profile-settings"'));assert(html.indexOf('class="panel profile-settings"')<html.indexOf('id="profile-data"'));assert(html.includes('data-action="export"'));assert(html.includes('data-setting="size"'));assert(html.includes('data-action="update"'));assert(html.includes('data-action="reset"'));assert(!html.includes('href="#parent"'));
 a.go('updates');assert(a.html().includes('Профиль и настройки'));assert(a.html().includes('id="profile-data"'));
});
test('task view exposes all contents without changing the active session',()=>{
 const q=B.tasks.find(q=>q.type==='numeric'),session={ids:[q.id],index:0,ended:false};const a=setup('task/'+q.id,{session});assert(a.html().includes('☷ Всё содержание'));assert(a.html().includes('data-action="rule"'));assert.deepEqual(a.state().session,session);
});
test('legacy topic and rules routes lead to the complete topic contents',()=>{
 const a=setup('math/area/rules');assert.equal((a.html().match(/class="contents-section"/g)||[]).length,6);a.go('rules');assert(a.html().includes('☷ Всё содержание'));
});
test('subject navigation and settings are translated in all three languages',()=>{
 for(const [locale,statistics,profile]of [['ru','Статистика','Профиль и настройки'],['sr','Статистика','Профил и подешавања'],['en','Statistics','Profile and settings']]){const a=setup('profile',{locale});assert(a.html().includes(statistics));assert(a.html().includes(profile));assert(!a.html().includes('For a parent'));assert(!a.html().includes('Для родителя'));}
});
for(const [name,fn]of cases){try{fn();}catch(error){throw Error(name,{cause:error});}}
console.log(JSON.stringify({status:'PASS',navigationTests:cases.length}));
