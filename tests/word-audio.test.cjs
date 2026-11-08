const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const D=require('../english-data.js'),C=require('../english-core.js');
const cases=[];const test=(name,fn)=>cases.push([name,fn]);
function setup(play){
 const messages=[],timers=new Map(),buttons=[],status={textContent:'',classList:{toggle(){}}},inline={textContent:'',classList:{toggle(){}}};let time=0;
 const audio={hidden:true,paused:true,src:'',playbackRate:1,play(){this.paused=false;return play?play(this):Promise.resolve();},pause(){this.paused=true;},removeAttribute(key){if(key==='src')this.src='';},load(){}};
 const publisher={...audio};
 const document={querySelector(selector){if(selector==='#english-word-player')return audio;if(selector==='#english-player')return publisher;if(selector.includes('status'))return selector.startsWith('[data-')?inline:status;return null;},querySelectorAll(selector){return selector.includes('english-say')?buttons:selector.includes('data-word-audio-status')?[inline]:[];}};
 const context={window:{VALE_ENGLISH:D,ValeEnglishCore:C},document,setTimeout(fn){timers.set(++time,fn);return time;},clearTimeout(id){timers.delete(id);},URL,console};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../english.js'),'utf8'),context);
 const ui=context.window.ValeEnglish.create({lang:()=> 'ru',getState:()=>C.fresh(),saveState:()=>true,shell(){},toast:msg=>messages.push(msg)});
 const say=(id,slow=false)=>ui.handleClick({dataset:{action:'english-say',id,slow:String(slow)}});
 return {audio,publisher,ui,say,status,inline,messages,timers};
}
test('all textbook words have a real hosted recording',()=>{for(const word of D.words){assert.equal(word.audio,`https://troglobiont.github.io/vale-study/audio/words/${word.id}.m4a`);const bytes=fs.readFileSync(path.join(__dirname,'../audio/words',word.id+'.m4a'));assert(bytes.length>4000);assert.equal(bytes.toString('ascii',4,8),'ftyp');}});
test('bakers search finds both apostrophe spellings',()=>{for(const query of ['bakers',"baker's",'baker’s','BAKERS'])assert(C.searchKey('baker’s булочная пекара').includes(C.searchKey(query)));});
test('Android without SpeechSynthesis still starts the word recording',async()=>{const s=setup();s.say('u3-01');assert.equal(s.audio.src,D.words.find(w=>w.id==='u3-01').audio);assert.equal(s.audio.paused,false);assert.equal(s.publisher.src,'');assert.equal(s.status.textContent,'Загружаю запись…');s.audio.onplaying();assert.equal(s.status.textContent,'Запись воспроизводится');assert.equal(s.timers.size,0);});
test('slow pronunciation uses the same file with preserved pitch',()=>{const s=setup();s.say('u3-01',true);assert.equal(s.audio.playbackRate,.75);assert.equal(s.audio.preservesPitch,true);});
test('blocked playback gives visible feedback instead of silent failure',async()=>{const s=setup(()=>Promise.reject(Error('NotAllowedError')));s.say('u3-01');await Promise.resolve();assert.equal(s.audio.paused,true);assert(s.inline.textContent.includes('Проверь интернет'));assert.equal(s.messages.length,1);});
test('stale playback rejection cannot stop the next word',async()=>{let reject,first=true;const s=setup(()=>{if(first){first=false;return new Promise((_,r)=>reject=r);}return Promise.resolve();});s.say('u3-01');s.say('u3-02');reject(Error('aborted'));await Promise.resolve();assert.equal(s.audio.paused,false);assert(s.audio.src.endsWith('u3-02.m4a'));assert.equal(s.messages.length,0);});
test('a hung load times out and clears loading state',()=>{const s=setup(()=>new Promise(()=>{}));s.say('u3-01');[...s.timers.values()][0]();assert.equal(s.audio.paused,true);assert(s.status.textContent.includes('не загрузилась'));assert.equal(s.timers.size,0);});
test('tapping the same word stops playback; changing page releases the stream',()=>{const s=setup();s.say('u3-01');s.say('u3-01');assert.equal(s.audio.paused,true);assert.equal(s.audio.src,'');s.say('u3-02');s.ui.stopMedia();assert.equal(s.audio.paused,true);assert.equal(s.timers.size,0);assert.equal(s.status.textContent,'');});
(async()=>{for(const [name,fn]of cases){try{await fn();}catch(error){throw Error(name,{cause:error});}}console.log(JSON.stringify({status:'PASS',wordAudioTests:cases.length,recordings:D.words.length}));})();
