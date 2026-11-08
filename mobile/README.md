# Vale Study — Android / iPad

Настоящие пакеты приложения на Capacitor: все страницы и упражнения включены в сборку. `server.url` не используется, браузер и загрузка сайта для занятий не требуются. Веб-интерфейс работает внутри системного WebView установленного приложения.

## Android

Установочный файл: https://github.com/troglobiont/vale-study/releases/latest/download/Vale-Study-Android.apk

Application ID: `io.github.troglobiont.valestudy`. Нативный установщик 0.7.1, versionCode 8. Интерфейс обновляется отдельно через встроенное обновление. Android 7.0+ с актуальным Android System WebView. Установка на конкретном Honor ещё требует проверки на устройстве.

APK выпускается с локальной закрытой подписью. Ключ не хранится в репозитории и не передаётся GitHub Actions. Workflow собирает неподписанный пакет, выравнивает его и выдаёт артефакт для локальной подписи. Подписанный APK проверяется `apksigner verify` и публикуется в GitHub Releases. Для следующей версии увеличивать versionCode и использовать тот же закрытый ключ. Устанавливать поверх прежней версии, не удаляя приложение.

## iPad / iPhone

Подготовлен Xcode-проект и проверка сборки без подписи. Неподписанный `.xcarchive` — не установщик. Ссылки на установленную iOS-версию пока нет.

Для обычной установки нужен Apple Developer и доставка через TestFlight/App Store. Без членства можно использовать Personal Team в Xcode с подключённым устройством, но профиль действует 7 дней. На рабочем Mac сейчас нет полного Xcode; его установка и вход в Apple Account пользователем — отдельные шаги. Не вводить пароль Apple или ключи в публичный репозиторий.

Документация Apple: https://developer.apple.com/help/account/basics/about-your-developer-account/
TestFlight: https://developer.apple.com/testflight/

## Сборка

Node 24, pnpm 11.25.0; для Android JDK21 и SDK36, для iOS Xcode26+.

```sh
cd mobile
pnpm install --frozen-lockfile
pnpm build
pnpm exec cap sync
pnpm test
# Android:
cd android
bash gradlew assembleRelease
# iOS: открыть mobile/ios/App/App.xcodeproj в Xcode
```

GitHub Actions `Native apps` проверяет Android Release и unsigned iOS archive. Для выпуска iOS требуется выбрать свою команду в Signing & Capabilities и подписать архив.

## Данные и функции

Учебный прогресс и аватарка хранятся локально; у приложения и сайта разные хранилища. Автоматического переноса нет. Экспорт JSON в установленном приложении открывает системное меню сохранения/отправки; фото исключено. Галерея выбирается системным выбором файла. Новых упражнений не добавлено. В приложении отключён service worker: интерфейс обновляется через CapacitorUpdater с проверкой SHA256. Аватарка → Данные и обновления → Обновить сейчас. Веб-версия обновляется через service worker по той же опубликованной ссылке.
