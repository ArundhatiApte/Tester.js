## Tester

Минималистичный модуль для тестирования.

### Установка

`npm install github:ArundhatiApte/Tester-JS`  
или  
`yarn add github:ArundhatiApte/Tester-JS`

### Пример использования

```js
"use strict";

import Tester from "tester"; // если npm
// import Tester from "Tester"; // если yarn
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

### Поддержка

- Bitcoin Cash: qruf96kpx63dqz46flu453xxkpq5e7wlpgpl2zdnx8
- Ethereum: 0x8dF38FfBd066Ba49EE059cda8668330304CECD57
- Litecoin: ltc1quygsxll92wwn88hx2rper3p9eq0ez49qu4tj5w
- Polkadot: 14GqUGDwGzowm92n9xaiD5R2miPxrEdtXPxgkCtar2vw18yn
