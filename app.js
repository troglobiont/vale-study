(() => {
'use strict';
const BOOK=window.VALE_BOOK, CORE=window.ValeCore, AVATAR=window.ValeAvatar, STORE='vale-study-book-v02';
const APP_VERSION='0.11.0';
const NATIVE=window.VALE_NATIVE===true;
const ANDROID_APK='https://github.com/troglobiont/vale-study/releases/latest/download/Vale-Study-Android.apk';
const LANGS=['ru','sr','en'];
const S={
 assessmentTests:["Тесты на слова", "Тестови речи", "Word tests"],
 assessmentGrammar:["Грамматика", "Граматика", "Grammar checks"],
 completedTests:["Завершено тестов", "Завршени тестови", "Completed tests"],
 lastTestScore:["Последний результат: {n} / {total}", "Последњи резултат: {n} / {total}", "Latest score: {n} / {total}"],
 noTestsYet:["Пока нет завершённых тестов.", "Још нема завршених тестова.", "No completed tests yet."],
 testResultsNote:["Тесты проверяют первый выбранный ответ. Они учитываются отдельно от самооценки слов.", "Тестови проверавају први изабрани одговор, одвојено од самопроцене речи.", "Tests score the first choice, separately from vocabulary self-ratings."],

 contents:["Всё содержание", "Цео садржај", "All contents"],
 mathIntro:["Все темы и разделы — здесь. Можно выбрать любое задание или продолжить с сохранённого места.", "Све теме и делови су овде. Изабери било који задатак или настави са сачуваног места.", "All topics and sections are here. Choose any task or resume where you left off."],
 parent:["Статистика", "Статистика", "Statistics"],
 profile:["Профиль и настройки", "Профил и подешавања", "Profile and settings"],
 exercises:["Задания", "Задаци", "Exercises"],
 resumeTask:["Продолжить задание", "Настави задатак", "Resume task"],
 savedPlace:["Место сохранено", "Место је сачувано", "Your place is saved"],
 sectionNavigation:["Навигация по разделу", "Навигација кроз део", "Section navigation"],
 subjectNavigation:["Учебные предметы", "Школски предмети", "Subjects"],
 mathNavigation:["Содержание математики", "Садржај математике", "Mathematics contents"],
 statisticsIntro:["Результаты по каждому предмету. Задания по математике и повторения слов учитываются отдельно.", "Резултати по предметима. Математички задаци и понављања речи бележе се одвојено.", "Progress by subject. Maths exercises and vocabulary reviews are counted separately."],
 allStatistics:["Все предметы", "Сви предмети", "All subjects"],
 details:["Подробнее", "Детаљније", "Details"],
 mathProgress:["Решено {n} из {total} заданий", "Решено {n} од {total} задатака", "Solved {n} of {total} exercises"],
 vocabularyProgress:["Изучалось {n} из {total} слов", "Увежбавано {n} од {total} речи", "Studied {n} of {total} words"],
 wordsStudied:["Изучалось слов", "Увежбаване речи", "Words studied"],
 wordReviews:["Повторений слов", "Понављања речи", "Word reviews"],
 dueWords:["Пора повторить", "Време за понављање", "Due for review"],
 unseenWords:["Ещё не изучалось", "Још није увежбавано", "Not studied yet"],
 establishedWords:["Закрепляются", "Утврђују се", "Taking root"],
 englishStatisticsNote:["Это самооценка при повторении слов, а не проверка правильности перевода. «Закрепляются» — слова на третьем или более высоком уровне повторения. Прослушивание без самооценки здесь не учитывается.", "Ово је самопроцена при понављању речи, а не провера тачности превода. „Утврђују се” су речи на најмање трећем нивоу понављања. Само слушање се не рачуна.", "These are vocabulary self-ratings, not scored translation answers. Taking root means a word is at review stage three or higher. Listening without a self-rating is not counted."],
 mathStatisticsNote:["Показатели относятся к заданиям темы «Площадь». Первые ответы и повторение хранятся отдельно.", "Показатељи се односе на задатке теме „Површина”. Први одговори и понављање бележе се одвојено.", "These results cover the Area exercises. First answers and review are tracked separately."],
 statisticsLocal:["История занятий хранится на этом устройстве.", "Историја вежбања чува се на овом уређају.", "Study history is saved on this device."],
 englishTopics:["Темы словарника", "Теме речника", "Vocabulary topics"],
 ownWords:["Мои слова", "Моје речи", "My words"],
 topicWords:["Изучалось {n} / {total} · повторить {due}", "Увежбавано {n} / {total} · поновити {due}", "Studied {n} / {total} · due {due}"],
 mathSessionSize:["Заданий в сессии по математике", "Математичких задатака у сесији", "Maths tasks per session"],
 profileIntro:["Фотография, настройки и данные этого устройства.", "Фотографија, подешавања и подаци овог уређаја.", "Your photo, settings and data on this device."],
 mathSettingsNote:["Размер сессии относится к математике. В английском — до 8 слов за подход.", "Величина сесије важи за математику. Енглески има до 8 речи по сесији.", "Session size applies to maths. English uses up to 8 words per session."],

 mathHero:['Выбирай тему. Двигайся дальше.','Изабери тему. Настави даље.','Choose a topic. Keep exploring.'],

 mathTopics:['Темы по математике','Теме из математике','Mathematics topics'],area:['Площадь','Површина','Area'],
 areaDescription:['Единицы площади, прямоугольник, квадрат и задачи из учебника.','Јединице површине, правоугаоник, квадрат и задаци из уџбеника.','Area units, rectangles, squares and textbook problems.'],
 topicStructure:['6 разделов · правила и задания','6 делова · правила и задаци','6 sections · rules and exercises'],openTopic:['Открыть тему','Отвори тему','Open topic'],overview:['Обзор темы','Преглед теме','Topic overview'],
 dataUpdates:['Данные и обновления','Подаци и ажурирања','Data and updates'],updateNow:['Обновить сейчас','Ажурирај сада','Update now'],
 updateIdle:['Нажми «Обновить сейчас», чтобы получить последнюю версию.','Додирни „Ажурирај сада” за најновију верзију.','Choose Update now to get the latest version.'],
 updateChecking:['Проверяю новую версию…','Проверавам нову верзију…','Checking for a new version…'],updateDownloading:['Загружаю обновление…','Преузимам ажурирање…','Downloading the update…'],updateApplying:['Ответы сохранены. Открываю новую версию…','Одговори су сачувани. Отварам нову верзију…','Answers saved. Opening the new version…'],
 updateCurrent:['Установлена последняя версия.','Инсталирана је најновија верзија.','You have the latest version.'],updateAvailable:['Доступна версия {v}.','Доступна је верзија {v}.','Version {v} is available.'],
 updateNetwork:['Обновление не загрузилось. Проверь интернет и попробуй снова. Текущая версия и ответы сохранены.','Ажурирање није преузето. Провери интернет и покушај поново. Тренутна верзија и одговори су сачувани.','The update could not load. Check your connection and try again. Your current version and answers are kept.'],
 updateInvalid:['Не удалось проверить пакет обновления. Текущая версия продолжает работать.','Пакет ажурирања није проверен. Тренутна верзија наставља да ради.','The update package could not be verified. Your current version still works.'],
 updateNeedNative:['Для этого обновления нужна новая установочная версия приложения.','За ово ажурирање потребна је нова инсталациона верзија апликације.','This update requires a new app installer.'],
 updateUnavailable:['Обновление доступно в установленном приложении или по основной ссылке сайта.','Ажурирање је доступно у инсталираној апликацији или на главној вези сајта.','Update from the installed app or the main website.'],
 updateNativeHelp:['Новые материалы и интерфейс загружаются прямо сюда. Искать файл в «Скачанных» не нужно. Для обновления требуется интернет.','Нови материјали и интерфејс преузимају се директно овде. Нема тражења датотеке у преузимањима. За ажурирање је потребан интернет.','New materials and interface updates load directly here. No need to find a downloaded file. Internet is required to update.'],
 updateWebHelp:['Новая версия загрузится и откроется здесь. Текущие ответы и место в занятии сохранятся.','Нова верзија ће се учитати и отворити овде. Одговори и место у вежбању остају сачувани.','The new version loads and opens here. Your answers and current place are preserved.'],
 savedHere:['Ответы, словарник и аватарка сохраняются на этом устройстве. Обновление приложения не синхронизирует их с другим устройством.','Одговори, речник и слика чувају се на овом уређају. Ажурирање их не синхронизује са другим уређајем.','Answers, vocabulary and your picture are saved on this device. App updates do not sync them to another device.'],

 mathematics:['Математика','Математика','Mathematics'],english:['Английский','Енглески','English'],
 nativeIntro:["Отдельное приложение с учебником внутри. Математика и словарник доступны без интернета. Для озвучки нужна сеть.", "Засебна апликација са уџбеником. Математика и речник раде без интернета. За аудио-снимке је потребна мрежа.", "A separate app with the textbook included. Maths and vocabulary work offline. Audio needs internet."],
 downloadAPK:["Скачать приложение для Android", "Преузми Android апликацију", "Download the Android app"],
 androidAPKHelp:["Скачай APK, открой его и подтверди установку. Если Android попросит, разреши установку из этого источника. После установки запускай Valja Study из списка приложений.", "Преузми APK, отвори га и потврди инсталацију. Ако Android затражи, дозволи инсталацију из тог извора. Затим отвори Valja Study са списка апликација.", "Download the APK, open it and confirm installation. If Android asks, allow installation from this source. Then launch Valja Study from your apps list."],
 iosPending:["Версия для iPad подготовлена как проект. Установочная ссылка появится после подписи и публикации через Apple.", "Верзија за iPad је припремљена као пројекат. Веза за инсталацију ће бити доступна после потписивања и објављивања преко Apple-а.", "The iPad project is prepared. An install link will be available after Apple signing and distribution."],
 iosNeedsApple:["Для установки через TestFlight нужен Apple Developer. Сейчас готовой iOS-установки нет.", "За инсталацију преко TestFlight-а потребан је Apple Developer. iOS инсталација још није доступна.", "TestFlight installation needs Apple Developer. An iOS installer is not available yet."],
 webAlternative:["Открыть как веб-приложение", "Отвори као веб-апликацију", "Use as a web app"],
 nativeInstalled:["Это установленное приложение", "Ово је инсталирана апликација", "This is the installed app"],
 nativeUpdate:["Обычные обновления: «Аватарка → Данные и обновления → Обновить сейчас». Новая установочная версия нужна только при изменении системной части приложения.", "Редовна ажурирања: „Слика профила → Подаци и ажурирања → Ажурирај сада”. Нови инсталатер је потребан само за измене системског дела апликације.", "Regular updates: Profile picture → Data and updates → Update now. A new installer is needed only for native system changes."],
 nativeData:["Приложение и сайт хранят результаты отдельно. Данные не переносятся автоматически. Обновления доступны через аватарку, в разделе «Данные и обновления».", "Апликација и сајт чувају резултате одвојено. Подаци се не преносе аутоматски. Ажурирања су доступна у профилу, у одељку „Подаци и ажурирања”.", "The app and website store results separately; data is not transferred automatically. Updates are available from your profile under Data and updates."],
 exportFail:["Не удалось открыть сохранение файла. Попробуй ещё раз.", "Чување датотеке не може да се отвори. Покушај поново.", "Could not open the file export. Please try again."],


 yourAvatar:["Твоя фотография", "Твоја фотографија", "Your photo"],
 avatarChoose:["Выбрать фото", "Изабери фотографију", "Choose a photo"],
 avatarChange:["Изменить фото", "Промени фотографију", "Change photo"],
 avatarRemove:["Убрать фото", "Уклони фотографију", "Remove photo"],
 avatarSaved:["Аватарка сохранена на этом устройстве.", "Слика је сачувана на овом уређају.", "Your picture is saved on this device."],
 avatarRemoved:["Фото убрано. Учебный прогресс сохранён.", "Фотографија је уклоњена. Напредак је сачуван.", "Photo removed. Your learning progress is kept."],
 avatarBusy:["Подготавливаю фото…", "Припремам фотографију…", "Preparing your photo…"],
 avatarLocal:["Фото хранится только на этом устройстве. Оно не отправляется на сервер, в GitHub или вместе с экспортом результатов.", "Фотографија се чува само на овом уређају. Не шаље се на сервер, GitHub или уз извоз резултата.", "Your photo stays on this device. It is not sent to a server, GitHub or the results export."],
 avatarCrop:["Фото обрежется по центру до квадрата и будет отображаться в круге. Исходный снимок в галерее останется прежним.", "Фотографија ће бити исечена по средини у квадрат и приказана у кругу. Изворна фотографија у галерији остаје непромењена.", "The photo is cropped to a centred square and shown in a circle. The original in your gallery is unchanged."],
 avatarTypeError:["Выбери фотографию: например JPG, PNG или WebP.", "Изабери фотографију, на пример JPG, PNG или WebP.", "Choose a photo, such as JPG, PNG or WebP."],
 avatarSizeError:["Фото слишком большое. Выбери файл не больше 20 МБ.", "Фотографија је превелика. Изабери датотеку до 20 MB.", "The photo is too large. Choose a file no larger than 20 MB."],
 avatarReadError:["Не удалось открыть фото. Попробуй другой снимок или формат JPG, PNG, WebP.", "Фотографија не може да се отвори. Пробај другу слику или формат JPG, PNG, WebP.", "The photo could not be opened. Try another picture or JPG, PNG, WebP format."],
 avatarStorageError:["Не удалось сохранить аватарку на устройстве. Прежнее фото и учебный прогресс не изменены.", "Слика није сачувана на уређају. Претходна слика и напредак нису промењени.", "The picture could not be saved on this device. Your previous photo and learning progress are unchanged."],
 install:["Установить", "Инсталирај", "Install"],
 installTitle:["Valja Study на твоём устройстве", "Valja Study на твом уређају", "Valja Study on your device"],
 installIntro:["Открой приложение по этой же ссылке на iPad или Android и добавь его на главный экран. Оно будет запускаться отдельной иконкой.", "Отвори апликацију преко исте везе на iPad-у или Android-у и додај је на почетни екран. Покретаће се посебном иконом.", "Open this same link on iPad or Android and add the app to your home screen. It will launch from its own icon."],
 installNative:["Установить приложение", "Инсталирај апликацију", "Install the app"],
 installed:["Приложение уже установлено", "Апликација је већ инсталирана", "The app is already installed"],
 installGuide:["Выбери свой способ ниже", "Изабери свој начин испод", "Choose your method below"],
 ipadStep1:["Открой эту ссылку в Safari на iPad.", "Отвори ову везу у Safari-ју на iPad-у.", "Open this link in Safari on your iPad."],
 ipadStep2:["Нажми «Поделиться», затем «На экран “Домой”». При необходимости сначала нажми «Ещё».", "Додирни „Дели”, затим „Додај на почетни екран”. Ако је потребно, прво додирни „Више”.", "Tap Share, then Add to Home Screen. Tap More first if needed."],
 ipadStep3:["Оставь включённым «Открывать как веб-приложение» и нажми «Добавить».", "Остави укључено „Отвори као веб-апликацију” и додирни „Додај”.", "Leave Open as Web App enabled and tap Add."],
 androidStep1:["Открой эту ссылку в Chrome на Android.", "Отвори ову везу у Chrome-у на Android-у.", "Open this link in Chrome on Android."],
 androidStep2:["Нажми «Установить приложение» здесь, если эта кнопка доступна. Или открой меню ⋮ браузера.", "Додирни „Инсталирај апликацију” овде ако је дугме доступно. Или отвори мени ⋮ прегледача.", "Tap Install the app here if the button is available, or open the browser’s ⋮ menu."],
 androidStep3:["Выбери «Установить приложение» или «Добавить на главный экран» и подтверди добавление. Название пункта зависит от браузера.", "Изабери „Инсталирај апликацију” или „Додај на почетни екран” и потврди. Назив ставке зависи од прегледача.", "Choose Install app or Add to Home screen and confirm. The wording depends on the browser."],
 offlineReady:["Математика и словарник сохранены для работы без интернета. Озвучка требует сети.", "Математика и речник су сачувани за рад ван мреже. Аудио-снимци захтевају интернет.", "Maths and vocabulary are saved for offline use. Audio requires internet."],
 offlinePreparing:["При первом открытии дождись загрузки всех материалов, прежде чем отключать интернет.", "При првом отварању сачекај да се сви материјали учитају пре искључивања интернета.", "On your first visit, let all materials finish loading before going offline."],
 installFile:["Для установки открой опубликованную HTTPS-ссылку в браузере устройства. Локальный HTML служит отдельной автономной копией.", "За инсталацију отвори објављену HTTPS везу у прегледачу уређаја. Локални HTML је засебна копија за рад ван мреже.", "To install, open the published HTTPS link in your device’s browser. The local HTML is a separate offline copy."],
 tagline:['Каждый шаг — открытие','Сваки корак — откриће','A little further, every day'],
 reviewIndependent:['Самостоятельно в повторении','Самостално при понављању','Independent in review'],
 skip:['К содержанию','На садржај','Skip to content'],book:['Учебник','Уџбеник','Textbook'],mathTest:['Тест','Тест','Test'],rules:['Правила','Правила','Rules'],
 topic:['Площадь · 4-й разред','Површина · 4. разред','Area · Grade 4'],hero:['От клетки до квадратного километра.','Од квадратића до квадратног километра.','From a square to a square kilometre.'],
 heroText:['Твой учебник, только удобнее: решай задания, проверяй ответы и возвращайся к тому, что хочется повторить.','Твој уџбеник, само практичнији: решавај задатке, проверавај одговоре и врати се ономе што желиш да поновиш.','Your textbook, made easier to use: solve the tasks, check your answers and return to anything you want to practise.'],
 begin:['Начать занятия','Почни вежбање','Start studying'],continue:['Продолжить','Настави','Continue'],ownPace:['Без таймера. В своём темпе.','Без тајмера. Својим темпом.','No timer. At your own pace.'],
 wholeBook:['Весь блок из учебника','Цела област из уџбеника','The whole textbook block'],chapterSub:['Шесть разделов · страницы 8–28','Шест делова · стране 8–28','Six sections · pages 8–28'],pages:['Стр. {p}','Стр. {p}','Pages {p}'],page:['Стр. {p}','Стр. {p}','Page {p}'],
 tasks:['{n} карточек','{n} картица','{n} cards'],doneOf:['Проверено {n} из {total}','Проверено {n} од {total}','Checked {n} of {total}'],
 sourceNote:['«Задания» и «Правила» — из учебника. «Тест» — дополнительные упражнения по той же теме с новыми числами.','„Задаци” и „Правила” су из уџбеника. „Тест” садржи додатне задатке из исте области са новим бројевима.','Exercises and Rules come from the textbook. Test adds questions on the same topic with new numbers.'],
 local:['Сохранение на этом устройстве','Чување на овом уређају','Saved on this device'],localShort:['Локально','Локално','Local'],noSync:['История на iPad и Android хранится отдельно.','Историја на iPad-у и Android-у чува се одвојено.','History is stored separately on iPad and Android.'],
 version:['Версия {v}','Верзија {v}','Version {v}'],allSections:['Все разделы','Сви делови','All sections'],learn:['Вспомним правило','Подсетимо се правила','Remember the rule'],
 startChapter:['Начать {n} заданий','Почни {n} задатака','Start {n} tasks'],allCards:['Все задания раздела','Сви задаци у овом делу','All tasks in this section'],source:['Оригинал','Оригинал','Original'],close:['Закрыть','Затвори','Close'],
 sourceDescription:['Присланная фотография. Нужная страница: {p}. Масштаб на экране не равен печатным сантиметрам.','Послата фотографија. Потребна страна: {p}. Размер на екрану није једнак штампаним центиметрима.','Supplied photograph. Relevant page: {p}. The screen scale does not equal printed centimetres.'],
 taskNum:['Задание {n}','Задатак {n}','Task {n}'],warm:['Разминка {n}','Увод {n}','Warm-up {n}'],intro:['Пример из учебника','Пример из уџбеника','Textbook example'],think:['Подумай','Размисли','Think about it'],
 position:['{n} из {total}','{n} од {total}','{n} of {total}'],check:['Проверить','Провери','Check'],hint:['Подсказка','Помоћ','Hint'],showAnswer:['Показать разбор','Прикажи решење','Show solution'],skipTask:['Пропустить','Прескочи','Skip'],next:['Следующее','Следеће','Next'],toSummary:['К итогу','На резултат','See summary'],
 correct:['Верно','Тачно','Correct'],tryAgain:['Пока не совпало','Још није тачно','Not quite yet'],tryText:['Проверь отмеченные поля и единицы. Можно исправить ответ или открыть правило.','Провери означена поља и јединице. Можеш исправити одговор или отворити правило.','Check the marked fields and units. You can correct your answer or open the rule.'],
 independent:['Самостоятельно с первого раза','Самостално из првог покушаја','Independently on the first try'],helped:['С помощью','Уз помоћ','With help'],corrected:['После исправления','После исправке','After a correction'],revealed:['С показанным решением','Са приказаним решењем','Solution shown'],skipped:['Пропущено','Прескочено','Skipped'],
 firstKept:['Первый ответ сохранён; исправление его не перезаписывает.','Први одговор је сачуван; исправка га не замењује.','Your first answer is saved; a correction does not overwrite it.'],
 hintText:['Посмотри, что нужно найти. Если единицы разные, сначала приведи их к одной единице. Для площади прямоугольника умножь стороны, для квадрата — сторону саму на себя.','Погледај шта треба наћи. Ако су јединице различите, прво их сведи на исту. За површину правоугаоника помножи странице, а за квадрат страницу саму собом.','Look at what you need to find. If the units differ, first convert them to the same unit. For a rectangle multiply its sides; for a square multiply the side by itself.'],
 unitHint:['Между соседними единицами этой цепочки не 10, а 100: 10 рядов по 10 клеток.','Између суседних јединица овог низа није 10 већ 100: 10 редова по 10 квадратића.','Between adjacent units in this chain the factor is 100, not 10: 10 rows of 10 squares.'],
 scratch:['Черновик','Белешке','Scratchpad'],scratchInfo:['Необязательно. Пиши пальцем или стилусом: почерк не распознаётся и не оценивается.','Није обавезно. Пиши прстом или оловком: рукопис се не препознаје и не оцењује.','Optional. Write with a finger or stylus: handwriting is not recognised or graded.'],clear:['Очистить','Обриши','Clear'],undo:['Отменить штрих','Поништи потез','Undo stroke'],
 canvasLabel:['Место для черновых вычислений','Место за помоћни рачун','Space for working out'],answer:['Ответ','Одговор','Answer'],select:['Выбери…','Изабери…','Choose…'],
 orderHelp:['Касайся карточек в нужном порядке. Первой — самая маленькая площадь.','Додируј картице редом. Прво најмања површина.','Tap the cards in order, starting with the smallest area.'],orderUndo:['Убрать последнюю','Уклони последњу','Remove last'],
 measureTitle:['Измерение по книге','Мерење у књизи','Measure in the book'],measureText:['На фотографии нет достоверного масштаба в сантиметрах. Измерь стороны в бумажной книге и введи их в миллиметрах, чтобы обойтись без дробей. Здесь проверяется вычисление по твоим размерам, а не сами измерения.','На фотографији нема поуздане размере у центиметрима. Измери странице у папирној књизи и унеси их у милиметрима, без разломака. Овде се проверава рачун према твојим мерама, а не саме мере.','The photo has no reliable centimetre scale. Measure the sides in the printed book and enter millimetres to avoid fractions. This checks the calculation using your measurements, not the measurements themselves.'],
 measureUnavailable:['Измерения не проверены','Мере нису проверене','Measurements unverified'],arithmeticChecked:['Вычисление проверено','Рачун је проверен','Calculation checked'],measureResult:['По введённым размерам: {values} мм². В общий счёт проверенных заданий это не входит.','Према унетим мерама: {values} mm². Ово се не рачуна као потпуно проверен задатак.','Using the entered dimensions: {values} mm². This does not count as a fully checked task.'],
 sideA:['Сторона А₁, мм','Страница А₁, mm','Side A₁, mm'],sideB:['Сторона А₂, мм','Страница А₂, mm','Side A₂, mm'],sideC:['Сторона Б₁, мм','Страница Б₁, mm','Side B₁, mm'],sideD:['Сторона Б₂, мм','Страница Б₂, mm','Side B₂, mm'],areaA:['Площадь А, мм²','Површина А, mm²','Area A, mm²'],areaB:['Площадь Б, мм²','Површина Б, mm²','Area B, mm²'],difference:['Разница площадей, мм²','Разлика површина, mm²','Area difference, mm²'],side:['Сторона, мм','Страница, mm','Side, mm'],squareArea:['Площадь, мм²','Површина, mm²','Area, mm²'],
 scheme:['Схема. Не измеряй сантиметры на экране.','Шема. Не мери центиметре на екрану.','Diagram. Do not measure centimetres on the screen.'],
 summary:['На сегодня — вот что получилось','Ево шта је данас урађено','Here is what you did today'],summaryText:['Можно закончить или вернуться к трудным заданиям. Спешить не нужно.','Можеш завршити или се вратити тежим задацима. Не мораш да журиш.','You can finish or return to the harder tasks. There is no rush.'],
 review:['Повторить трудное','Понови теже','Review tricky tasks'],reviewEmpty:['Пока нет заданий для повторения.','Још нема задатака за понављање.','There are no tasks to review yet.'],newSession:['Ещё сессия','Још једна сесија','Another session'],home:['На главную','На почетну','Home'],
 firstAnswers:['Первые самостоятельные ответы','Први самостални одговори','First independent answers'],solved:['Решено','Решено','Solved'],shown:['Открыт разбор','Решење је отворено','Solution opened'],seen:['Есть математический ответ','Има математичког одговора','Has a mathematical answer'],
 parentTitle:['Спокойный обзор занятий','Преглед вежбања','A simple study overview'],parentText:['Здесь те же результаты, которые видны ребёнку. Никаких скрытых оценок и отправки ответов на сервер.','Овде су исти резултати које дете види. Нема скривених оцена ни слања одговора на сервер.','These are the same results the learner can see. No hidden scores and no answers sent to a server.'],
 settings:['Настройки','Подешавања','Settings'],sessionSize:['Заданий в сессии','Задатака у сесији','Tasks per session'],largeText:['Крупный текст','Велики текст','Large text'],on:['Вкл.','Укљ.','On'],off:['Выкл.','Искљ.','Off'],dataTitle:['Данные на этом устройстве','Подаци на овом уређају','Data on this device'],
 dataText:['Сохраняются ответы, подсказки, черновики и настройки без имени и аккаунта. Очистка данных браузера или удаление приложения может удалить историю. Экспорт — файл для сохранения, автоматического восстановления из него пока нет.','Чувају се одговори, помоћ, белешке и подешавања, без имена и налога. Брисање података прегледача или апликације може обрисати историју. Извоз је датотека за чување; аутоматски увоз још не постоји.','Answers, hints, scratch notes and settings are stored without a name or account. Clearing browser data or removing the app may delete history. Export creates a file for safekeeping; automatic restore is not available yet.'],
 export:['Экспортировать JSON','Извези JSON','Export JSON'],reset:['Удалить весь прогресс','Обриши сав напредак','Delete all progress'],resetConfirm:['Удалить аватарку, ответы, словарник, интервалы повторения, черновики и настройки на этом устройстве? Это нельзя отменить. Экспортированные файлы останутся.','Обрисати слику, одговоре, речник, размаке понављања, белешке и подешавања на овом уређају? Ово се не може поништити. Извезене датотеке остају.','Delete your picture, answers, vocabulary, review intervals, scratch notes and settings on this device? This cannot be undone. Exported files will remain.'],deleted:['Данные удалены','Подаци су обрисани','Data deleted'],
 saveFail:['Не удалось сохранить изменения. Не закрывай страницу: можно экспортировать данные через аватарку, в разделе «Данные и обновления».','Измене нису сачуване. Не затварај страницу: податке можеш извести у профилу.','Changes could not be saved. Keep this page open; you can export data from your profile.'],corrupt:['Сохранение не удалось прочитать. Старые данные не перезаписаны. Исходное сохранение можно экспортировать через аватарку, в разделе «Данные и обновления».','Сачувани подаци се не могу прочитати. Стари подаци нису замењени. Изворни запис можеш извести у профилу.','Saved data could not be read. The old data has not been overwritten. You can export the original saved record from your profile.'],
 empty:['Введи ответ','Унеси одговор','Enter an answer'],format:['Введи целое число. Пробелы допустимы между группами по три цифры. Буквы, дроби и лишние знаки не нужны.','Унеси цео број. Размаци су дозвољени између група од три цифре. Слова, разломци и додатни знаци нису потребни.','Enter a whole number. Spaces may separate groups of three digits. Letters, decimals and extra symbols are not needed.'],negative:['Здесь нужно неотрицательное число.','Овде је потребан ненегативан број.','A non-negative number is required here.'],range:['Слишком большое число для этого задания.','Број је превелик за овај задатак.','This number is too large for the task.'],long:['Слишком длинный ввод.','Унос је предугачак.','The entry is too long.'],choose:['Сначала выбери ответ.','Прво изабери одговор.','Choose an answer first.'],order:['Расположи все карточки.','Поређај све картице.','Arrange all the cards.'],pairs:['Выбери пару для каждой строки.','Изабери пар за сваки ред.','Choose a match for every row.'],measureRange:['Сторона должна быть больше 0 и не больше 10 000 мм.','Страница мора бити већа од 0 и највише 10 000 mm.','Each side must be greater than 0 and no more than 10 000 mm.'],
 showSolution:['Разбор','Решење','Solution'],yourFirst:['Первый ответ','Први одговор','First answer'],unanswered:['Ещё без ответа','Још без одговора','Not answered yet'],reviewNote:['Повторение не меняет первый ответ в истории.','Понављање не мења први одговор у историји.','Review does not change the first answer in your history.'],
 update:['Проверить обновление','Провери ажурирање','Check for updates'],updateReady:['Доступно обновление. Оно применяется между сессиями.','Доступно је ажурирање. Примењује се између сесија.','An update is available. It applies between sessions.'],applyUpdate:['Обновить','Ажурирај','Update'],updateLater:['Сначала закончи или заверши текущую сессию. Ответы уже сохранены.','Прво доврши или заврши текућу сесију. Одговори су већ сачувани.','Finish or end the current session first. Your answers are saved.'],updated:['Проверка обновления выполнена.','Провера ажурирања је завршена.','Update check completed.'],offline:['Нет сети. Установленная версия продолжает работать.','Нема мреже. Инсталирана верзија наставља да ради.','No connection. The installed version keeps working.'],pwaLocal:['Открой раздел «Установить», чтобы добавить Valja Study на главный экран iPad или Android.','Отвори одељак „Инсталирај” да додаш Valja Study на почетни екран iPad-а или Android-а.','Open Install to add Valja Study to the home screen of your iPad or Android device.'],
 endSession:['Завершить сессию','Заврши сесију','End session'],endConfirm:['Завершить сессию сейчас? Данные ответов останутся; неоткрытые задания не считаются ошибками.','Завршити сесију сада? Одговори остају; неотворени задаци се не рачунају као грешке.','End the session now? Answers will be kept; unopened tasks do not count as mistakes.'],
 countHint:['В сессии не больше {n} карточек. Остальные останутся на потом.','У сесији има највише {n} картица. Остале остају за касније.','A session contains up to {n} cards. The rest remain for later.'],
 noScoreMeasure:['2 задания требуют измерения в книге и учитываются отдельно.','2 задатка захтевају мерење у књизи и бележе се одвојено.','2 tasks require measuring in the book and are recorded separately.'],
 firstDefinition:['Числитель: первые верные ответы без помощи. Знаменатель: карточки, в которых отправлен хотя бы один допустимый математический ответ. Ошибки формата и измерения сюда не входят.','Бројилац: први тачни одговори без помоћи. Именилац: картице са бар једним важећим математичким одговором. Грешке уноса и мерења се не рачунају.','Numerator: first correct answers without help. Denominator: cards with at least one valid mathematical submission. Format errors and measurement tasks are excluded.'],
 langSaved:['Язык изменён. Задание и ответы сохранены.','Језик је промењен. Задатак и одговори су сачувани.','Language changed. The task and answers are preserved.'],
 scratchClear:['Очистить только черновик этой задачи?','Обрисати само белешке овог задатка?','Clear only this task’s scratchpad?']
};
let broken=null,saveError=false,avatar='',avatarBusy=false,avatarError='';
try{avatar=AVATAR.read(localStorage);}catch{}
const fresh=()=>({schemaVersion:1,locale:'ru',size:8,large:false,records:{},session:null,english:window.ValeEnglishCore.fresh(),mathTests:window.ValeMathTestCore?.fresh()});
let state=fresh();
try{const raw=localStorage.getItem(STORE);if(raw){const parsed=JSON.parse(raw);if(parsed.schemaVersion!==1||!parsed.records||!LANGS.includes(parsed.locale)||typeof parsed.records!=='object')throw Error();state={...fresh(),...parsed};}}catch(e){try{broken=localStorage.getItem(STORE)||'unavailable';}catch{broken='unavailable';}}
state.english=window.ValeEnglishCore.normalise(state.english);
if(window.ValeMathTestCore)state.mathTests=window.ValeMathTestCore.normalise(state.mathTests);
let feedback={},ruleOpen=false,scratchOpen=false,waitingWorker=null,registration=null,canvasObserver=null,installPrompt=null,installedNow=false,offlineReady=false;
const $=q=>document.querySelector(q),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lang=()=>LANGS.includes(state.locale)?state.locale:'ru';
const isInstalled=()=>NATIVE||installedNow||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const tx=obj=>typeof obj==='string'?obj:obj?.[lang()]||obj?.ru||'';
function t(k,vars={}){let v=S[k]?.[LANGS.indexOf(lang())]||k;for(const[key,value]of Object.entries(vars))v=v.replaceAll('{'+key+'}',value);return v;}
const fnum=s=>String(s).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const unit=u=>tx(BOOK.units[u])||u||'';
function record(id){return state.records[id]||(state.records[id]={draft:{values:[],matches:[],order:[]},attempts:0,help:0});}
function persist(){
 if(broken)return false;
 try{localStorage.setItem(STORE,JSON.stringify(state));saveError=false;return true;}catch(e){saveError=true;toast(t('saveFail'));return false;}
}
function toast(msg){const el=$('#toast');el.textContent=msg;el.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.display='none',4500);}
function route(){const s=decodeURIComponent(location.hash.slice(1)||'home');return s.split('/');}
function taskById(id){return BOOK.tasks.find(x=>x.id===id);}
function chapter(id){return BOOK.chapters.find(x=>x.id===id);}
function counts(ids=BOOK.tasks.map(x=>x.id)){
 const rows=ids.map(id=>({task:taskById(id),r:state.records[id]})).filter(x=>x.r);
 const valid=rows.filter(x=>x.task?.type!=='measurement');
 return {done:valid.filter(x=>x.r.solved).length,independent:valid.filter(x=>x.r.first?.correct&&!x.r.first.assisted).length,
 first:valid.filter(x=>x.r.first).length,helped:valid.filter(x=>x.r.first?.correct&&x.r.first.assisted).length,
 corrected:valid.filter(x=>x.r.solved&&x.r.first&&!x.r.first.correct).length,
 shown:valid.filter(x=>x.r.originalOutcome==='revealed').length,
 skipped:valid.filter(x=>x.r.skipped&&!x.r.solved).length,
 measurement:rows.filter(x=>x.task?.type==='measurement'&&x.r.measureChecked).length};
}
function titleNum(q){return q.number.startsWith('w')?t('warm',{n:q.number.slice(1)}):q.number==='intro'?t('intro'):q.number==='think'?t('think'):t('taskNum',{n:q.number});}
const SUBJECTS=[{id:'math',active:'book',label:'mathematics',href:'#home',overview:mathOverview,detail:mathStatistics},{id:'english',active:'english',label:'english',href:'#english',overview:englishOverview,detail:englishStatistics}];
function shell(content,active='book'){
 canvasObserver?.disconnect();
 const total=counts();
 document.documentElement.lang=lang()==='sr'?'sr-Cyrl':lang();
 document.title=`Valja Study · ${active==='parent'?t('parent'):active==='profile'?t('profile'):active==='english'?t('english'):t('mathematics')}`;
 document.body.classList.toggle('large-text',!!state.large);
 $('#app').innerHTML=`<a class="skip" href="#main-content">${t('skip')}</a><div class="shell"><header class="topbar"><a href="#home" class="brand" aria-label="Valja Study"><span class="brand-icon" aria-hidden="true">▦</span><span>Valja Study<small>${t('tagline')}</small></span></a><div class="head-actions"><div class="lang" role="group" aria-label="Русский / Српски / English">${LANGS.map((l,i)=>`<button data-lang="${l}" lang="${l==='sr'?'sr-Cyrl':l}" title="${['Русский','Српски','English'][i]}" aria-label="${['Русский','Српски','English'][i]}" class="${lang()===l?'active':''}" aria-pressed="${lang()===l}">${['ру','ср','en'][i]}</button>`).join('')}</div><a href="#profile" class="header-avatar" aria-label="${t('profile')}" title="${t('profile')}">${avatarImage(true)}</a></div></header><nav class="top-tabs" aria-label="${t('subjectNavigation')}">${SUBJECTS.map(subject=>`<a class="${active===subject.active?'active':''}" ${active===subject.active?'aria-current="page"':''} href="${subject.href}">${t(subject.label)}</a>`).join('')}<a class="${active==='parent'?'active':''}" ${active==='parent'?'aria-current="page"':''} href="#stats">${t('parent')}</a><div class="right offline-chip"><span class="dot"></span>${t('localShort')}</div></nav>${broken?`<div class="save-warning" role="alert">${t('corrupt')}</div>`:saveError?`<div class="save-warning" role="alert">${t('saveFail')}</div>`:''}<div class="update-box" data-update-banner hidden><span data-update-status></span><button class="secondary" data-action="update">${t('updateNow')}</button></div><main id="main-content" class="main" tabindex="-1">${content}</main><footer><span>Valja Study · ${t('version',{v:APP_VERSION})} · ${active==='english'?'Smiles 4':active==='book'?t('pages',{p:BOOK.sourcePages}):t('localShort')}</span><span><a class="install-link" href="#install">${t('install')}</a> · ${t('local')} · <button data-action="update">${t('updateNow')}</button></span></footer></div>`;
 $('#close-source').setAttribute('aria-label',t('close'));
 paintUpdates();
 return total;
}

function avatarImage(small=false){
 if(avatar)return `<img class="avatar-image" src="${esc(avatar)}" alt="${small?'':t('yourAvatar')}">`;
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 22v-2a8 8 0 0 1 16 0v2"/></svg>`;
}
function settingsPanel(){return `<section class="panel profile-settings"><h2>${t('settings')}</h2><div class="setting-row"><label for="size">${t('mathSessionSize')}</label><select id="size" data-setting="size">${[5,8,12].map(n=>`<option ${state.size===n?'selected':''}>${n}</option>`).join('')}</select></div><p class="small-note">${t('mathSettingsNote')}</p><div class="setting-row"><label for="large">${t('largeText')}</label><select id="large" data-setting="large"><option value="0" ${!state.large?'selected':''}>${t('off')}</option><option value="1" ${state.large?'selected':''}>${t('on')}</option></select></div></section>`;}
function dataPanels(){return `<div id="profile-data" class="profile-data"><section class="panel update-panel"><h2>${t('dataUpdates')}</h2><p class="helper">Valja Study · ${t('version',{v:APP_VERSION})}</p><p>${t(NATIVE?'updateNativeHelp':'updateWebHelp')}</p><p class="update-status" data-update-status role="status" aria-live="polite"></p><progress data-update-progress max="100" value="0" hidden></progress><div class="parent-actions"><button class="primary" data-action="update">↻ ${t('updateNow')}</button><a class="secondary" data-update-installer href="${ANDROID_APK}" target="_blank" rel="noopener" hidden>${t('downloadAPK')}</a></div></section><section class="panel"><h2>${t('dataTitle')}</h2><p>${t('savedHere')}</p><p class="small-note">${t('dataText')}</p><div class="parent-actions"><button class="secondary" data-action="export">↓ ${t('export')}</button></div><details class="delete-data"><summary>${t('reset')}</summary><p class="small-note">${t('resetConfirm')}</p><button class="quiet danger" data-action="reset">${t('reset')}</button></details><a class="quiet" href="#install">${t('install')} →</a></section></div>`;}
function profileView(){
 shell(`<div class="profile-shell"><h1 class="page-title">${t('profile')}</h1><p class="intro">${t('profileIntro')}</p><section class="panel profile-card" aria-busy="${avatarBusy}"><h2>${t('yourAvatar')}</h2><div class="profile-picture">${avatarImage()}</div><input id="avatar-file" type="file" accept="image/*" hidden><div class="profile-actions"><button class="primary" data-action="avatar-choose" ${avatarBusy?'disabled':''}>${t(avatar?'avatarChange':'avatarChoose')}</button>${avatar?`<button class="secondary" data-action="avatar-remove" ${avatarBusy?'disabled':''}>${t('avatarRemove')}</button>`:''}</div>${avatarBusy?`<p class="helper" role="status">${t('avatarBusy')}</p>`:''}${avatarError?`<div class="feedback" role="alert">${t(avatarError)}</div>`:''}<p class="helper">${t('avatarCrop')}</p><p class="small-note profile-privacy">${t('avatarLocal')}</p></section>${settingsPanel()}${dataPanels()}</div>`,'profile');
}
async function chooseAvatar(file){
 if(avatarBusy)return;
 avatarBusy=true;avatarError='';render();
 let prepared;
 try{prepared=await AVATAR.prepare(file);}
 catch(error){avatarError=['avatarTypeError','avatarSizeError','avatarReadError'].includes(error.message)?error.message:'avatarReadError';}
 if(prepared){try{AVATAR.save(localStorage,prepared);avatar=prepared;}catch{avatarError='avatarStorageError';}}
 avatarBusy=false;render();
 if(!avatarError)toast(t('avatarSaved'));
}

const MATH_TOPICS=[{id:'area',title:'area',description:'areaDescription',chapters:BOOK.chapters,href:'#math/area'}];
function mathNav(ch=null){return `<nav class="math-navigation" aria-label="${t('mathNavigation')}"><a href="#home" class="secondary">☷ ${t('contents')}</a>${ch?`<span>${t('area')} · ${esc(tx(ch.title))}</span>`:''}</nav>`;}
function resumePanel(){
 const session=state.session,q=session&&!session.ended?taskById(session.ids[session.index]):null;
 return q?`<section class="resume-panel"><div><span class="eyebrow">${t('savedPlace')}</span><b>${t('area')} → ${esc(tx(chapter(q.chapter).title))}</b><small>${t('page',{p:q.page})} · ${titleNum(q)}</small></div><button class="primary" data-action="resume">${t('resumeTask')} →</button></section>`:'';
}
function topicContents(topic){
 const ids=topic.chapters.flatMap(ch=>BOOK.tasks.filter(q=>q.chapter===ch.id).map(q=>q.id)),c=counts(ids),total=ids.filter(id=>taskById(id).type!=='measurement').length;
 return `<section class="math-contents" data-math-topic="${topic.id}"><div class="topic-heading"><div><div class="eyebrow">${t('mathematics')}</div><h2>${t(topic.title)}</h2><p class="helper">${t(topic.description)}</p></div><span class="helper">${t('mathProgress',{n:c.done,total})}</span></div><div class="contents-grid">${topic.chapters.map((ch,i)=>{const qs=BOOK.tasks.filter(q=>q.chapter===ch.id),done=counts(qs.map(q=>q.id)).done,total=qs.filter(q=>q.type!=='measurement').length;return `<article class="contents-section"><div class="contents-section-head"><span class="chapter-icon ${ch.color}" aria-hidden="true">${ch.icon}</span><span class="chapter-number">${String(i+1).padStart(2,'0')}</span></div><h3><a href="#chapter/${ch.id}">${esc(tx(ch.title))}</a></h3><p class="helper">${t('pages',{p:ch.pages})} · ${t('mathProgress',{n:done,total})}</p><div class="contents-actions"><a class="secondary" href="#chapter/${ch.id}">${t('exercises')} →</a><a class="quiet" href="#chapter/${ch.id}/rules">${t('rules')}</a><a class="quiet" href="#chapter/${ch.id}/test">${t('mathTest')}</a></div></article>`;}).join('')}</div></section>`;
}
function home(){shell(`<div class="subject-heading"><h1 class="page-title">${t('mathematics')}</h1><p class="intro">${t('mathIntro')}</p></div>${resumePanel()}${mathTest?.resumePanel()||''}${mathTest?.collectionSummary()||''}${MATH_TOPICS.map(topicContents).join('')}<p class="small-note home-note">${t('sourceNote')}</p>`);}
function areaView(){shell(`${mathNav()}<h1 class="page-title">${t('area')}</h1>${resumePanel()}${mathTest?.resumePanel()||''}${topicContents(MATH_TOPICS[0])}<p class="small-note home-note">${t('sourceNote')}</p>`);}
function chapterTabs(id,active){return `<nav class="subject-tabs" aria-label="${t('sectionNavigation')}">${[['tasks','#chapter/'+id,'exercises'],['rules','#chapter/'+id+'/rules','rules'],['test','#chapter/'+id+'/test','mathTest']].map(([key,href,label])=>`<a href="${href}" class="${active===key?'active':''}" ${active===key?'aria-current="page"':''}>${t(label)}</a>`).join('')}</nav>`;}
function chapterView(id,mode='tasks'){
 const ch=chapter(id);if(!ch)return home();
 const qs=BOOK.tasks.filter(q=>q.chapter===id),c=counts(qs.map(x=>x.id)),rules=mode==='rules';
 const tabs=chapterTabs(id,rules?'rules':'tasks');
 const exercises=`<section class="panel"><div class="chapter-controls"><button class="primary" data-action="start" data-chapter="${id}">${t('startChapter',{n:Math.min(state.size,qs.filter(q=>!state.records[q.id]?.solved&&q.type!=='measurement').length||qs.filter(q=>q.type!=='measurement').length)})} →</button><button class="secondary" data-action="source" data-page="${qs[0].page}">${t('source')}</button></div><p class="small-note">${t('countHint',{n:state.size})}</p><h2>${t('allCards')}</h2><div class="all-tasks-list">${qs.map(q=>{const r=state.records[q.id];return `<a href="#task/${q.id}" data-open-task="${q.id}"><span class="status">${r?.solved?'✓':q.type==='measurement'?'⌖':'○'}</span><span>${esc(tx(q.prompt))}<span class="meta">${t('page',{p:q.page})} · ${titleNum(q)}</span></span></a>`;}).join('')}</div></section>`;
 const notes=`<section class="panel"><h2>${t('rules')}</h2><ul class="note-list">${BOOK.notes[id].map(n=>`<li>${esc(tx(n))}</li>`).join('')}</ul><a class="primary" href="#chapter/${id}">${t('exercises')} →</a><button class="quiet" data-action="source" data-page="${qs[0].page}">${t('source')}</button></section>`;
 shell(`${mathNav(ch)}<div class="breadcrumb"><a href="#math/area">${t('area')}</a><span>›</span><span>${t('pages',{p:ch.pages})}</span></div><h1 class="page-title">${esc(tx(ch.title))}</h1>${tabs}<div class="study-layout"><div class="study-main">${rules?notes:exercises}</div><aside class="panel aside-card"><div class="eyebrow">${t('solved')}</div><div class="big">${c.done}<span class="stat-denominator"> / ${qs.filter(q=>q.type!=='measurement').length}</span></div><div class="stat-list"><div><span>${t('independent')}</span><b>${c.independent}</b></div><div><span>${t('helped')}</span><b>${c.helped}</b></div><div><span>${t('corrected')}</span><b>${c.corrected}</b></div></div></aside></div>`);
}
function start(id=null,review=false,startAt=null){
 let qs=BOOK.tasks.filter(q=>(!id||q.chapter===id));
 if(!startAt)qs=qs.filter(q=>q.type!=='measurement');
 if(review){qs=qs.filter(q=>{const r=state.records[q.id];return q.type!=='measurement'&&r&&!r.reviewMastered&&(r.first&&(!r.first.correct||r.first.assisted)||r.everHelp||r.originalOutcome==='revealed'||r.skipped);});}
 else if(startAt){const pos=qs.findIndex(q=>q.id===startAt);qs=qs.slice(Math.max(0,pos));}
 else {const unfinished=qs.filter(q=>!state.records[q.id]?.solved&&!state.records[q.id]?.measureChecked);if(unfinished.length)qs=unfinished;}
 const chosen=qs.slice(0,state.size);
 if(!chosen.length){toast(t('reviewEmpty'));return;}
 state.session={ids:chosen.map(q=>q.id),index:0,review,ended:false};
 for(const q of chosen){const r=record(q.id);if(review||r.locked){r.locked=false;r.roundFirst=null;r.lastDigest=null;r.help=0;r.draft={values:[],matches:[],order:[]};r.reviewCount=(r.reviewCount||0)+1;r.inReview=true;}}
 persist();ruleOpen=false;scratchOpen=false;location.hash='task/'+chosen[0].id;render();
}
function currentSession(q){return state.session&&!state.session.ended&&state.session.ids.includes(q.id)?state.session:null;}
function renderFields(q,r){
 const d=r.draft||{},locked=!!r.locked;
 let choiceHtml='';
 const opts=q.type==='choice'?q.options:q.leadChoice?.options;
 if(opts)choiceHtml=`<div class="choices" role="group" aria-label="${t('answer')}">${opts.map(o=>`<button type="button" class="choice ${d.choice===o.id?'selected':''}" data-action="choose" data-value="${esc(o.id)}" aria-pressed="${d.choice===o.id}" ${locked?'disabled':''}>${esc(tx(o.text))}</button>`).join('')}</div>`;
 if(q.type==='choice')return choiceHtml;
 if(q.type==='sort'){
  const order=d.order||[];
  return `<p class="helper">${t('orderHelp')}</p><div class="order-result" aria-live="polite">${order.map((x,i)=>`<span class="order-item"><b>${i+1}</b>${esc(tx(q.items[Number(x)]))}</span>`).join('')||'…'}</div><div class="choices">${q.items.map((x,i)=>`<button class="choice" type="button" data-action="sort-add" data-value="${i}" ${order.includes(String(i))||locked?'disabled':''}>${esc(tx(x))}</button>`).join('')}</div>${!locked?`<button type="button" class="quiet" data-action="sort-undo">↶ ${t('orderUndo')}</button>`:''}`;
 }
 if(q.type==='match')return `<div class="pairs">${q.left.map((x,i)=>`<div class="pair"><span id="pair-label-${i}">${esc(tx(x))}</span><span class="arrow" aria-hidden="true">→</span><select data-match="${i}" aria-labelledby="pair-label-${i}" ${locked?'disabled':''}><option value="">${t('select')}</option>${q.right.map((y,j)=>`<option value="${j}" ${d.matches?.[i]===String(j)?'selected':''}>${esc(tx(y))}</option>`).join('')}</select></div>`).join('')}</div>`;
 return choiceHtml+`<div class="answer-fields ${q.fields.length===2?'two':''}">${q.fields.map((f,i)=>`<div class="answer-field"><label for="ans-${i}">${esc(tx(f.label))}</label><div class="input-wrap"><input id="ans-${i}" data-field="${i}" inputmode="numeric" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="65" value="${esc(d.values?.[i]||'')}" aria-label="${esc(tx(f.label)+' '+unit(f.unit))}" ${locked?'readonly':''}><span class="unit" aria-hidden="true">${esc(unit(f.unit))}</span></div></div>`).join('')}</div>`;
}
function diagram(kind){
 const description={
  grid30:{ru:'Прямоугольник: 3 ряда по 10 квадратных плиток.',sr:'Правоугаоник: 3 реда по 10 квадратних плочица.',en:'Rectangle: 3 rows of 10 square tiles.'},
  notch18:{ru:'Прямоугольник высотой 8 дм. Вдоль верхнего края: 2 дм, вырез шириной 13 дм, затем 1 дм. Глубина выреза 30 см.',sr:'Правоугаоник висине 8 dm. Горњом ивицом: 2 dm, изрез ширине 13 dm, затим 1 dm. Дубина изреза је 30 cm.',en:'Rectangle, height 8 dm. Along its top: 2 dm, a cut-out 13 dm wide, then 1 dm. Cut-out depth: 30 cm.'},
  notch21:{ru:'Квадрат 5 на 5 см, сверху прямоугольный вырез шириной 3 см и глубиной 1 см. По краям выреза остаётся по 1 см.',sr:'Квадрат 5 пута 5 cm, са горње стране изрез ширине 3 cm и дубине 1 cm. Са обе стране изреза остаје по 1 cm.',en:'A 5 by 5 cm square with a top cut-out 3 cm wide and 1 cm deep. A 1 cm strip remains on either side.'},
  hole24:{ru:'Внешний прямоугольник 100 дм на 7 м. Белый внутренний вырез состоит из полосы 8 м на 1 м и надстройки слева 2 м на 1 м.',sr:'Спољни правоугаоник је 100 dm пута 7 m. Бели унутрашњи изрез састоји се од траке 8 m пута 1 m и горњег левог дела 2 m пута 1 m.',en:'Outer rectangle: 100 dm by 7 m. Its white inner cut-out consists of an 8 m by 1 m strip and a 2 m by 1 m extension above its left end.'},
  step27:{ru:'Ступенчатая фигура: нижняя сторона 10 см, правая высота 15 см, левая нижняя высота 8 см, ширина ступеньки 3 см.',sr:'Степенаста фигура: доња страница 10 cm, десна висина 15 cm, доња лева висина 8 cm, ширина степеника 3 cm.',en:'Stepped figure: bottom width 10 cm, right height 15 cm, lower left height 8 cm, step width 3 cm.'},
  measureRects:{ru:'Два прямоугольника А и Б без подписанных размеров. Для измерения нужен оригинал в книге.',sr:'Два правоугаоника А и Б без уписаних мера. За мерење је потребан оригинал у књизи.',en:'Rectangles A and B, without labelled dimensions. Measure the original in the printed book.'},
  measureSquare:{ru:'Квадрат NKLM без подписанных размеров. Для измерения нужен оригинал в книге.',sr:'Квадрат NKLM без уписаних мера. За мерење је потребан оригинал у књизи.',en:'Square NKLM, without labelled dimensions. Measure the original in the printed book.'}
 };
 const svg=(content,w=380,h=220)=>`<div class="diagram"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(tx(description[kind]))}">${content}</svg><p class="diagram-caption">${t('scheme')}</p></div>`;
 if(kind==='grid30')return svg(`<rect class="shape" x="35" y="35" width="300" height="90"/>${Array.from({length:9},(_,i)=>`<path d="M${65+i*30} 35v90" stroke="#7eaba1"/>`).join('')}<path d="M35 65h300M35 95h300" stroke="#7eaba1"/><text x="135" y="162">10 × 3</text>`);
 if(kind==='notch18')return svg('<path class="shape" d="M45 190V50H80V103H307V50H325V190Z"/><path class="dim" d="M45 30H80M80 30H307M307 30H325M27 50V190"/><text x="40" y="22">2 dm</text><text x="170" y="22">13 dm</text><text x="305" y="22">1 dm</text><text x="3" y="125" transform="rotate(-90 12 125)">8 dm</text><text x="93" y="82">30 cm</text>');
 if(kind==='notch21')return svg('<path class="shape" d="M80 190V30H112V62H208V30H240V190Z"/><text x="143" y="215">5 cm</text><text x="267" y="121" transform="rotate(-90 267 121)">5 cm</text><text x="90" y="22">1 cm</text><text x="211" y="22">1 cm</text><text x="141" y="84">3 cm</text><text x="213" y="55">1 cm</text>');
 if(kind==='hole24')return svg('<rect class="shape" x="45" y="35" width="280" height="160"/><path d="M73 87H129V110H297V133H73Z" fill="#fff" stroke="#70968a"/><text x="145" y="23">100 dm</text><text x="333" y="119">7 m</text><text x="169" y="158">8 m</text><text x="82" y="79">2 m</text><text x="137" y="103">1 m</text><text x="297" y="130">1 m</text>');
 if(kind==='step27')return svg('<path class="shape" d="M110 195V105H146V27H230V195Z"/><text x="149" y="215">10 cm</text><text x="251" y="124" transform="rotate(-90 251 124)">15 cm</text><text x="84" y="163" transform="rotate(-90 84 163)">8 cm</text><text x="110" y="95">3 cm</text>');
 if(kind==='measureRects')return svg('<rect class="shape" x="65" y="65" width="120" height="90"/><rect x="235" y="35" width="58" height="155" fill="#91bff0" stroke="#2f6ca5"/><text x="116" y="115">A</text><text x="259" y="115">Б</text>');
 if(kind==='measureSquare')return svg('<rect class="shape" x="120" y="45" width="130" height="130"/><text x="107" y="38">N</text><text x="250" y="38">M</text><text x="108" y="194">K</text><text x="252" y="194">L</text>');
 return '';
}
function measureFields(q,r){
 const keys=q.measurement==='square'?['side','squareArea']:['sideA','sideB','sideC','sideD','areaA','areaB','difference'];
 return `<div class="feedback info"><strong>${t('measureTitle')}</strong><p>${t('measureText')}</p></div><div class="measure-grid">${keys.map((k,i)=>`<div><label for="measure-${i}">${t(k)}</label><input id="measure-${i}" data-measure="${i}" inputmode="numeric" autocomplete="off" value="${esc(r.draft?.values?.[i]||'')}" ${r.locked?'readonly':''}></div>`).join('')}</div>`;
}
function resultHtml(q,r){
 const fb=feedback[q.id];
 if(fb?.format)return `<div id="feedback" class="feedback" role="status"><strong>${t(fb.format)}</strong></div>`;
 if(q.type==='measurement'&&(fb?.measure||r.measureChecked)){const result=fb?.measure||{correct:true,computed:r.measureComputed||[]};return `<div id="feedback" class="feedback ${result.correct?'ok':''}" role="status"><strong>${t(result.correct?'arithmeticChecked':'tryAgain')}</strong>${result.correct?`<p>${t('measureResult',{values:result.computed.map(fnum).join(' / ')})}</p>`:`<p>${t('tryText')}</p>`}</div>`;}
 if(r.locked){
  const outcome=r.originalOutcome==='revealed'&&!r.solved?'revealed':r.lastOutcome||'revealed';
  let solutions='';
  if(q.type==='numeric')solutions=q.fields.map(f=>`${esc(tx(f.label))}: <b>${fnum(f.answer)} ${esc(unit(f.unit))}</b>`).join('<br>');
  if(q.type==='choice')solutions=esc(tx(q.options.find(x=>x.id===q.answer)?.text));
  if(q.type==='sort')solutions=q.answer.map(i=>esc(tx(q.items[Number(i)]))).join(' → ');
  if(q.type==='match')solutions=q.left.map((x,i)=>`${esc(tx(x))} → ${esc(tx(q.right[Number(q.answers[i])]))}`).join('<br>');
  if(q.leadChoice)solutions=esc(tx(q.leadChoice.options.find(o=>o.id===q.leadChoice.answer)?.text))+'<br>'+solutions;
  return `<div id="feedback" class="feedback ${r.solved?'ok':'info'}" role="status"><strong>${t(r.solved?'correct':'showSolution')} · ${t(r.inReview&&outcome==='independent'?'reviewIndependent':outcome)}</strong><p>${solutions}</p><p class="explanation">${esc(tx(q.explanation))}</p>${r.first&&!r.first.correct?`<p class="helper">${t('firstKept')}</p>`:''}${q.note?`<p class="helper">${esc(tx(q.note))}</p>`:''}</div>`;
 }
 if(fb?.wrong||r.lastCorrect===false){
  let wrongUnit=false;
  if(q.fields.length===1){const p=CORE.parseInteger(r.draft?.values?.[0]);if(p.ok){const expected=BigInt(q.fields[0].answer),actual=BigInt(p.value);wrongUnit=expected>0n&&(expected===actual*10n||actual===expected*10n);}}
  return `<div id="feedback" class="feedback" role="status"><strong>${t('tryAgain')}</strong><p>${t(wrongUnit?'unitHint':'tryText')}</p></div>`;
 }
 return '';
}
function ruleContent(q){return `<div class="rule-sheet"><h3>${t('learn')}</h3>${BOOK.notes[q.chapter].map(n=>`<p>${esc(tx(n))}</p>`).join('')}</div>`;}
function taskView(id){
 const q=taskById(id);if(!q)return home();
 const r=record(id),session=currentSession(q),index=session?session.ids.indexOf(id):0;
 if(session)session.index=index;
 const nextLabel=session&&index===session.ids.length-1?'toSummary':'next';
 const finished=r.locked||r.measureChecked;
 shell(`<div class="task-shell">${mathNav(chapter(q.chapter))}<div class="breadcrumb"><a href="#home">${t('mathematics')}</a><span>›</span><a href="#math/area">${t('area')}</a><span>›</span><a href="#chapter/${q.chapter}">${esc(tx(chapter(q.chapter).title))}</a></div><div class="task-top"><div>${session?t('position',{n:index+1,total:session.ids.length}):t('page',{p:q.page})}</div><div class="task-tools"><button class="quiet" data-action="source" data-page="${q.page}">▤ ${t('source')}</button><button class="quiet" data-action="rule">▦ ${t('rules')}</button><button class="quiet" data-action="scratch">✎ ${t('scratch')}</button></div></div>${session?`<div class="progress-track" style="margin:0 0 20px"><div class="progress-fill" style="width:${100*index/session.ids.length}%"></div></div>`:''}<section class="task-card"><div class="task-label">${t('page',{p:q.page})} · ${titleNum(q)} ${r.inReview?`<span class="badge">${t('review')}</span>`:''}</div><h1 class="task-question ${q.prompt.en.includes(' = ? ')||q.type==='choice'&&q.options[0]?.id==='<'?'math':''}">${esc(tx(q.prompt))}</h1>${q.diagram?diagram(q.diagram):''}<form id="answer-form" novalidate>${q.type==='measurement'?measureFields(q,r):renderFields(q,r)}${resultHtml(q,r)}${r.help&&!r.locked?`<div class="feedback info"><strong>${t('hint')}</strong><p>${t('hintText')}</p></div>`:''}<div class="task-bottom">${finished?`<button type="button" class="primary" data-action="next">${t(nextLabel)} →</button>`:`<button type="submit" class="primary">${t('check')} ✓</button>${q.type!=='measurement'?`<button type="button" class="secondary" data-action="hint">${t('hint')}</button>`:''}`}<span class="spacer"></span>${!finished?`<button type="button" class="quiet" data-action="skip">${t('skipTask')}</button>`:''}${!r.locked&&q.type!=='measurement'?`<button type="button" class="quiet" data-action="reveal">${t('showAnswer')}</button>`:''}</div></form>${ruleOpen?ruleContent(q):''}</section>${scratchOpen?`<section class="scratch"><div class="scratch-head"><span>✎ ${t('scratch')}</span><div><button data-action="scratch-undo">${t('undo')}</button> <button data-action="scratch-clear">${t('clear')}</button></div></div><canvas id="scratch-canvas" aria-label="${t('canvasLabel')}"></canvas><p class="small-note" style="padding:0 14px">${t('scratchInfo')}</p></section>`:''}${q.type==='measurement'?`<p class="small-note">${t('measureUnavailable')}</p>`:''}${session?`<div style="text-align:center;margin-top:17px"><button class="quiet" data-action="end">${t('endSession')}</button></div>`:''}</div>`);
 if(scratchOpen)setupCanvas(q.id);
 markErrors(q);
}
function markErrors(q){
 const fb=feedback[q.id];if(!fb)return;
 if(fb.field!==undefined){const input=$(`[data-field="${fb.field}"],[data-measure="${fb.field}"]`);input?.setAttribute('aria-invalid','true');}
 for(const key of fb.wrong||[]){let e;if(key.startsWith('field'))e=$(`[data-field="${key.slice(5)}"]`);if(key.startsWith('match'))e=$(`[data-match="${key.slice(5)}"]`);e?.setAttribute('aria-invalid','true');}
}
function summary(){
 const ids=state.session?.ids||BOOK.tasks.map(x=>x.id),c=counts(ids);
 shell(`<div class="task-shell"><div class="summary-title"><div class="summary-icon">✓</div><h1>${t('summary')}</h1><p class="intro" style="margin:auto">${t('summaryText')}</p></div><div class="stats-grid">${[['independent',c.independent],['helped',c.helped],['corrected',c.corrected],['shown',c.shown]].map(([key,n])=>`<div class="stat"><b>${n}</b><span>${t(key)}</span></div>`).join('')}</div><section class="panel"><div class="history-row"><span>${t('skipped')}</span><b>${c.skipped}</b></div>${ids.map(id=>{const q=taskById(id),r=state.records[id];const status=q.type==='measurement'?'measureUnavailable':r?.solved?(r.first?.correct?(r.first.assisted?'helped':'independent'):'corrected'):r?.originalOutcome==='revealed'?'revealed':r?.skipped?'skipped':'unanswered';return `<div class="history-row"><a href="#task/${id}">${t('page',{p:q.page})} · ${titleNum(q)}</a><span>${t(status)}</span></div>`;}).join('')}<div class="parent-actions"><button class="primary" data-action="review">${t('review')} ↻</button><button class="secondary" data-action="new">${t('newSession')}</button><a class="quiet" href="#home">${t('home')}</a></div><p class="small-note">${t('reviewNote')}</p></section></div>`);
}
function vocabularyStats(list=[...window.VALE_ENGLISH.words,...state.english.customWords]){return window.ValeEnglishCore.progress(list,state.english);}
function metricTiles(items){return `<div class="stats-grid">${items.map(([label,n])=>`<div class="stat"><b>${n}</b><span>${t(label)}</span></div>`).join('')}</div>`;}
function mathOverview(){const c=counts();return {caption:t('area'),headline:t('mathProgress',{n:c.done,total:BOOK.tasks.filter(q=>q.type!=='measurement').length}),metrics:[['independent',c.independent],['corrected',c.corrected]],linkLabel:'contents'};}
function englishOverview(){const e=vocabularyStats();return {caption:'Smiles 4',headline:t('vocabularyProgress',{n:e.seen,total:e.total}),metrics:[['dueWords',e.due],['establishedWords',e.learned]],linkLabel:'englishTopics'};}
function subjectStatsCard(subject){
 const overview=subject.overview();
 return `<article class="panel subject-stat-card" data-stat-subject="${subject.id}"><div class="eyebrow">${esc(overview.caption)}</div><h2>${t(subject.label)}</h2><p class="subject-stat-headline">${overview.headline}</p><div class="stat-list">${overview.metrics.map(([label,n])=>`<div><span>${t(label)}</span><b>${n}</b></div>`).join('')}</div><div class="parent-actions"><a class="secondary" href="#stats/${subject.id}">${t('details')} →</a><a class="quiet" href="${subject.href}">${t(overview.linkLabel)}</a></div></article>`;
}
function mathStatistics(){
 const c=counts();
 return `${mathTest?.statistics()||''}<p class="helper">${t('mathStatisticsNote')}</p>${metricTiles([['independent',c.independent],['helped',c.helped],['corrected',c.corrected],['shown',c.shown]])}<section class="panel"><h2>${t('firstAnswers')}: ${c.independent} / ${c.first}</h2><p class="helper">${t('firstDefinition')}</p><p class="small-note">${t('noScoreMeasure')}</p><div class="stat-list">${BOOK.chapters.map(ch=>{const cc=counts(BOOK.tasks.filter(q=>q.chapter===ch.id).map(q=>q.id));return `<div><a href="#chapter/${ch.id}">${esc(tx(ch.title))}</a><b>${cc.independent} / ${cc.first}</b></div>`;}).join('')}</div><div class="parent-actions"><button class="secondary" data-action="review">${t('review')}</button><a class="quiet" href="#home">${t('contents')}</a></div></section>`;
}
function englishTestStatistics(){return `<div class="subject-stat-grid english-test-statistics">${[['vocabulary','assessmentTests','#english/quiz'],['grammar','assessmentGrammar','#english/grammar']].map(([kind,label,href])=>{const r=state.english.results[kind];return `<section class="panel"><h2>${t(label)}</h2><p>${t('completedTests')}: <b>${r.attempts}</b></p><p class="helper">${r.last?t('lastTestScore',{n:r.last.score,total:r.last.total}):t('noTestsYet')}</p><a class="secondary" href="${href}">${t(label)} →</a></section>`;}).join('')}</div><p class="small-note">${t('testResultsNote')}</p>`;}
function englishStatistics(){
 const all=[...window.VALE_ENGLISH.words,...state.english.customWords],e=vocabularyStats(all),topics=[...window.VALE_ENGLISH.topics,...(state.english.customWords.length?[{id:'custom',title:{ru:t('ownWords')}}]:[])];
 return `${englishTestStatistics()}${metricTiles([['wordsStudied',e.seen],['dueWords',e.due],['establishedWords',e.learned],['wordReviews',e.reviews]])}<p class="helper">${t('englishStatisticsNote')}</p><section class="panel"><h2>${t('englishTopics')}</h2><div class="vocabulary-stat-list">${topics.map(topic=>{const cc=vocabularyStats(all.filter(w=>String(w.unit)===topic.id));return `<a href="${topic.id==='custom'?'#english/custom':'#english/unit/'+topic.id}" class="vocabulary-stat-row"><span>${esc(tx(topic.title))}</span><span>${t('topicWords',{n:cc.seen,total:cc.total,due:cc.due})}</span></a>`;}).join('')}</div><p class="small-note">${t('unseenWords')}: ${e.new}</p><a class="secondary" href="#english">${t('english')} →</a></section>`;
}
function statisticsView(id){
 const subject=SUBJECTS.find(item=>item.id===id);
 shell(`<h1 class="page-title">${t('parent')}</h1><p class="intro">${t('statisticsIntro')}</p><nav class="subject-tabs" aria-label="${t('parent')}"><a href="#stats" class="${!subject?'active':''}" ${!subject?'aria-current="page"':''}>${t('allStatistics')}</a>${SUBJECTS.map(item=>`<a href="#stats/${item.id}" class="${subject?.id===item.id?'active':''}" ${subject?.id===item.id?'aria-current="page"':''}>${t(item.label)}</a>`).join('')}</nav>${subject?`<h2 class="subject-stat-title">${t(subject.label)}</h2>${subject.detail()}`:`<div class="subject-stat-grid">${SUBJECTS.map(subjectStatsCard).join('')}</div>`}<p class="small-note">${t('statisticsLocal')}</p>`,'parent');
}
function installView(){
 const ready=isInstalled();
 shell(`<div class="task-shell"><div class="breadcrumb"><a href="#home">${t('home')}</a><span>›</span><span>${t('install')}</span></div><div class="eyebrow">Valja Study · ${t('version',{v:APP_VERSION})}</div><h1 class="page-title">${t('installTitle')}</h1><p class="intro">${t('nativeIntro')}</p>${NATIVE?`<section class="install-banner"><div><h2>${t('nativeInstalled')}</h2><p>${t('nativeUpdate')}</p></div></section>`:''}<div class="install-layout"><section class="panel"><div class="install-icon" aria-hidden="true">▱</div><h2>Android</h2><p class="helper">${t('androidAPKHelp')}</p><a class="primary" href="${ANDROID_APK}" target="_blank" rel="noopener">↓ ${t('downloadAPK')}</a></section><section class="panel"><div class="install-icon" aria-hidden="true">▯</div><h2>iOS · iPadOS</h2><p>${t('iosPending')}</p><p class="small-note">${t('iosNeedsApple')}</p></section></div><p class="small-note">${t('nativeData')}</p>${!NATIVE?`<details class="panel web-alternative"><summary>${t('webAlternative')}</summary><p class="helper">${t('installIntro')}</p>${installPrompt&&!ready?`<button class="secondary" data-action="install-native">${t('installNative')}</button>`:''}<div class="install-layout"><section><h2>iPad · Safari</h2><ol class="install-steps"><li>${t('ipadStep1')}</li><li>${t('ipadStep2')}</li><li>${t('ipadStep3')}</li></ol></section><section><h2>Android · Chrome</h2><ol class="install-steps"><li>${t('androidStep1')}</li><li>${t('androidStep2')}</li><li>${t('androidStep3')}</li></ol></section></div><p class="install-status" role="status">${t(offlineReady?'offlineReady':'offlinePreparing')}</p></details>`:''}<a class="quiet" href="#home">← ${t('home')}</a></div>`);
 }

const updater=window.ValeUpdates.create({version:APP_VERSION,native:NATIVE,bridge:window.ValeNative,
 save:persist,online:()=>navigator.onLine,fetch:(...args)=>fetch(...args),
 manifestURL:NATIVE?window.ValeUpdates.BASE+'version.json':new URL('version.json',location.href).href.split('#')[0],
 getRegistration:()=>registration||('serviceWorker' in navigator?navigator.serviceWorker.ready:null),serviceWorker:navigator.serviceWorker,
 onChange:()=>paintUpdates()});
function updateMessage(){
 const u=updater.state();
 if(u.status==='available')return t('updateAvailable',{v:u.latest?.version||''});
 if(u.status==='checking')return t('updateChecking');
 if(u.status==='downloading')return t('updateDownloading')+(NATIVE&&u.progress?' '+Math.round(u.progress)+'%':'');
 if(u.status==='applying')return t('updateApplying');
 if(u.status==='current')return t('updateCurrent');
 if(u.status==='error')return t(u.error==='save'?'saveFail':u.error==='native-required'?'updateNeedNative':u.error==='unavailable'?'updateUnavailable':['checksum','manifest'].includes(u.error)?'updateInvalid':'updateNetwork');
 return t('updateIdle');
}
function paintUpdates(){
 const u=updater.state(),busy=['checking','downloading','applying'].includes(u.status);
 document.querySelectorAll('[data-update-status]').forEach(el=>{el.textContent=updateMessage();el.classList.toggle('update-error',u.status==='error');});
 document.querySelectorAll('[data-update-banner]').forEach(el=>{el.hidden=['profile','updates'].includes(route()[0])||!['available','checking','downloading','applying','error'].includes(u.status);});
 document.querySelectorAll('[data-action="update"],[data-action="apply-update"]').forEach(el=>{el.disabled=busy;el.setAttribute('aria-busy',String(busy));});
 document.querySelectorAll('[data-update-progress]').forEach(el=>{el.hidden=!(NATIVE&&u.status==='downloading');el.value=u.progress;});
 document.querySelectorAll('[data-update-installer]').forEach(el=>{el.hidden=!(u.status==='error'&&u.error==='native-required');});
}
function updatesView(){profileView();}

const english=window.ValeEnglish.create({shell,lang,getState:()=>state.english,saveState:next=>{const old=state.english;state.english=next;if(persist())return true;state.english=old;return false;},toast});
const mathTest=window.ValeMathTestUI?.create({shell,lang,chapter,mathNav,tabs:chapterTabs,parse:CORE.parseInteger,getState:()=>state.mathTests,saveState:next=>{const old=state.mathTests;state.mathTests=next;if(persist())return true;state.mathTests=old;return false;}});
function render(){const r=route();english.stopMedia();if(r[0]==='updates')updatesView();else if(r[0]==='math'&&r[1]==='area')areaView();else if(r[0]==='english')english.render(r.slice(1));else if(r[0]==='task')taskView(r[1]);else if(r[0]==='chapter'&&r[2]==='test'&&mathTest)mathTest.render(r[1],r[3],r[4]);else if(r[0]==='chapter')chapterView(r[1],r[2]);else if(r[0]==='stats'||r[0]==='parent')statisticsView(r[1]);else if(r[0]==='rules')areaView();else if(r[0]==='install')installView();else if(r[0]==='profile')profileView();else if(r[0]==='summary')summary();else home();}

function currentTask(){const r=route();return r[0]==='task'?taskById(r[1]):null;}
function submit(){
 const q=currentTask();if(!q)return;const r=record(q.id);
 if(q.type==='measurement'){
  const result=CORE.measurement(q,r.draft?.values||[]);
  if(!result.valid){feedback[q.id]={format:result.error,field:result.field};render();return;}
  feedback[q.id]={measure:result};if(result.correct){r.measureChecked=true;r.measureComputed=result.computed;r.locked=true;}persist();render();return;
 }
 const result=CORE.check(q,r.draft||{});
 if(!result.valid){feedback[q.id]={format:result.error,field:result.field};render();$('[aria-invalid="true"]')?.focus();return;}
 const out=CORE.apply(r,result);state.records[q.id]=out.record;
 if(out.changed&&r.inReview){if(result.correct){out.record.reviewSuccess=(out.record.roundFirst?.correct&&!out.record.roundFirst.assisted)?(out.record.reviewSuccess||0)+1:0;out.record.reviewMastered=out.record.reviewSuccess>=2;}else{out.record.reviewSuccess=0;out.record.reviewMastered=false;}}
 feedback[q.id]=result.correct?{}:{wrong:result.wrong};persist();render();
}
function next(){
 const q=currentTask();if(!q)return;
 const session=currentSession(q);ruleOpen=false;scratchOpen=false;
 if(session){session.index=session.ids.indexOf(q.id)+1;if(session.index>=session.ids.length){session.ended=true;persist();location.hash='summary';}else{persist();location.hash='task/'+session.ids[session.index];}}
 else{location.hash='chapter/'+q.chapter;}
}
function openSource(p){
 const q=BOOK.tasks.find(x=>x.page===Number(p)),source=BOOK.sourceImages?.[p]||q?.source;
 if(!source){return;}
 $('#source-content').innerHTML=`<p>${t('sourceDescription',{p})}</p><img src="${esc(window.VALE_ASSET_DATA?.[source]||source)}" alt="${esc(t('pages',{p:Number(p)%2?`${Number(p)-1}–${p}`:`${p}–${Number(p)+1}`}))}">`;
 $('#source-dialog').showModal();
}
document.addEventListener('submit',e=>{if(['math-test-start','math-test-answer-form','math-test-correction'].includes(e.target.id)){e.preventDefault();mathTest?.handleSubmit(e.target);return;}if(e.target.id==='answer-form'){e.preventDefault();submit();}});
document.addEventListener('input',e=>{
 if(mathTest?.handleInput(e.target))return;
 const q=currentTask();if(!q)return;const r=record(q.id);
 if(e.target.matches('[data-field],[data-measure]')){
  const idx=Number(e.target.dataset.field??e.target.dataset.measure);r.draft.values||=[];r.draft.values[idx]=e.target.value;
  delete feedback[q.id];e.target.removeAttribute('aria-invalid');persist();
 }
});
document.addEventListener('change',async e=>{
 if(e.target.id==='avatar-file'){const file=e.target.files?.[0];if(file)await chooseAvatar(file);return;}
 if(e.target.matches('[data-match]')){const q=currentTask(),r=record(q.id);r.draft.matches||=[];r.draft.matches[Number(e.target.dataset.match)]=e.target.value;delete feedback[q.id];persist();}
 if(e.target.matches('[data-setting]')){const key=e.target.dataset.setting;state[key]=key==='large'?e.target.value==='1':Number(e.target.value);persist();render();}
});
document.addEventListener('submit',e=>{if(['english-add-form','english-quiz-form'].includes(e.target.id)){e.preventDefault();english.handleSubmit(e.target);}});
document.addEventListener('input',e=>{if(e.target.id==='english-search')english.search(e.target.value);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)english.stopMedia();});
document.addEventListener('click',async e=>{
 const locale=e.target.closest('[data-lang]');if(locale){state.locale=locale.dataset.lang;persist();render();toast(t('langSaved'));return;}
 const open=e.target.closest('[data-open-task]');if(open){e.preventDefault();const q=taskById(open.dataset.openTask);start(q.chapter,false,q.id);return;}
 const el=e.target.closest('[data-action]');if(!el)return;
 if(mathTest?.handleClick(el))return;
 if(english.handleClick(el))return;
 const action=el.dataset.action,q=currentTask(),r=q?record(q.id):null;

 if(action==='avatar-choose'){if(!avatarBusy)$('#avatar-file')?.click();return;}
 if(action==='avatar-remove'){if(avatarBusy)return;try{AVATAR.remove(localStorage);avatar='';avatarError='';render();toast(t('avatarRemoved'));}catch{avatarError='avatarStorageError';render();}return;}
 if(action==='install-native'){if(!installPrompt){location.hash='install';return;}const prompt=installPrompt;installPrompt=null;await prompt.prompt();await prompt.userChoice;render();return;}
 if(action==='start'){start(el.dataset.chapter||null);return;}
 if(action==='resume'){const s=state.session;if(s?.ids[s.index])location.hash='task/'+s.ids[s.index];return;}
 if(action==='new'){state.session=null;start();return;}
 if(action==='review'){start(null,true);return;}
 if(action==='source'){openSource(el.dataset.page);return;}
 if(action==='export'){const data=broken||JSON.stringify({application:'Valja Study',appVersion:APP_VERSION,exportVersion:1,avatarIncluded:false,state},null,2);if(NATIVE){try{await window.ValeNative.exportJSON(data);}catch{toast(t('exportFail'));}return;}const blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Vale_Study_progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;}
 if(action==='reset'){if(!confirm(t('resetConfirm')))return;try{localStorage.removeItem(STORE);AVATAR.remove(localStorage);avatar='';avatarError='';state=fresh();broken=null;saveError=false;feedback={};location.hash='home';render();toast(t('deleted'));}catch{toast(t('saveFail'));}return;}
 if(action==='update'||action==='apply-update'){const result=await updater.update();if(result.status==='current'||result.status==='error')toast(updateMessage());return;}
 if(!q||!r)return;
 if(action==='choose'&&!r.locked){r.draft.choice=el.dataset.value;delete feedback[q.id];persist();render();}
 if(action==='sort-add'&&!r.locked){r.draft.order||=[];if(!r.draft.order.includes(el.dataset.value))r.draft.order.push(el.dataset.value);delete feedback[q.id];persist();render();}
 if(action==='sort-undo'&&!r.locked){r.draft.order?.pop();delete feedback[q.id];persist();render();}
 if(action==='hint'&&!r.locked){r.help=1;r.everHelp=true;r.reviewSuccess=0;r.reviewMastered=false;persist();render();}
 if(action==='rule'){ruleOpen=!ruleOpen;if(ruleOpen&&!r.locked){r.help=1;r.everHelp=true;r.reviewSuccess=0;r.reviewMastered=false;persist();}render();}
 if(action==='reveal'&&!r.locked){r.help=2;r.everHelp=true;r.locked=true;r.lastOutcome='revealed';r.originalOutcome||='revealed';delete feedback[q.id];persist();render();}
 if(action==='skip'){r.skipped=true;persist();next();}
 if(action==='next')next();
 if(action==='scratch'){scratchOpen=!scratchOpen;render();if(scratchOpen)$('#scratch-canvas')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});}
 if(action==='scratch-undo'){r.strokes?.pop();persist();render();}
 if(action==='scratch-clear'&&confirm(t('scratchClear'))){r.strokes=[];persist();render();}
 if(action==='end'&&confirm(t('endConfirm'))){state.session.ended=true;persist();location.hash='summary';}
});
function setupCanvas(id){
 const canvas=$('#scratch-canvas');if(!canvas)return;
 const r=record(id);r.strokes||=[];let current=null;
 const ctx=canvas.getContext('2d');
 function resize(){const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
 function draw(){const rect=canvas.getBoundingClientRect();ctx.clearRect(0,0,rect.width,rect.height);ctx.lineWidth=2.3;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#164b7c';for(const stroke of r.strokes){if(!stroke.length)continue;ctx.beginPath();stroke.forEach((p,i)=>{const x=p[0]*rect.width,y=p[1]*rect.height;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});if(stroke.length===1)ctx.lineTo(stroke[0][0]*rect.width+.2,stroke[0][1]*rect.height+.2);ctx.stroke();}}
 const point=e=>{const b=canvas.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),Math.max(0,Math.min(1,(e.clientY-b.top)/b.height))];};
 canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture(e.pointerId);current=[point(e)];r.strokes.push(current);if(r.strokes.length>150)r.strokes.shift();draw();});
 canvas.addEventListener('pointermove',e=>{if(!current)return;for(const p of e.getCoalescedEvents?.()||[e]){if(current.length<1000)current.push(point(p));}draw();});
 const end=()=>{if(current){current=null;persist();}};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
 resize();
 if('ResizeObserver' in window){canvasObserver=new ResizeObserver(()=>resize());canvasObserver.observe(canvas);}
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;if(route()[0]==='install')render();});
window.addEventListener('appinstalled',()=>{installedNow=true;installPrompt=null;render();toast(t('installed'));});
let reloading=false;
if(!NATIVE&&'serviceWorker' in navigator&&location.protocol!=='file:'&&!window.VALE_STANDALONE){
 navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(reg=>{
  registration=reg;
  navigator.serviceWorker.ready.then(()=>{offlineReady=true;if(route()[0]==='install')render();});
  if(reg.waiting){waitingWorker=reg.waiting;paintUpdates();}
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){waitingWorker=reg.waiting;paintUpdates();}});});
 }).catch(()=>{});

}
window.addEventListener('hashchange',()=>{ruleOpen=false;scratchOpen=false;render();window.scrollTo(0,0);});
window.addEventListener('pagehide',()=>persist());
render();
window.ValeNative?.ready?.().catch(()=>{});
updater.inspect();
})();
