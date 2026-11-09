const assert=require('node:assert/strict');
const E=require('../expedition-core.js'),N=require('../nature-core.js'),D=require('../nature-data.js');
let checks=0;const test=(name,fn)=>{try{fn();checks++;}catch(e){throw Error(name,{cause:e});}};
const copy=v=>JSON.parse(JSON.stringify(v));
test('legacy saves gain independent defaults without sharing arrays',()=>{const a=E.fresh(),b=E.fresh();a.postcard.pixels[0]=2;assert.equal(b.postcard.pixels[0],-1);assert.deepEqual(E.normalise(null),b);assert.deepEqual(E.normalise({schemaVersion:2,awarded:true}),b);});
test('malformed data is bounded and unknown shelf objects removed',()=>{
 const a=E.normalise({schemaVersion:1,scene:'bad',help:99,birdName:'a'.repeat(100),cover:9,postcard:{title:'b'.repeat(300),paper:-1,frame:'bad',pixels:[8]},awarded:true,shelf:[{id:'boat',slot:0},{id:'postcard',slot:0},{id:'boat',slot:2},{id:'evil',slot:1}]});
 assert.equal(a.scene,'letter');assert.equal(a.help,0);assert.equal(a.birdName.length,30);assert.equal(a.postcard.title.length,80);assert.equal(a.postcard.paper,0);assert.equal(a.postcard.pixels.length,36);assert.deepEqual(a.shelf,[{id:'boat',slot:0}]);
});
test('cannot jump to completion, notes or design before an answer or explicit reveal',()=>{
 const s=E.fresh(),n=N.fresh();assert.equal(E.finish(s,n,D),null);assert.equal(E.move(s,'design',n,D).scene,'answer');assert.equal(E.move(s,'note',n,D).scene,'answer');assert.equal(E.move(s,'explanation',n,D).scene,'answer');assert.equal(E.move(s,'atlas',n,D).scene,'atlas');assert.equal(E.explanation(s,n,D).explanationSeen,false);
});
test('empty answer is not a scored attempt',()=>{
 const a=E.answer(E.fresh(),N.fresh(),D,' ',1);assert.equal(a.result.valid,false);assert.equal(a.expedition.first,null);assert.equal(a.nature.records[E.TASK].attempts,0);
});
test('correct answer uses shared nature checking and preserves immutability',()=>{
 const e=E.fresh(),n=N.fresh(),before=copy(e),a=E.answer(e,n,D,'Дунай',10);assert.equal(a.result.correct,true);assert.equal(a.nature.records[E.TASK].completed,'auto');assert.deepEqual(a.expedition.first,{correct:true,assisted:false});assert.deepEqual(e,before);assert.equal(n.records[E.TASK],undefined);assert.equal(E.status(a.expedition,a.nature,D).canFinish,false);
 const explained=E.explanation(a.expedition,a.nature,D),done=E.finish(explained,a.nature,D,20);assert.equal(done.awarded,true);assert.equal(done.finishedAt,20);assert.equal(done.scene,'atlas');
});
test('all three language aliases use original exercise answers',()=>{for(const answer of ['Дунав','Дунавом','Danube','Дунай'])assert.equal(E.answer(E.fresh(),N.fresh(),D,answer).result.correct,true);});
test('repeat submit of unchanged correct or wrong answer does not add attempts',()=>{
 for(const value of ['Дунай','Сава']){const a=E.answer(E.fresh(),N.fresh(),D,value,1),b=E.answer(a.expedition,a.nature,D,value,2);assert.equal(b.nature.records[E.TASK].attempts,1);assert.deepEqual(b.expedition.first,a.expedition.first);}
});
test('wrong then hint then correct retains both first answers and records assistance',()=>{
 const a=E.answer(E.fresh(),N.fresh(),D,'Сава',1),nfirst=copy(a.nature.records[E.TASK].first),efirst=copy(a.expedition.first);
 const b=E.answer(E.hint(a.expedition,1),a.nature,D,'Danube',2),s=E.status(b.expedition,b.nature,D);
 assert.equal(s.solved,true);assert.equal(s.assisted,true);assert.equal(s.corrected,true);assert.equal(b.nature.records[E.TASK].attempts,2);assert.deepEqual(b.nature.records[E.TASK].first,nfirst);assert.deepEqual(b.expedition.first,efirst);
});
test('first hint marks help without revealing or claiming a solved exercise',()=>{
 const a=E.hint(E.fresh(),1),n=N.fresh();assert.equal(a.help,1);assert.equal(a.explanationSeen,false);assert.equal(E.status(a,n,D).solved,false);assert.equal(E.finish(a,n,D),null);
 const b=E.answer(a,n,D,'Дунай');assert.equal(b.expedition.first.assisted,true);
});
test('explicit reveal permits story completion without a fake correct nature answer',()=>{
 const n=N.fresh(),a=E.hint(E.fresh(),2);assert.equal(a.scene,'explanation');assert.equal(a.explanationSeen,true);assert.deepEqual(n,N.fresh());assert.deepEqual(E.status(a,n,D),{solved:false,legacy:false,assisted:true,corrected:false,canFinish:true});assert.equal(E.finish(a,n,D,3).awarded,true);assert.equal(n.records[E.TASK],undefined);assert.equal(E.hint(a,1).help,2);
});
test('old correct result is accepted with unknown assistance and no compulsory resubmission',()=>{
 const q=E.task(D),n=N.submit(N.draft(N.fresh(),q,'f0','Дунай',1),q,2).state,e=E.fresh();
 assert.equal(E.status(e,n,D).legacy,true);const x=E.explanation(e,n,D);assert.equal(E.finish(x,n,D,3).awarded,true);assert.equal(n.records[E.TASK].attempts,1);
 const repeated=E.answer(e,n,D,'Дунай',4);assert.equal(repeated.expedition.first,null);assert.equal(repeated.nature.records[E.TASK].attempts,1);assert.equal(E.status(repeated.expedition,repeated.nature,D).legacy,true);
});
test('workbook first error remains visible after a first expedition success',()=>{
 const q=E.task(D);let n=N.submit(N.draft(N.fresh(),q,'f0','Сава',1),q,2).state;const a=E.answer(E.fresh(),n,D,'Дунай',3);assert.equal(E.status(a.expedition,a.nature,D).corrected,true);assert.equal(a.nature.records[E.TASK].first.correct,false);
});
test('optional note changes shared draft without automatic grading',()=>{
 const e=E.hint(E.fresh(),2),n=N.fresh(),a=E.note(e,n,D,'Реки дают людям воду.',4),r=a.nature.records[E.NOTE];assert.equal(r.draft.f0,'Реки дают людям воду.');assert.equal(r.attempts,0);assert.equal(r.first,null);assert.equal(r.completed,null);assert.equal(r.checked,null);assert.equal(E.finish(a.expedition,a.nature,D).awarded,true);assert.equal(n.records[E.NOTE],undefined);
 assert.equal(E.note(a.expedition,a.nature,D,r.draft.f0,5).nature,a.nature);
});
test('postcard choices and child title survive normalization and independent locale changes',()=>{
 const pixels=Array(36).fill(-1);pixels[4]=2;const a=E.design(E.fresh(),{title:'Мой river бродић',paper:2,frame:'stamps',pattern:'custom',pixels});pixels[4]=5;assert.equal(a.postcard.pixels[4],2);assert.deepEqual(E.normalise(copy(a)).postcard,a.postcard);
 const b=E.design(a,{paper:99,frame:'unknown',pixels:[100]});assert.deepEqual(b.postcard,a.postcard);
});
test('finish is idempotent and a later incorrect answer never revokes the collection',()=>{
 const n=N.fresh(),a=E.finish(E.hint(E.fresh(),2),n,D,100),b=E.finish(a,n,D,900);assert.equal(b.finishedAt,100);assert.equal(b.awarded,true);const c=E.answer(b,n,D,'Сава',950);assert.equal(c.expedition.awarded,true);assert.equal(E.status(c.expedition,c.nature,D).canFinish,true);
});
test('shelf does not exist before award and rejects unknown items and slots',()=>{
 assert.equal(E.place(E.fresh(),'boat',0),null);const e=E.finish(E.hint(E.fresh(),2),N.fresh(),D);assert.equal(E.place(e,'fern',0),null);assert.equal(E.place(e,'boat',3),null);assert.equal(E.place(e,'boat',NaN),null);assert.equal(E.remove(e,'boat'),null);
});
test('shelf moves, swaps and collection return work without mathematical unlocks',()=>{
 let e=E.finish(E.hint(E.fresh(),2),N.fresh(),D,1);e=E.place(e,'boat',0);e=E.place(e,'postcard',1);const before=copy(e);const swapped=E.place(e,'boat',1);assert.deepEqual(swapped.shelf,[{id:'postcard',slot:0},{id:'boat',slot:1}]);assert.deepEqual(e,before);const moved=E.place(swapped,'boat',2);assert.deepEqual(moved.shelf,[{id:'postcard',slot:0},{id:'boat',slot:2}]);const removed=E.remove(moved,'boat');assert.deepEqual(removed.shelf,[{id:'postcard',slot:0}]);assert.equal(removed.awarded,true);
});
test('settings are validated and preserve personal text',()=>{
 let s=E.set(E.fresh(),'bird',false);s=E.set(s,'motion',false);s=E.set(s,'birdName','Капитан');s=E.set(s,'cover',2);assert.equal(s.bird,false);assert.equal(s.motion,false);assert.equal(s.birdName,'Капитан');assert.equal(s.cover,2);assert.deepEqual(E.set(s,'awarded',true),s);assert.deepEqual(E.set(s,'cover',9),s);
});
test('missing source exercise is a valid failure without manufacturing progress',()=>{
 const n=N.fresh(),e=E.fresh(),a=E.answer(e,n,{tasks:[]},'Danube');assert.equal(a.result.valid,false);assert.equal(a.nature,n);assert.equal(E.status(e,n,{tasks:[]}).solved,false);assert.deepEqual(E.note(e,n,{tasks:[]},'x').nature,n);
});
console.log(JSON.stringify({status:'PASS',expeditionTests:checks}));
