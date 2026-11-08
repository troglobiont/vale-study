(() => {
'use strict';
const L={
 title:['Английский','Енглески','English'],dictionary:['Словарник','Речник','Vocabulary'],
 hero:['Понемногу. И надолго.','Помало. И задуго.','A few words. Every day.'],
 intro:['Слова из Smiles 4: послушай, вспомни перевод и возвращайся к повторению.','Речи из Smiles 4: послушај, сети се превода и враћај се понављању.','Words from Smiles 4: listen, recall the meaning and come back to review.'],
 study:['Учить до 8 слов','Учи до 8 речи','Study up to 8 words'],resume:['Продолжить карточки','Настави картице','Resume cards'],
 due:['Пора повторить','Време за понављање','Due for review'],unseen:['Новые слова','Нове речи','New words'],learned:['Закрепляются','Утврђују се','Taking root'],
 topics:['Темы Smiles 4','Теме Smiles 4','Smiles 4 topics'],all:['Все слова','Све речи','All words'],own:['Мои слова','Моје речи','My words'],add:['Добавить своё слово','Додај своју реч','Add your own word'],
 words:['{n} слов','{n} речи','{n} words'],page:['Стр. {p}','Стр. {p}','Page {p}'],
 method:['Сначала вспомни перевод. Затем открой его и честно выбери: «Ещё раз», «Трудно» или «Знаю».','Прво се сети превода. Затим га откриј и искрено изабери: „Поново”, „Тешко” или „Знам”.','Recall the meaning first. Reveal it, then choose Again, Hard or I know it.'],
 intervals:['«Ещё раз» — через 10 минут, «Трудно» — завтра. У знакомых слов интервал растёт: 1, 3, 7, 14, 30 дней.','„Поново” — за 10 минута, „Тешко” — сутра. За познате речи размак расте: 1, 3, 7, 14, 30 дана.','Again: in 10 minutes. Hard: tomorrow. Known words return after 1, 3, 7, 14 and 30 days.'],
 return:['Следующее повторение: {date}','Следеће понављање: {date}','Next review: {date}'],
 todayDone:['На сейчас всё!','За сада је доста!','All caught up!'],noDue:['Эти слова пока не нужно повторять. Можно посмотреть словарник или открыть другую тему.','Ове речи још нису за понављање. Погледај речник или отвори другу тему.','These words are not due yet. Browse the vocabulary or open another topic.'],
 card:['Карточка {n} из {total}','Картица {n} од {total}','Card {n} of {total}'],recall:['Вспомни, что это значит','Сети се шта ово значи','Recall the meaning'],reveal:['Показать перевод','Прикажи превод','Reveal meaning'],
 listen:['Послушать слово','Послушај реч','Hear the word'],slow:['Медленно','Полако','Slowly'],again:['Ещё раз','Поново','Again'],hard:['Трудно','Тешко','Hard'],know:['Знаю','Знам','I know it'],
 tenMinutes:['Через 10 минут','За 10 минута','In 10 minutes'],tomorrow:['Завтра','Сутра','Tomorrow'],days:['Через {n} дн.','За {n} дана','In {n} days'],pause:['Продолжу позже','Наставићу касније','Continue later'],
 finished:['На сегодня — ещё один шаг','Данас — још један корак','Another step for today'],finishedText:['Повторено {n} слов. Карточки вернутся, когда придёт их время.','Поновљено је {n} речи. Картице ће се вратити кад дође време.','Reviewed {n} words. The cards will return when they are due.'],
 browse:['Посмотреть словарник','Погледај речник','Browse vocabulary'],search:['Найти слово или перевод','Пронађи реч или превод','Find a word or meaning'],noResults:['Ничего не найдено','Ништа није пронађено','No matches'],
 audio:['Аудио учебника','Аудио уџбеника','Textbook audio'],audioIntro:['Нажми на запись. Она играет здесь и загружается с сайта издателя только по запросу. Нужен интернет.','Додирни снимак. Репродукује се овде и учитава са сајта издавача тек на захтев. Потребан је интернет.','Choose a track. It plays here and loads from the publisher only on demand. Internet required.'],
 audioLoading:['Загружаю запись…','Учитавам снимак…','Loading audio…'],audioPlaying:['Запись воспроизводится','Снимак се репродукује','Playing audio'],
 audioError:['Запись не загрузилась. Проверь интернет и попробуй ещё раз.','Снимак није учитан. Провери интернет и покушај поново.','Audio could not load. Check your connection and try again.'],
 publisher:['Открыть у издателя','Отвори код издавача','Open publisher player'],track:['Запись {n}','Снимак {n}','Track {n}'],exercise:['Задание {n}','Задатак {n}','Exercise {n}'],
 pronunciation:['Отдельные слова произносит английский голос устройства. Это синтез речи, а не запись из учебника.','Појединачне речи изговара енглески глас уређаја. То је синтеза говора, а не снимак из уџбеника.','Individual words use your device’s English voice. This is speech synthesis, not textbook audio.'],
 voiceError:['Английская озвучка недоступна. Проверь английский голос в настройках устройства.','Енглески глас није доступан. Провери енглески глас у подешавањима уређаја.','English speech is unavailable. Check the English voice in your device settings.'],
 speaking:['Произношу…','Изговарам…','Speaking…'],sources:['Материалы курса','Материјали курса','Course materials'],textbook:['Учебник','Уџбеник','Textbook'],workbook:['Рабочая тетрадь','Радна свеска','Workbook'],demo:['Электронный демоурок','Електронски демо-час','Digital demo lesson'],
 scope:['В этой версии — словарник и аудио. Полные упражнения курса пока не перенесены.','Ова верзија садржи речник и аудио. Све вежбе курса још нису пренете.','This version includes vocabulary and audio. The full course exercises have not been imported yet.'],
 local:['Слова и интервалы сохраняются на этом устройстве.','Речи и размаци се чувају на овом уређају.','Words and review intervals are saved on this device.'],
 englishWord:['Слово или выражение по-английски','Реч или израз на енглеском','English word or phrase'],russian:['Перевод на русский','Превод на руски','Russian meaning'],serbian:['Перевод на сербский (необязательно)','Превод на српски (није обавезно)','Serbian meaning (optional)'],
 audioURL:['Ссылка на аудиофайл HTTPS (необязательно)','HTTPS веза до аудио-датотеке (није обавезно)','HTTPS audio file URL (optional)'],urlHelp:['Нужна прямая ссылка на запись, например MP3. Если ссылки нет, слово прочитает голос устройства.','Потребна је директна веза до снимка, на пример MP3. Без везе реч изговара глас уређаја.','Use a direct audio file link, such as MP3. Without a link, the device voice reads the word.'],
 save:['Сохранить слово','Сачувај реч','Save word'],saved:['Слово добавлено в повторение','Реч је додата за понављање','Word added to review'],duplicate:['Такое слово уже есть в словарнике','Ова реч већ постоји у речнику','This word is already in the vocabulary'],invalid:['Проверь слово, перевод и HTTPS-ссылку','Провери реч, превод и HTTPS везу','Check the word, meaning and HTTPS URL'],limit:['В своём словарнике можно сохранить до 300 слов','Можеш сачувати до 300 својих речи','You can save up to 300 custom words'],
 emptyOwn:['Добавь сюда слова из своего словарика. Они будут повторяться вместе со словами учебника.','Додај речи из свог речника. Понављаће се заједно са речима из уџбеника.','Add words from your own notebook. They will be reviewed alongside textbook vocabulary.'],
 newWord:['Новое','Ново','New'],ready:['К повторению','За понављање','Due'],later:['Позже','Касније','Later'],home:['Английский','Енглески','English'],
 collection:['Словарник: {n} слов · 10 тем','Речник: {n} речи · 10 тема','Vocabulary: {n} words · 10 topics'],
 holiday:['Праздники','Празници','Holidays'],starter:['Вводный раздел','Уводни део','Starter'],allAudio:['Все 61 записи','Сви 61 снимак','All 61 tracks']
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function create(ctx){
 const D=window.VALE_ENGLISH,C=window.ValeEnglishCore;
 let audio=null,audioTimer=null,speechTimer=null,utterance=null,currentTrack=null,scope='all';
 const lang=()=>ctx.lang();
 const t=(key,vars={})=>{let s=L[key]?.[['ru','sr','en'].indexOf(lang())]||key;for(const[k,v]of Object.entries(vars))s=s.replaceAll('{'+k+'}',v);return s;};
 const title=u=>u.title[lang()]||u.title.ru;
 const state=()=>ctx.getState();
 const words=()=>[...D.words,...state().customWords];
 const word=id=>words().find(w=>w.id===id);
 const topic=id=>D.topics.find(u=>u.id===id);
 const hasSession=()=>state().session&&state().session.index<state().session.ids.length;
 const date=n=>new Date(n).toLocaleString(lang()==='sr'?'sr-RS':lang()==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
 function commit(next){return ctx.saveState(next);}
 function status(message,error=false){const el=document.querySelector('#english-audio-status');if(el){el.textContent=message;el.classList.toggle('audio-error',error);}}
 function stopMedia(){
  clearTimeout(audioTimer);clearTimeout(speechTimer);utterance=null;
  if(audio){audio.onwaiting=audio.onstalled=audio.onplaying=audio.onpause=audio.onended=audio.onerror=null;audio.pause();audio.removeAttribute('src');audio.load();audio=null;}
  if(window.speechSynthesis)window.speechSynthesis.cancel();
 }
 function frame(content){ctx.shell(content,'english');document.title='Vale Study · '+t('title');}
 function crumb(label){return `<div class="breadcrumb"><a href="#english">${t('home')}</a><span>›</span><span>${esc(label)}</span></div>`;}
 function studyButton(unit='all'){
  const resume=hasSession();const n=C.queue(words(),state(),unit).length;
  return `<button class="primary" data-action="english-start" data-unit="${esc(unit)}" ${!resume&&!n?'disabled':''}>${t(resume?'resume':'study')} →</button>`;
 }
 function metrics(list){const s=C.stats(list,state());return `<div class="english-metrics">${[['due',s.due],['unseen',s.new],['learned',s.learned]].map(([key,n])=>`<div><b>${n}</b><span>${t(key)}</span></div>`).join('')}</div>`;}
 function home(){
  const all=words();
  frame(`<section class="hero english-hero"><div><div class="eyebrow">Smiles 4 · ${t('dictionary')}</div><h1>${t('hero')}</h1><p>${t('intro')}</p><div class="hero-buttons">${studyButton()}<a class="secondary" href="#english/words">${t('browse')}</a></div><small>${t('collection',{n:D.words.length})}</small></div><div class="english-card-art" aria-hidden="true"><span>listen · remember · repeat</span><b>hello<span>!</span></b><small>привет · здраво</small><i>Aa</i></div></section>${metrics(all)}<div class="overview-row"><div><h2>${t('topics')}</h2><p>${t('local')}</p></div><a class="secondary" href="#english/custom">＋ ${t('own')}</a></div><div class="chapters english-topics">${D.topics.map(u=>{const list=D.words.filter(w=>w.unit===u.id),s=C.stats(list,state());return `<a href="#english/unit/${u.id}" class="chapter"><div class="chapter-top"><span class="chapter-icon blue" aria-hidden="true">Aa</span><span class="chapter-number">${u.id.padStart(2,'0')}</span></div><h3>${esc(title(u))}</h3><p class="chapter-desc">${t('page',{p:u.pages})}</p><div class="chapter-bottom"><span>${t('words',{n:list.length})} · ${t('due')}: ${s.due}</span><span aria-hidden="true">↗</span></div></a>`;}).join('')}</div><section class="panel english-method"><h2>${t('dictionary')}</h2><p>${t('method')}</p><p class="helper">${t('intervals')}</p><p class="small-note">${t('pronunciation')}</p></section><section class="panel"><h2>${t('sources')}</h2><div class="english-links"><a class="secondary" href="${D.textbook}" target="_blank" rel="noopener">${t('textbook')} ↗</a><a class="secondary" href="${D.workbook}" target="_blank" rel="noopener">${t('workbook')} ↗</a><a class="secondary" href="${D.digitalDemo}" target="_blank" rel="noopener">${t('demo')} ↗</a><a class="secondary" href="#english/audio">${t('allAudio')} →</a></div><p class="small-note">${t('scope')}</p></section>`);
 }
 function searchBox(){return `<label class="english-search">${t('search')}<input type="search" id="english-search" autocomplete="off" placeholder="English · русский · српски"></label>`;}
 function listHTML(list){return `<div class="english-word-list">${list.map(w=>{const r=state().records[w.id],key=!r?'newWord':r.due<=Date.now()?'ready':'later';return `<article class="english-word-row" data-search="${esc([w.en,w.ru,w.sr].join(' ').toLocaleLowerCase())}"><button class="word-sound" data-action="english-say" data-id="${esc(w.id)}" aria-label="${esc(t('listen')+': '+w.en)}">▶</button><div><b lang="en">${esc(w.en)}</b><span lang="ru">${esc(w.ru)}</span>${w.sr?`<small lang="sr-Cyrl">${esc(w.sr)}</small>`:''}</div><span class="word-status ${!r||r.due<=Date.now()?'word-due':''}">${t(key)}${w.page?`<small>${t('page',{p:w.page})}</small>`:''}</span></article>`;}).join('')}</div><p id="english-no-results" hidden>${t('noResults')}</p>`;}
 function audioStatus(){return `<p id="english-audio-status" class="small-note" role="status" aria-live="polite"></p><audio id="english-player" controls preload="none" hidden></audio>`;}
 function trackLabel(track){return `${t('track',{n:track.id})}${track.page?' · '+t('page',{p:track.page}):''}${track.exercise?' · '+t('exercise',{n:track.exercise}):''}`;}
 function audioPanel(unit){
  const tracks=unit==='all'?D.tracks:D.tracks.filter(x=>x.unit===unit);
  return `<section class="panel english-audio-panel"><h2>${t('audio')}</h2><p class="helper">${t('audioIntro')}</p>${audioStatus()}<a id="english-publisher-player" class="quiet" href="${D.audioSource}" target="_blank" rel="noopener">${t('publisher')} ↗</a><div class="english-tracks">${tracks.map(track=>`<button class="audio-track" data-action="english-track" data-id="${track.id}"><span aria-hidden="true">▶</span><span>${esc(trackLabel(track))}${unit==='all'?`<small>${esc(topic(track.unit)?title(topic(track.unit)):t(track.unit==='starter'?'starter':'holiday'))}</small>`:''}</span></button>`).join('')}</div></section>`;
 }
 function vocabulary(unit){
  scope=unit;const u=topic(unit),label=u?title(u):t(unit==='custom'?'own':'all');const list=words().filter(w=>C.inScope(w,unit));
  frame(`${crumb(label)}<div class="overview-row"><div><div class="eyebrow">Smiles 4 · ${t('dictionary')}</div><h1 class="page-title">${esc(label)}</h1>${u?`<p class="helper">${t('page',{p:u.pages})} · ${esc(u.grammar)}</p>`:''}</div>${studyButton(unit)}</div>${metrics(list)}<div class="english-study-layout"><section class="panel">${searchBox()}${!list.length?`<p>${t('emptyOwn')}</p>`:''}${listHTML(list)}${u?'':audioStatus()}<p class="small-note">${t('pronunciation')}</p></section>${u?audioPanel(unit):customForm()}</div>`);
 }
 function customForm(){return `<section class="panel"><h2>${t('add')}</h2><form id="english-add-form" class="english-add-form"><label>${t('englishWord')}<input name="en" lang="en" required maxlength="80" autocomplete="off" autocapitalize="none" spellcheck="false"></label><label>${t('russian')}<input name="ru" lang="ru" required maxlength="160" autocomplete="off"></label><label>${t('serbian')}<input name="sr" lang="sr-Cyrl" maxlength="160" autocomplete="off"></label><label>${t('audioURL')}<input name="audio" type="url" placeholder="https://…/audio.mp3" maxlength="1500" inputmode="url" autocapitalize="none"></label><p class="small-note">${t('urlHelp')}</p><p id="english-form-status" role="status"></p><button class="secondary" type="submit">＋ ${t('save')}</button></form></section>`;}
 function nextDate(list){const dates=list.map(w=>state().records[w.id]?.due).filter(n=>n>Date.now());return dates.length?`<p class="helper">${t('return',{date:date(Math.min(...dates))})}</p>`:'';}
 function review(){
  const s=state().session;
  if(!s){frame(`${crumb(t('dictionary'))}<section class="panel english-review"><h1>${t('todayDone')}</h1><p>${t('noDue')}</p>${nextDate(words())}<a class="secondary" href="#english">${t('home')}</a></section>`);return;}
  if(s.index>=s.ids.length){frame(`${crumb(t('dictionary'))}<section class="panel english-review"><div class="english-complete" aria-hidden="true">✓</div><h1>${t('finished')}</h1><p>${t('finishedText',{n:s.ids.length})}</p>${nextDate(s.ids.map(word).filter(Boolean))}<div class="hero-buttons">${studyButton(s.scope)}<a class="secondary" href="#english">${t('home')}</a></div></section>`);return;}
  const w=word(s.ids[s.index]);if(!w){if(commit({...state(),session:null}))home();return;}
  const r=state().records[w.id],nextStage=Math.min(5,(r?.stage||0)+1);
  frame(`<div class="english-review-head"><a class="quiet" href="#english">← ${t('pause')}</a><span>${t('card',{n:s.index+1,total:s.ids.length})}</span></div><div class="progress-track"><div class="progress-fill" style="width:${100*s.index/s.ids.length}%"></div></div><section class="panel english-review"><div class="eyebrow">${t('recall')}</div><h1 class="english-flashword" lang="en">${esc(w.en)}</h1><div class="english-sound-actions"><button class="secondary" data-action="english-say" data-id="${esc(w.id)}">▶ ${t('listen')}</button><button class="quiet" data-action="english-say" data-id="${esc(w.id)}" data-slow="true">${t('slow')}</button></div>${audioStatus()}${s.revealed?`<div class="english-meaning"><b lang="ru">${esc(w.ru)}</b>${w.sr?`<span lang="sr-Cyrl">${esc(w.sr)}</span>`:''}</div><div class="english-rating">${[['again','tenMinutes'],['hard','tomorrow'],['know','days']].map(([rating,key])=>`<button class="${rating==='know'?'primary':'secondary'}" data-action="english-rate" data-rating="${rating}"><b>${t(rating)}</b><small>${t(key,{n:C.INTERVALS[nextStage-1]})}</small></button>`).join('')}</div>`:`<div class="english-reveal"><p>${t('method')}</p><button class="primary" data-action="english-reveal">${t('reveal')}</button></div>`}<p class="small-note">${w.page?'Smiles 4 · '+t('page',{p:w.page}):t('own')}</p></section><p class="small-note english-pronunciation">${t('pronunciation')}</p>`);
 }
 function render(parts=[]){
  stopMedia();currentTrack=null;
  if(parts[0]==='review')review();else if(parts[0]==='unit'&&topic(parts[1]))vocabulary(parts[1]);else if(parts[0]==='words')vocabulary('all');else if(parts[0]==='custom')vocabulary('custom');else if(parts[0]==='audio'){frame(`${crumb(t('audio'))}${audioPanel('all')}`);}else home();
 }
 function audioFailure(){clearTimeout(audioTimer);if(audio)audio.pause();status(t('audioError'),true);}
 function playRemote(src,slow=false){
  stopMedia();audio=document.querySelector('#english-player');if(!audio)return;
  audio.hidden=false;audio.src=src;audio.playbackRate=slow?.75:1;status(t('audioLoading'));
  const arm=()=>{clearTimeout(audioTimer);audioTimer=setTimeout(audioFailure,15000);};
  audio.onwaiting=arm;audio.onstalled=arm;
  audio.onplaying=()=>{clearTimeout(audioTimer);status(t('audioPlaying'));};
  audio.onpause=()=>clearTimeout(audioTimer);audio.onended=()=>status('');audio.onerror=audioFailure;arm();
  const promise=audio.play();if(promise)promise.catch(audioFailure);
 }
 function speak(w,slow){
  if(C.audioURL(w.audio)){playRemote(w.audio,slow);return;}
  stopMedia();if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){status(t('voiceError'),true);return;}
  const voices=window.speechSynthesis.getVoices(),english=voices.filter(v=>/^en[-_]/i.test(v.lang));
  if(voices.length&&!english.length){status(t('voiceError'),true);return;}
  const u=new SpeechSynthesisUtterance(w.en);utterance=u;u.lang='en-GB';u.rate=slow?.65:.9;
  u.voice=english.find(v=>v.lang==='en-GB')||english[0]||null;
  u.onstart=()=>{if(utterance===u){clearTimeout(speechTimer);status(t('speaking'));}};
  u.onend=()=>{if(utterance===u)status('');};u.onerror=()=>{if(utterance===u){clearTimeout(speechTimer);status(t('voiceError'),true);}};
  speechTimer=setTimeout(()=>{if(utterance===u){status(t('voiceError'),true);window.speechSynthesis.cancel();}},12000);
  window.speechSynthesis.speak(u);
 }
 function handleClick(el){
  const action=el.dataset.action;if(!action?.startsWith('english-'))return false;
  if(action==='english-start'){
   if(!hasSession()){
    const unit=el.dataset.unit||'all',ids=C.queue(words(),state(),unit);
    if(!ids.length){location.hash='english/review';return true;}
    if(!commit({...state(),session:{ids,index:0,revealed:false,scope:unit}}))return true;
   }
   if(location.hash==='#english/review')render(['review']);else location.hash='english/review';
  }
  if(action==='english-reveal'){
   const s=state().session;if(s&&commit({...state(),session:{...s,revealed:true}})){render(['review']);document.querySelector('[data-rating="again"]')?.focus();}
  }
  if(action==='english-rate'){
   const next=C.rate(state(),words(),el.dataset.rating);if(next&&commit(next)){render(['review']);document.querySelector('.english-flashword')?.setAttribute('tabindex','-1');document.querySelector('.english-flashword')?.focus();}
  }
  if(action==='english-say'){const w=word(el.dataset.id);if(w)speak(w,el.dataset.slow==='true');}
  if(action==='english-track'){
   const track=D.tracks.find(x=>x.id===el.dataset.id);if(track){currentTrack=track.id;playRemote(track.src);const a=document.querySelector('#english-publisher-player');if(a)a.href=track.player;document.querySelectorAll('.audio-track').forEach(b=>{const active=b.dataset.id===currentTrack;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});}
  }
  return true;
 }
 function handleSubmit(form){
  const values=new FormData(form),en=String(values.get('en')||'').trim(),ru=String(values.get('ru')||'').trim(),sr=String(values.get('sr')||'').trim(),raw=String(values.get('audio')||'').trim(),url=C.audioURL(raw);
  const feedback=document.querySelector('#english-form-status'),key=s=>s.toLocaleLowerCase().replace(/\s+/g,' ').trim();
  if(!en||en.length>80||!ru||ru.length>160||sr.length>160||url===null){feedback.textContent=t('invalid');return;}
  if(words().some(w=>key(w.en)===key(en))){feedback.textContent=t('duplicate');return;}
  if(state().customWords.length>=300){feedback.textContent=t('limit');return;}
  const w={id:'custom-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),unit:'custom',en,ru,sr,audio:url};
  if(commit({...state(),customWords:[...state().customWords,w]})){render(['custom']);ctx.toast(t('saved'));}
 }
 function search(value){
  let count=0;const query=value.trim().toLocaleLowerCase();document.querySelectorAll('[data-search]').forEach(el=>{el.hidden=!el.dataset.search.includes(query);if(!el.hidden)count++;});
  const empty=document.querySelector('#english-no-results');if(empty)empty.hidden=count>0;
 }
 return {render,handleClick,handleSubmit,search,stopMedia,hasSession};
}
window.ValeEnglish={create};
})();
