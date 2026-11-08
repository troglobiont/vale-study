(() => {
'use strict';
const L={
 title:['Тест','Тест','Test'],extra:['Дополнительные упражнения','Додатни задаци','Extra practice'],
 intro:['Новые примеры по теме раздела. Часть вопросов — ввод числа, часть — выбор A–D. Последние вопросы немного сложнее.','Нови примери из ове области. У неким питањима уписујеш број, у другим бираш A–D. Последња питања су мало тежа.','New questions on this section’s topic. Type a number or choose A–D. The final questions are a little harder.'],
 delayed:['Правильность ответов станет известна после проверки всего теста. До этого можно менять ответы и возвращаться к вопросам.','Тачност одговора видиш тек након провере целог теста. До тада можеш мењати одговоре и враћати се питањима.','Answers are marked only after you submit the whole test. Until then, you can change answers and revisit questions.'],
 size:['Вопросов в тесте','Питања у тесту','Questions per test'],begin:['Начать тест','Почни тест','Start test'],resume:['Продолжить тест','Настави тест','Resume test'],
 newTest:['Новый тест с другими числами','Нови тест са другим бројевима','New test with different numbers'],replace:['Новый тест заменит незавершённую попытку. Завершённые результаты и задания учебника сохранятся.','Нови тест замењује недовршени покушај. Завршени резултати и задаци уџбеника остају.','A new test replaces the unfinished attempt. Completed scores and textbook work are kept.'],
 paused:['Есть незавершённый тест','Постоји недовршени тест','A test is in progress'],
 position:['Вопрос {n} из {total}','Питање {n} од {total}','Question {n} of {total}'],answer:['Ответ','Одговор','Answer'],choose:['Выбери один ответ','Изабери један одговор','Choose one answer'],
 previous:['Назад','Назад','Previous'],next:['Дальше','Даље','Next'],review:['К проверке теста','На проверу теста','Review the test'],pause:['Продолжу позже','Наставићу касније','Continue later'],
 saved:['Ответы сохраняются на этом устройстве. Правильность пока не проверяется.','Одговори се чувају на овом уређају. Тачност се још не проверава.','Answers are saved on this device. They have not been marked yet.'],
 reviewTitle:['Перед проверкой','Пре провере','Before submitting'],reviewIntro:['Посмотри свои ответы. Можно изменить любой из них. Затем проверь весь тест одной кнопкой.','Погледај своје одговоре. Можеш променити било који од њих, па проверити цео тест једним дугметом.','Review your answers and change any of them. Then submit the whole test with one button.'],
 check:['Проверить весь тест','Провери цео тест','Check the whole test'],edit:['Изменить','Промени','Edit'],empty:['Нет ответа','Нема одговора','No answer'],missing:['Ответь на все вопросы. В отмеченных вопросах нужен ответ или целое неотрицательное число.','Одговори на сва питања. У означеним питањима недостаје одговор или цео ненегативан број.','Answer every question. Marked questions need an answer or a non-negative whole number.'],
 viewResult:['Посмотреть результат','Погледај резултат','View result'],result:['Результат теста','Резултат теста','Test result'],score:['С первого раза: {n} из {total}','Из првог покушаја: {n} од {total}','First attempt: {n} of {total}'],
 corrected:['Пересчитано верно: {n}','Тачно прерачунато: {n}','Corrected successfully: {n}'],correct:['Верно','Тачно','Correct'],wrong:['Нужно пересчитать','Прерачунај','Recalculate'],fixed:['Верно после пересчёта','Тачно после прерачунавања','Correct after recalculating'],
 recalculate:['Пересчитать','Прерачунај','Recalculate'],firstKept:['Первый результат сохранён и не меняется после исправлений. Дополнительные тесты учитываются отдельно от учебника.','Први резултат је сачуван и не мења се након исправки. Додатни тестови бележе се одвојено од уџбеника.','Your first score is kept after corrections. Extra tests are tracked separately from the textbook.'],
 correctionTitle:['Пересчитай задачу','Прерачунај задатак','Recalculate this question'],firstAnswer:['Первый ответ: {answer}','Први одговор: {answer}','First answer: {answer}'],checkCorrection:['Проверить пересчёт','Провери прерачунавање','Check correction'],
 tryAgain:['Пока не совпало. Попробуй ещё раз. Первый результат сохранён.','Још није тачно. Покушај поново. Први резултат је сачуван.','Not quite yet. Try again. Your first score is kept.'],fixedFeedback:['Теперь верно. Первый результат теста сохранён.','Сада је тачно. Први резултат теста је сачуван.','Correct now. Your first score is kept.'],toResult:['К результату','На резултат','Back to results'],
 unitsHint:['Проверь единицы. Для прямоугольника умножь стороны, для квадрата — сторону саму на себя. При переводе площади между соседними маленькими единицами множитель 100.','Провери јединице. За правоугаоник помножи странице, за квадрат страницу самом собом. Код суседних мањих јединица површине множилац је 100.','Check the units. Multiply sides for a rectangle and the side by itself for a square. Adjacent small area units use a factor of 100.'],
 statsTitle:['Дополнительные тесты','Додатни тестови','Extra tests'],attempts:['Завершено тестов','Завршени тестови','Completed tests'],latest:['Последний тест: {n} / {total}','Последњи тест: {n} / {total}','Latest test: {n} / {total}'],noTests:['Пока нет завершённых тестов. Открой раздел математики и выбери вкладку «Тест».','Још нема завршених тестова. Отвори део математике и изабери картицу „Тест”.','No completed tests yet. Open a maths section and choose Test.'],
 allContents:['Всё содержание','Цео садржај','All contents'],question:['Вопрос {n}','Питање {n}','Question {n}'],harder:['Чуть сложнее','Мало теже','A little harder']
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function create(ctx){
 const M=window.ValeMathTestCore;let errors=[],correctionFeedback=null;
 const state=()=>ctx.getState(),tx=value=>typeof value==='string'?value:value?.[ctx.lang()]||value?.ru||'';
 const t=(key,vars={})=>{let out=L[key]?.[['ru','sr','en'].indexOf(ctx.lang())]||key;for(const[k,v]of Object.entries(vars))out=out.replaceAll('{'+k+'}',v);return out;};
 const base=chapter=>'#chapter/'+chapter+'/test',unit=q=>tx(M.UNITS[q.unit])||'',current=()=>state().session;
 const response=(q,raw)=>q.type==='choice'?(q.options.find(o=>o.id===raw)?.value??t('empty')):raw||t('empty');
 function frame(chapter,content){const ch=ctx.chapter(chapter);ctx.shell(`${ctx.mathNav(ch)}<div class="breadcrumb"><a href="#chapter/${chapter}">${esc(tx(ch.title))}</a><span>›</span><span>${t('title')}</span></div><h1 class="page-title">${esc(tx(ch.title))}</h1>${ctx.tabs(chapter,'test')}${content}`);}
 function resumePanel(){const s=current();return s&&!s.first?`<section class="resume-panel math-test-resume"><div><span class="eyebrow">${t('paused')}</span><b>${esc(tx(ctx.chapter(s.chapter).title))}</b></div><a class="secondary" href="${base(s.chapter)}/run">${t('resume')} →</a></section>`:'';}
 function setup(chapter){
  const s=current(),pending=s&&!s.first;
  frame(chapter,`<section class="panel math-test-setup"><div class="eyebrow">${t('extra')}</div><h2>${t('title')}</h2><p>${t('intro')}</p><p class="test-notice">${t('delayed')}</p>${pending?resumePanel():s?.first&&s.chapter===chapter?`<p>${t('score',{n:s.first.score,total:s.size})}</p><a class="secondary" href="${base(chapter)}/run">${t('viewResult')} →</a>`:''}<form id="math-test-start" data-chapter="${chapter}"><label>${t('size')}<select name="size">${[5,8,10].map(n=>`<option value="${n}" ${n===8?'selected':''}>${n}</option>`).join('')}</select></label>${pending?`<p class="small-note">${t('replace')}</p>`:''}<button class="primary" type="submit">${t(pending?'newTest':'begin')} →</button></form></section>`);
 }
 function controls(q,value,correction=false){
  if(q.type==='choice')return `<div class="math-test-options" role="group" aria-label="${t('choose')}">${q.options.map((option,i)=>`<button type="button" class="quiz-choice ${value===option.id?'test-selected':''}" data-action="math-test-choice" data-session="${current().id}" data-index="${current().index}" data-value="${option.id}" ${correction?'data-correction="true"':''} aria-pressed="${value===option.id}"><span class="test-letter" aria-hidden="true">${'ABCD'[i]}</span><span>${esc(option.value)} ${esc(unit(q))}</span></button>`).join('')}</div><input type="hidden" name="choice" value="${esc(value)}">`;
  return `<label class="math-test-answer" for="math-test-answer">${t('answer')} ${esc(unit(q))}<div class="input-wrap"><input id="math-test-answer" name="answer" ${correction?'':'data-math-test-input="true"'} data-session="${current().id}" inputmode="numeric" autocomplete="off" maxlength="65" value="${esc(value)}"><span class="unit" aria-hidden="true">${esc(unit(q))}</span></div></label>`;
 }
 function run(chapter){
  const s=current();if(!s||s.chapter!==chapter)return setup(chapter);if(s.first)return result(chapter);if(s.index===s.size)return review(chapter);
  const q=s.questions[s.index];
  frame(chapter,`<div class="english-review-head"><a class="quiet" href="${base(chapter)}">← ${t('pause')}</a><span>${t('position',{n:s.index+1,total:s.size})}</span></div><section class="panel math-test-question"><div class="eyebrow">${t('extra')}${q.difficulty===3?' · '+t('harder'):''}</div><h2>${esc(tx(q.prompt))}</h2><form id="math-test-answer-form">${controls(q,s.drafts[s.index])}<div class="parent-actions">${s.index?`<button type="button" class="secondary" data-action="math-test-move" data-session="${s.id}" data-index="${s.index-1}">← ${t('previous')}</button>`:''}<button class="primary" type="submit">${t(s.index===s.size-1?'review':'next')} →</button><button type="button" class="quiet" data-action="math-test-move" data-session="${s.id}" data-index="${s.size}">${t('review')}</button></div></form><p class="small-note">${t('saved')}</p></section>`);
 }
 function review(chapter){
  const s=current();if(!s||s.chapter!==chapter)return setup(chapter);if(s.first)return result(chapter);
  frame(chapter,`<section class="panel math-test-review"><div class="eyebrow">${t('extra')}</div><h2>${t('reviewTitle')}</h2><p>${t('reviewIntro')}</p>${errors.length?`<div class="feedback" role="alert">${t('missing')}</div>`:''}<ol class="test-review-list">${s.questions.map((q,index)=>`<li class="${errors.some(e=>e.index===index)?'test-missing':''}"><div><b>${t('question',{n:index+1})}</b><p>${esc(tx(q.prompt))}</p><span class="helper">${t('answer')}: ${esc(response(q,s.drafts[index]))} ${s.drafts[index]?esc(unit(q)):''}</span></div><button class="secondary" data-action="math-test-move" data-session="${s.id}" data-index="${index}">${t('edit')}</button></li>`).join('')}</ol><button class="primary" data-action="math-test-grade" data-session="${s.id}">${t('check')} ✓</button><p class="small-note">${t('delayed')}</p></section>`);
 }
 function result(chapter){
  const s=current();if(!s||s.chapter!==chapter||!s.first)return setup(chapter);
  const fixed=Object.values(s.corrections).filter(c=>c.correct).length;
  frame(chapter,`<section class="panel math-test-result"><div class="eyebrow">${t('extra')}</div><h2>${t('result')}</h2><p class="quiz-score">${t('score',{n:s.first.score,total:s.size})}</p>${fixed?`<p>${t('corrected',{n:fixed})}</p>`:''}<p class="small-note">${t('firstKept')}</p><ol class="test-review-list">${s.questions.map((q,index)=>{const correct=s.first.correct[index],fixed=s.corrections[index]?.correct;return `<li class="${correct||fixed?'test-answer-correct':'test-answer-wrong'}"><div><b>${t('question',{n:index+1})} · ${t(correct?'correct':fixed?'fixed':'wrong')}</b><p>${esc(tx(q.prompt))}</p><span class="helper">${t('firstAnswer',{answer:esc(response(q,s.first.answers[index]))+' '+esc(unit(q))})}</span>${fixed?`<p class="helper">${t('answer')}: ${esc(response(q,s.corrections[index].answer))} ${esc(unit(q))}</p>`:''}</div>${!correct&&!fixed?`<a class="secondary" href="${base(chapter)}/correct/${index}">${t('recalculate')} →</a>`:''}</li>`;}).join('')}</ol><div class="parent-actions"><a class="primary" href="${base(chapter)}">${t('newTest')}</a><a class="quiet" href="#home">${t('allContents')}</a></div></section>`);
 }
 function correction(chapter,index){
  const s=current(),q=s?.questions[index];if(!s||s.chapter!==chapter||!s.first||!q||s.first.correct[index])return result(chapter);
  const saved=s.corrections[index],correct=saved?.correct,raw=correctionFeedback?.raw??(saved?.answer||'');
  frame(chapter,`<section class="panel math-test-question"><div class="eyebrow">${t('correctionTitle')} · ${t('question',{n:index+1})}</div><h2>${esc(tx(q.prompt))}</h2><p class="helper">${t('firstAnswer',{answer:esc(response(q,s.first.answers[index]))+' '+esc(unit(q))})}</p>${correct?`<div class="feedback ok" role="status"><strong>${t('fixedFeedback')}</strong><p>${esc(q.calculation)} ${esc(unit(q))}</p></div>`:`<form id="math-test-correction" data-index="${index}">${q.type==='choice'?`<label class="math-test-answer">${t('choose')}<select name="choice"><option value="">…</option>${q.options.map((o,i)=>`<option value="${o.id}" ${raw===o.id?'selected':''}>${'ABCD'[i]} · ${esc(o.value)} ${esc(unit(q))}</option>`).join('')}</select></label>`:controls(q,raw,true)}${correctionFeedback?`<div class="feedback" role="status">${t(correctionFeedback.error?'missing':'tryAgain')}</div>`:''}<button class="primary" type="submit">${t('checkCorrection')} ✓</button></form>`}<p class="small-note">${t('firstKept')}</p><a class="quiet" href="${base(chapter)}/run">← ${t('toResult')}</a></section>`);
 }
 function render(chapter,view,index){if(!ctx.chapter(chapter))return;errors=[];correctionFeedback=null;if(view==='correct')correction(chapter,Number(index));else if(view==='run')run(chapter);else setup(chapter);}
 function focusHeading(){const heading=document.querySelector('.math-test-question h2,.math-test-review h2,.math-test-result h2');heading?.setAttribute('tabindex','-1');heading?.focus?.();}
 function handleInput(el){if(!el.matches?.('[data-math-test-input]'))return false;const s=current();if(!s||s.first)return true;const next=M.saveAnswer(state(),el.dataset.session,s.index,el.value);if(next)ctx.saveState(next);return true;}
 function handleSubmit(form){
  if(!['math-test-start','math-test-answer-form','math-test-correction'].includes(form.id))return false;
  const s=current(),values=new FormData(form);errors=[];
  if(form.id==='math-test-start'){const size=Number(values.get('size')),chapter=form.dataset.chapter,seed=Math.floor(Math.random()*0xffffffff);const next=M.begin(state(),chapter,size,seed);if(ctx.saveState(next)){location.hash=base(chapter)+'/run';run(chapter);}return true;}
  if(!s)return true;
  if(form.id==='math-test-answer-form'){
   const q=s.questions[s.index],draft=q.type==='choice'?values.get('choice'):values.get('answer'),next=M.saveAnswer(state(),s.id,s.index,draft);
   if(next){const moved=M.position(next,s.id,s.index+1);if(moved&&ctx.saveState(moved)){run(s.chapter);focusHeading();}}return true;
  }
  const index=Number(form.dataset.index),q=s.questions[index],raw=String(values.get(q?.type==='choice'?'choice':'answer')??''),out=M.correctAnswer(state(),s.id,index,raw,ctx.parse);
  if(out?.valid&&ctx.saveState(out.state)){correctionFeedback={raw};correction(s.chapter,index);}else{correctionFeedback={raw,error:true};correction(s.chapter,index);}return true;
 }
 function handleClick(el){
  const action=el.dataset.action;if(!action?.startsWith('math-test-'))return false;const s=current();if(!s||s.id!==el.dataset.session)return true;
  if(action==='math-test-choice'){const next=M.saveAnswer(state(),s.id,Number(el.dataset.index),el.dataset.value);if(next&&ctx.saveState(next))run(s.chapter);}
  if(action==='math-test-move'){const next=M.position(state(),s.id,Number(el.dataset.index));if(next&&ctx.saveState(next)){errors=[];run(s.chapter);focusHeading();}}
  if(action==='math-test-grade'){errors=M.validate(state(),ctx.parse);if(errors.length)review(s.chapter);else{const next=M.grade(state(),s.id,ctx.parse);if(next&&ctx.saveState(next)){result(s.chapter);focusHeading();}}}
  return true;
 }
 function statistics(){
  const tts=state().totals;
  return `<section class="panel math-test-statistics"><div class="eyebrow">${t('extra')}</div><h2>${t('statsTitle')}</h2><p>${t('attempts')}: <b>${tts.attempts}</b></p>${tts.last?`<p>${t('latest',{n:tts.last.score,total:tts.last.total})}</p><p>${t('corrected',{n:tts.corrected})}</p>`:`<p class="helper">${t('noTests')}</p>`}<div class="stat-list">${M.CHAPTERS.map(chapter=>{const last=tts.byChapter[chapter];return `<div><a href="${base(chapter)}">${esc(tx(ctx.chapter(chapter).title))}</a><b>${last?last.score+' / '+last.total:'—'}</b></div>`;}).join('')}</div><p class="small-note">${t('firstKept')}</p></section>`;
 }
 return {render,handleInput,handleSubmit,handleClick,statistics,resumePanel};
}
window.ValeMathTestUI={create};
})();
