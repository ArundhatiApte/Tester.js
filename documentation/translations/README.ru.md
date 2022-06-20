## Tester

Минималистичный модуль для тестирования.

### Установка

`npm install github:ArundhatiApte/Tester.js`  
или  
`yarn add github:ArundhatiApte/Tester.js`

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

- [документация](/documentation/API.ru.md)
- [примеры](/examples)

### Лицензия

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
