(() => {
'use strict';
const L={
 quiz:['Тест на слова','Тест речи','Word test'],grammar:['Грамматика','Граматика','Grammar'],
 quizIntro:['Проверь перевод без подсказок. Результат появится после теста; ошибки можно повторить отдельно.','Провери превод без помоћи. После теста добијаш резултат и можеш поновити грешке.','Check meanings without hints. See your score at the end and retry the missed words.'],
 set:['Какие слова проверять','Које речи проверавамо','Words to test'],all:['Весь словарник','Цео речник','All vocabulary'],studied:['Уже изучавшиеся','Већ увежбаване','Previously studied'],recent:['Последняя пачка обучения','Последња група за учење','Latest learning set'],
 own:['Мои слова','Моје речи','My words'],size:['Слов в тесте','Речи у тесту','Words per test'],meaning:['Перевод в ответах','Превод у одговорима','Answer language'],ru:['Русский','Руски','Russian'],sr:['Сербский','Српски','Serbian'],
 begin:['Начать тест','Почни тест','Start test'],replace:['Начать новый тест','Почни нови тест','Start a new test'],resume:['Продолжить тест','Настави тест','Resume test'],
 replaceNote:['Новый тест заменит только незавершённый тест. Обучение и прошлые результаты сохранятся.','Нови тест замењује само недовршени тест. Учење и ранији резултати остају.','A new test replaces only the unfinished test. Learning and previous results are kept.'],
 smaller:['Если слов меньше выбранного количества, в тест войдут все доступные. Для сербского перевода нужны слова с переводом на сербский.','Ако има мање речи, тест обухвата све доступне. За српски тест потребни су српски преводи.','If fewer words are available, the test uses all of them. Serbian tests use words with Serbian meanings.'],
 empty:['В этом наборе пока нет подходящих слов. Выбери другой набор или язык перевода.','У овој групи још нема одговарајућих речи. Изабери другу групу или језик превода.','No suitable words in this set yet. Choose another set or answer language.'],
 choose:['Выбери перевод','Изабери превод','Choose the meaning'],fill:['Выбери нужную форму','Изабери тачан облик','Choose the correct form'],
 pause:['Продолжу позже','Наставићу касније','Continue later'],position:['Вопрос {n} из {total}','Питање {n} од {total}','Question {n} of {total}'],
 right:['Верно','Тачно','Correct'],wrong:['Пока неверно','Још није тачно','Not quite'],correctAnswer:['Правильный ответ: {answer}','Тачан одговор: {answer}','Correct answer: {answer}'],next:['Дальше','Даље','Next'],finish:['Показать результат','Прикажи резултат','Show result'],
 result:['Результат теста','Резултат теста','Test result'],score:['Верно {n} из {total}','Тачно {n} од {total}','Correct: {n} of {total}'],retry:['Повторить ошибки','Понови грешке','Retry missed questions'],newTest:['Другой тест','Други тест','Another test'],
 noErrors:['Все ответы верные. Можно выбрать другую тему или вернуться к обучению.','Сви одговори су тачни. Изабери другу тему или се врати учењу.','All answers are correct. Try another topic or return to learning.'],
 missed:['Стоит повторить','Вреди поновити','Worth reviewing'],independent:['Здесь сохраняется первый выбранный ответ. Тесты не меняют самооценку и интервалы обучения словам.','Чува се први изабрани одговор. Тестови не мењају самопроцену и размаке учења речи.','Your first choice is recorded. Tests do not change vocabulary self-ratings or review intervals.'],
 listen:['Послушать слово','Послушај реч','Hear the word'],backWords:['К словам','На речи','Back to words'],
 grammarIntro:['Две темы из Smiles 4. Короткое правило, пример и несколько заданий из учебника — без письменного ввода.','Две теме из Smiles 4. Кратко правило, пример и неколико задатака из уџбеника — без куцања.','Two Smiles 4 topics: a short rule, an example and a few adapted textbook questions, with no typing.'],
 rule:['Коротко о правиле','Кратко правило','Quick rule'],open:['Открыть тему','Отвори тему','Open topic'],practice:['Проверить: 4 задания','Провери: 4 задатка','Try 4 questions'],
 source:['Smiles 4 · стр. {p} · задание {ex}','Smiles 4 · стр. {p} · задатак {ex}','Smiles 4 · p. {p} · exercise {ex}'],item:['Пункт {n} · глагол {verb}','Ставка {n} · глагол {verb}','Item {n} · verb: {verb}'],
 sourceNote:['Предложения взяты из упражнения учебника. Вместо записи формы — выбор ответа.','Реченице су из задатка уџбеника. Уместо уписивања облика бираш одговор.','Sentences come from the textbook exercise. Choose the form instead of writing it.'],
 sourceLink:['Открыть учебник','Отвори уџбеник','Open textbook'],latest:['Последний результат: {n} / {total}','Последњи резултат: {n} / {total}','Latest score: {n} / {total}'],
 pickGrammar:['Темы грамматики','Граматичке теме','Grammar topics'],restartGrammar:['Начать заново','Почни поново','Start again'],
 grammarReplace:['Начать заново? Незавершённая проверка по грамматике будет заменена; прошлые результаты сохранятся.','Почети поново? Недовршена граматичка провера биће замењена; ранији резултати остају.','Start again? This replaces the unfinished grammar check and keeps previous results.']
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function create(ctx){
 const P=window.ValePractice,D=window.VALE_ENGLISH;
 const tx=value=>typeof value==='string'?value:value?.[ctx.lang()]||value?.ru||'';
 const t=(key,vars={})=>{let s=L[key]?.[['ru','sr','en'].indexOf(ctx.lang())]||key;for(const[k,v]of Object.entries(vars))s=s.replaceAll('{'+k+'}',v);return s;};
 const state=()=>ctx.getState(),session=kind=>state().practice?.[kind],active=kind=>session(kind)&&!session(kind).finished;
 const pool=scope=>scope==='recent'?ctx.words().filter(w=>state().session?.ids.includes(w.id)):scope==='studied'?ctx.words().filter(w=>state().records[w.id]):ctx.words().filter(w=>scope==='all'||String(w.unit)===scope);
 function quizSetup(scope=''){
  const selected=scope||((state().session?.ids.length)?'recent':Object.keys(state().records).length?'studied':'all');
  const sets=[['all',t('all')],['studied',t('studied')],...(state().session?.ids.length?[['recent',t('recent')]]:[]),...D.topics.map(topic=>[topic.id,tx(topic.title)]),...(state().customWords.length?[['custom',t('own')]]:[])];
  ctx.frame(`<h1 class="page-title">${t('quiz')}</h1><p class="intro">${t('quizIntro')}</p>${active('vocabulary')?`<section class="resume-panel"><div><b>${t('position',{n:session('vocabulary').index+1,total:session('vocabulary').questions.length})}</b></div><a class="primary" href="#english/quiz/run">${t('resume')}</a></section>`:''}<section class="panel quiz-setup"><form id="english-quiz-form"><label>${t('set')}<select name="scope">${sets.map(([id,label])=>`<option value="${esc(id)}" ${id===selected?'selected':''}>${esc(label)}</option>`).join('')}</select></label><label>${t('size')}<select name="size"><option value="5">5</option><option value="8" selected>8</option></select></label><label>${t('meaning')}<select name="locale"><option value="ru" ${ctx.lang()!=='sr'?'selected':''}>${t('ru')}</option><option value="sr" ${ctx.lang()==='sr'?'selected':''}>${t('sr')}</option></select></label><p class="small-note">${t('smaller')}</p>${active('vocabulary')?`<p class="helper">${t('replaceNote')}</p>`:''}<p id="quiz-form-status" role="status"></p><button class="primary" type="submit">${t(active('vocabulary')?'replace':'begin')} →</button></form></section><p class="small-note">${t('independent')}</p>`);
 }
 function grammarHome(){
  ctx.frame(`<h1 class="page-title">${t('grammar')}</h1><p class="intro">${t('grammarIntro')}</p><div class="grammar-topics">${P.GRAMMAR.map(topic=>{const last=state().results?.grammar?.byScope[topic.id];return `<article class="panel"><div class="eyebrow">Smiles 4</div><h2 lang="en">${topic.title}</h2><p>${esc(tx(topic.summary))}</p><p class="small-note">${t('source',{p:topic.page,ex:topic.exercise})}</p>${last?`<p class="helper">${t('latest',{n:last.score,total:last.total})}</p>`:''}<a class="secondary" href="#english/grammar/${topic.id}">${t('open')} →</a></article>`;}).join('')}</div>`);
 }
 function grammarTopic(id){
  const topic=P.GRAMMAR.find(t=>t.id===id);if(!topic)return grammarHome();
  const current=session('grammar'),resume=current&&!current.finished&&current.scope===id;
  ctx.frame(`<div class="breadcrumb"><a href="#english/grammar">${t('pickGrammar')}</a><span>›</span><span lang="en">${topic.title}</span></div><h1 class="page-title" lang="en">${topic.title}</h1><p class="intro">${esc(tx(topic.summary))}</p><section class="panel grammar-rule"><h2>${t('rule')}</h2><ul class="note-list">${topic.rules.map(rule=>`<li>${esc(tx(rule))}</li>`).join('')}</ul><p class="grammar-formula" lang="en">${esc(topic.formula)}</p><p class="small-note">${t('source',{p:topic.page,ex:topic.exercise})} · ${t('sourceNote')}</p><div class="parent-actions">${resume?`<a class="primary" href="#english/grammar/run">${t('resume')} →</a>`:''}<button class="${resume?'quiet':'primary'}" data-action="english-grammar-start" data-topic="${id}">${t(resume?'restartGrammar':'practice')} →</button><a class="quiet" href="${D.textbook}" target="_blank" rel="noopener">${t('sourceLink')} ↗</a></div></section>`);
 }
 function run(kind){
  const s=session(kind);if(!s)return kind==='grammar'?grammarHome():quizSetup();
  if(s.finished)return result(kind);
  const q=s.questions[s.index],answer=s.answers[s.index],answered=answer!==null,correct=answer===q.answer,topic=P.GRAMMAR.find(t=>t.id===s.scope);
  const exit=kind==='grammar'?'#english/grammar/'+s.scope:'#english/quiz';
  ctx.frame(`<div class="english-review-head"><a class="quiet" href="${exit}">← ${t('pause')}</a><span>${t('position',{n:s.index+1,total:s.questions.length})}</span></div><div class="progress-track"><div class="progress-fill" style="width:${100*s.index/s.questions.length}%"></div></div><section class="panel quiz-question"><div class="eyebrow">${kind==='grammar'?esc(topic?.title||t('grammar')):t('choose')+' · '+t(s.locale)}</div><h1 class="english-flashword" lang="en">${esc(q.prompt)}</h1>${q.verb?`<p class="helper">${t('item',{n:q.item,verb:q.verb})}</p>`:''}${kind==='vocabulary'&&ctx.words().some(w=>w.id===q.wordId)?`<button class="quiet" data-action="english-say" data-id="${esc(q.wordId)}">▶ ${t('listen')}</button>${ctx.audioStatus(true)}`:''}<p class="helper">${t(kind==='grammar'?'fill':'choose')}</p><div class="quiz-choices" role="group" aria-label="${t(kind==='grammar'?'fill':'choose')}">${q.choices.map((choice,i)=>`<button class="quiz-choice ${answered&&i===q.answer?'quiz-correct':''} ${answered&&i===answer&&!correct?'quiz-wrong':''}" data-action="english-test-answer" data-kind="${kind}" data-session="${s.id}" data-question="${q.id}" data-choice="${i}" aria-pressed="${i===answer}" ${answered?'disabled':''}>${esc(choice)}${answered&&i===q.answer?'<span aria-hidden="true">✓</span>':''}${answered&&i===answer&&!correct?'<span aria-hidden="true">×</span>':''}</button>`).join('')}</div>${answered?`<div class="feedback ${correct?'ok':''}" role="status"><strong>${t(correct?'right':'wrong')}</strong>${!correct?`<p>${t('correctAnswer',{answer:esc(q.choices[q.answer])})}</p>`:''}${q.reason?`<p>${esc(tx(q.reason))}</p>`:''}</div><button class="primary" data-action="english-test-next" data-kind="${kind}" data-session="${s.id}" data-question="${q.id}">${t(s.index===s.questions.length-1?'finish':'next')} →</button>`:''}${q.source?`<p class="small-note">${t('source',{p:q.source.page,ex:q.source.exercise})}</p>`:''}</section><p class="small-note">${t('independent')}</p>`);
 }
 function result(kind){
  const s=session(kind);if(!s)return kind==='grammar'?grammarHome():quizSetup();
  const errors=P.mistakes(s),title=kind==='grammar'?P.GRAMMAR.find(t=>t.id===s.scope)?.title:t('quiz');
  ctx.frame(`<section class="panel quiz-result"><div class="eyebrow">${esc(title||t('grammar'))}</div><h1 class="page-title">${t('result')}</h1><p class="quiz-score">${t('score',{n:P.score(s),total:s.questions.length})}</p>${errors.length?`<h2>${t('missed')}</h2><ul class="quiz-mistakes">${errors.map(q=>`<li><b lang="en">${esc(q.prompt)}</b><span>${esc(q.choices[q.answer])}</span></li>`).join('')}</ul>`:`<p>${t('noErrors')}</p>`}<div class="parent-actions">${errors.length?`<button class="primary" data-action="english-test-retry" data-kind="${kind}" data-session="${s.id}">${t('retry')}</button>`:''}<a class="secondary" href="${kind==='grammar'?'#english/grammar':'#english/quiz'}">${t('newTest')}</a><a class="quiet" href="#english">${t('backWords')}</a></div></section>`);
 }
 function render(parts){if(parts[0]==='quiz'){if(parts[1]==='run')run('vocabulary');else quizSetup(parts[1]);}else if(parts[1]==='run')run('grammar');else if(parts[1])grammarTopic(parts[1]);else grammarHome();}
 function handleClick(el){
  const action=el.dataset.action,kind=el.dataset.kind;
  if(action==='english-grammar-start'){
   if(active('grammar')&&!confirm(t('grammarReplace')))return true;
   const next=P.begin(state(),'grammar',P.grammarQuestions(el.dataset.topic),el.dataset.topic,ctx.lang());if(next&&ctx.saveState(next)){ctx.stopMedia();location.hash='english/grammar/run';render(['grammar','run']);}return true;
  }
  if(!['english-test-answer','english-test-next','english-test-retry'].includes(action))return false;
  let next;
  if(action==='english-test-answer')next=P.answer(state(),kind,el.dataset.session,el.dataset.question,Number(el.dataset.choice));
  if(action==='english-test-next')next=P.advance(state(),kind,el.dataset.session,el.dataset.question);
  if(action==='english-test-retry'){const s=session(kind);if(s?.finished&&s.id===el.dataset.session)next=P.begin(state(),kind,P.shuffled(P.mistakes(s)),s.scope,s.locale);}
  if(next&&ctx.saveState(next)){ctx.stopMedia();run(kind);document.querySelector('.quiz-question h1,.quiz-result h1')?.setAttribute('tabindex','-1');document.querySelector('.quiz-question h1,.quiz-result h1')?.focus();}return true;
 }
 function handleSubmit(form){
  if(form.id!=='english-quiz-form')return false;
  const values=new FormData(form),scope=String(values.get('scope')||'all'),locale=String(values.get('locale')||'ru'),size=Number(values.get('size'))===5?5:8;
  const questions=P.vocabularyQuestions(pool(scope),ctx.words(),size,locale);
  if(!questions.length){document.querySelector('#quiz-form-status').textContent=t('empty');return true;}
  const next=P.begin(state(),'vocabulary',questions,scope,locale);if(next&&ctx.saveState(next)){ctx.stopMedia();location.hash='english/quiz/run';render(['quiz','run']);}return true;
 }
 return {render,handleClick,handleSubmit};
}
window.ValePracticeUI={create};
})();
