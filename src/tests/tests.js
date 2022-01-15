"use strict";

const expect = require("assert"),
      StacklessError = require("./ErrorWithSmallStack"),
      Tester = require("./../Tester");

const runTesterInTime = function(tester, tests, maxTimeMSToWait) {
  for (const test of tests) {
    tester.addTest(test);
  }
  
  return new Promise(function(resolve, reject) {
    const timeout = setTimeout(reject, maxTimeMSToWait);  
    tester.onAllTestsEnded.addListener(function(tester, results) {
      clearTimeout(timeout);
      resolve(results);
    });
    tester.run();
  });
};

const testTester = async function() {
  const tester = new Tester("test Tester");
  
  const idOfSuccesSyncTest = 1,
        idOfFailSyncTest = 2,
        idOfSuccesAsyncTest = 3,
        idOfFailAsyncTest = 4,
        idOfPrepare = 5,
        idOfClean = 6;
        
  const events = [];

  const succesSyncTest = function() {};
  const failSyncTest = function() {
    throw new StacklessError("oh");
  };
  
  const succesAsyncTest = async function() {};
  const failAsyncTest = async function() {
    throw new StacklessError("failAsyncTest");
  };

  const createLoggingEventListener = function(events, idOfEvent, nameOfEvent) {
    return logEvent.bind(null, events, idOfEvent, nameOfEvent);
  };
  const logEvent = function(events, idOfEvent, nameOfEvent) {
    events.push(idOfEvent);
    console.log(nameOfEvent);
  };
  
  tester.setPrepareProcedure(createLoggingEventListener(events, idOfPrepare, "prepare"));
  
  tester.onTestEnded.addListener(function logTestAsync(tester, report) {
    console.log("onTestEnded");
    let idOfEvent;
    if (report.isSucces()) {
      idOfEvent = report.name === "succesSyncTest" ?
        idOfSuccesSyncTest : idOfSuccesAsyncTest;
    } else {
      idOfEvent = report.name === "failSyncTest" ?
        idOfFailSyncTest : idOfFailAsyncTest;
    }
    return events.push(idOfEvent);
  });
  
  tester.setCleanProcedure(createLoggingEventListener(events, idOfClean, "tearDown"));
  
  const tests = [
    succesSyncTest, failSyncTest,
    succesAsyncTest, failAsyncTest
  ];
  
  try {
    const results = await runTesterInTime(tester, tests, 500);

    const expectedLog = [
      idOfPrepare, idOfClean, idOfSuccesSyncTest, //ok event onTestEnded fire after test run (run prepare, test, teadDown)
      idOfPrepare, idOfFailSyncTest,
      idOfPrepare, idOfClean, idOfSuccesAsyncTest,
      idOfPrepare, idOfFailAsyncTest
    ];
    expect.deepEqual(expectedLog, events);
    expect.equal(results.countOfSuccesTests, 2);
    expect.equal(results.countOfFailedTests, 2);
    console.log("===========OK===========");
  } catch(error) {
    console.warn("ошибка");
    console.warn(error);
  }
};

testTester();
