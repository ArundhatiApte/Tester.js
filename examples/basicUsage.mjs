"use strict";

import Tester from "./../src/Tester.js";
import ErrorWithSmallStack from "./../src/tests/ErrorWithSmallStack.js";

const FakeDataBase = class {
  async initializate(credsForConnectingToDBServer) {
    console.log("connection established");
  }
  
  async deleteAllEntries() {
    return console.log("all entries was deleted");
  }

  async findUserById() {
    throw new ErrorWithSmallStack("error #42");
  }

  async shutdown() {
    console.log("connection closed");
  }
};

const tester = new Tester("testing dataBase"),
      dataBase = new FakeDataBase();

tester.onBeforeAllTestsStarted.addListener(function initDataBase() {
  return dataBase.initializate({});
});

tester.setPrepareProcedure(dataBase.deleteAllEntries.bind(dataBase));

tester.addTest(function succesTest1() {});
tester.addTest(async function succesTest2() {});

tester.addTest(function failTest1() {
  return dataBase.findUserById(42);
});

tester.addTest(function failTest2() {
  throw new ErrorWithSmallStack("error from sync fn");
});

tester.onAllTestsEnded.addListener(dataBase.shutdown.bind(dataBase));

tester.run();
