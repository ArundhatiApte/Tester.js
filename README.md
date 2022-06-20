## Tester

Minimalistic module for testing.

### Installation 

`npm install github:ArundhatiApte/Tester.js`  
or  
`yarn add github:ArundhatiApte/Tester.js`

### Example of usage

```js
"use strict";

import Tester from "tester";
// const Tester = require("tester");

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
