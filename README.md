## Tester

Minimalistic module for testing.

### Installation 

`npm install tester`  
or  
`yarn add Tester`

### Example of usage

```js
"use strict";

import Tester from "tester"; // if npm
// const Tester = require("tester") // if commonJS

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

### Links
- [API documentation](/documentation/API.md)
- [examples](/examples)

### License

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Support
- Bitcoin Cash: qq0j7w2nvjvtk6r5pxux8d3ekse6kqz44qxxr7ayw6
- Ethereum: 0x6987e6De173C0f055B7039B314f2cedbFDA33582
- Litecoin: ltc1qtc8mh6lhv038tsm9z5y9jfxdtk5rlr6ueuc78u
- Polkadot: 1RMn2ThRFfz2kdkR3eqoAmaQFHT9yQVHYrhPdcKVNpzz9bU
