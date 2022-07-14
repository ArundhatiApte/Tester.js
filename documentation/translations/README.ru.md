## Tester

Минималистичный модуль для тестирования.

### Установка

Скачать репозиторий.
В папке project/buildingNpmPackage запустить скрипт createPackage.sh, после чего появится файл tester.package.tar.gz.
В каталоге вашего проекта установите модуль менеджером пакетов: `npm install path/to/tester.package.tar.gz`.

### Пример использования

```js
"use strict";

import Tester from "tester";
// const Tester = require(...) // если commonJS

const tester = new Tester("testing something");

tester.addTest(function succesSyncTest() {});

tester.addTest(function failingSyncTest() {
  throw new Error("error")
});

tester.addTest(async function succesAsyncTest() {});

tester.addTest(() => {}, {
  name: "succesSyncTest2"
});

tester.addTest(function failingAsyncTest() {
  return Promise.reject(new Error("trouble"));
});

tester.run();
```

### Ссылки

- [документация](/documentation/translations/API.ru.md)
- [примеры](/examples)

### Лицензия

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
