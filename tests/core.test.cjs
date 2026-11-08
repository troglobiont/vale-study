const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const dir=path.resolve(__dirname,'..');
const C=require(path.join(dir,'core.js'));
const book=JSON.parse(fs.readFileSync(path.join(dir,'book.json'),'utf8'));
let passed=0;
function test(name,fn){fn();passed++;}
test('parser accepts exact integers and permitted groups',()=>{
 for(const [raw,val]of [['0','0'],['0007','7'],[' 1 200 ','1200'],['1\u00a0200','1200'],['1\u202f200','1200'],['1000000000000000000','1000000000000000000']])assert.equal(C.parseInteger(raw).value,val);
});
test('parser rejects whole invalid strings',()=>{
 for(const raw of ['', '   ','-1','−1','+1','2.0','2,0','12 00','1  200','1\t200','1\n200','3cm²','1e3','3abc','NaN','1/2','١٢','1\u200b200','1000000000000000001','0'.repeat(65)])assert.equal(C.parseInteger(raw).ok,false,raw);
});
test('content is fixed, translated and source-linked',()=>{
 assert.equal(book.generatedExercises,0);assert.equal(book.tasks.length,151);
 assert.equal(new Set(book.tasks.map(x=>x.id)).size,151);
 for(const q of book.tasks){assert.deepEqual(Object.keys(q.prompt).sort(),['en','ru','sr']);for(const l of ['ru','sr','en'])assert.ok(q.prompt[l]);assert.ok(fs.existsSync(path.join(dir,q.source)));}
});
let auto=0;
for(const q of book.tasks){
 if(q.type==='measurement')continue;
 let d={values:q.fields.map(x=>x.answer)};
 if(q.type==='choice')d={choice:q.answer};
 if(q.type==='match')d={matches:q.answers};
 if(q.type==='sort')d={order:q.answer};
 if(q.leadChoice)d.choice=q.leadChoice.answer;
 test(q.id+' accepts exact complete answer',()=>{const out=C.check(q,d);assert.equal(out.valid,true);assert.equal(out.correct,true);});auto++;
 test(q.id+' rejects empty submission without math result',()=>assert.equal(C.check(q,{}).valid,false));
 test(q.id+' does not accept an altered answer',()=>{
  const wrong=JSON.parse(JSON.stringify(d));
  if(q.type==='numeric')wrong.values[0]=(BigInt(wrong.values[0])+1n).toString();
  if(q.type==='choice')wrong.choice=q.options.find(x=>x.id!==q.answer).id;
  if(q.type==='match')wrong.matches[0]=String((Number(wrong.matches[0])+1)%q.right.length);
  if(q.type==='sort')[wrong.order[0],wrong.order[1]]=[wrong.order[1],wrong.order[0]];
  const out=C.check(q,wrong);assert.equal(out.valid,true);assert.equal(out.correct,false);
 });
}
const q=book.tasks.find(x=>x.id==='p10-w1.1');
test('format errors do not create first answer',()=>{
 const r={help:0,attempts:0},bad=C.check(q,{values:['1e4']});
 const out=C.apply(r,bad);assert.equal(out.changed,false);assert.equal(out.record.first,undefined);assert.equal(out.record.attempts,0);
});
test('wrong, duplicate and corrected answers preserve original first',()=>{
 const wrong=C.check(q,{values:['1000']});let out=C.apply({help:0},wrong);assert.equal(out.record.first.correct,false);assert.equal(out.record.attempts,1);
 const dup=C.apply(out.record,wrong);assert.equal(dup.changed,false);assert.equal(dup.record.attempts,1);
 const correct=C.check(q,{values:['10 000']});out=C.apply(out.record,correct);assert.equal(out.record.first.correct,false);assert.equal(out.record.lastOutcome,'corrected');assert.equal(out.record.solved,true);
 const again=C.apply(out.record,correct);assert.equal(again.changed,false);assert.equal(again.record.attempts,2);
});
test('hint before first answer is not independent',()=>{const out=C.apply({help:1},C.check(q,{values:['10000']}));assert.equal(out.record.first.assisted,true);assert.equal(out.record.lastOutcome,'helped');});
test('revealed task cannot be scored by copying the answer',()=>{const r={locked:true,originalOutcome:'revealed',help:2};assert.equal(C.apply(r,C.check(q,{values:['10000']})).changed,false);assert.equal(r.first,undefined);});
test('review after revealed answer cannot create a first independent answer',()=>{const r={locked:false,originalOutcome:'revealed',help:0,everHelp:true};const out=C.apply(r,C.check(q,{values:['10000']}));assert.equal(out.record.solved,true);assert.equal(out.record.first,undefined);});
test('help from an earlier visit is retained for the original first answer',()=>{const out=C.apply({help:0,everHelp:true},C.check(q,{values:['10000']}));assert.equal(out.record.first.assisted,true);});
test('measurement calculation is exact but distinct from scored tasks',()=>{
 const s=book.tasks.find(x=>x.id==='p20-2');assert.equal(C.check(s,{values:['30','900']}).valid,false);
 assert.equal(C.measurement(s,['30','900']).correct,true);assert.equal(C.measurement(s,['30','90']).correct,false);
 assert.equal(C.measurement(s,['0','0']).valid,false);
 const r=book.tasks.find(x=>x.id==='p17-4');assert.equal(C.measurement(r,['40','30','20','50','1200','1000','200']).correct,true);
});
test('larger source numbers remain exact',()=>{
 const f=book.tasks.find(x=>x.id==='p11-7.d');assert.equal(f.fields[0].answer,'400000000');assert.equal(f.fields[1].answer,'398000000');
 const g=book.tasks.find(x=>x.id==='p26-7');assert.equal(g.left.length,5);
});
const result={status:'PASS',tests:passed,autoCheckedTasks:auto,unverifiedMeasurements:2,numericFields:book.tasks.reduce((a,t)=>a+t.fields.length,0)};
fs.writeFileSync(path.join(__dirname,'core_test_result.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
