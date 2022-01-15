"use strict";

import Tester from "./../src/Tester.js";
import ErrorWithSmallStack from "./../src/tests/ErrorWithSmallStack.js";

const Logger = class {
  writeHeader(tester) {
    console.log(tester.name, " ...");
  }

  writeReportAboutTest(tester, report) {
    const isSucces = report.isSucces();
    if (isSucces) {
      console.log("Ok: ", report.name);
      return;
    }
    console.log("\nFail: ", report.name);
    
    if (report.getHasPrepare() && report.getIsPrepareFailed()) {
      console.log("  at prepare: ", report.errorOfPrepare.stack, "\n");
      return;
    }
    if (report.getIsMainTestFailed()) {
      console.log("  at test: ", report.errorOfTest.stack, "\n");
      return;
    }
    if (report.getHasClean() && report.getIsCleanFailed()) {
      console.log("  at clean: ", report.errorOfClean.stack, "\n");
    }
  }

  writeReportAboutAllTests(tester, reportAboutAllTests) {
    console.log(
      tester.name, " (Ok: ",
      reportAboutAllTests.countOfSuccesTests, ", Fail: ",
      reportAboutAllTests.countOfFailedTests, ")");
  }

  /*
   * logFailedListenersOfBeforeAllTestsStartedEvent(tester, failedListenersAndThemErrors)
   * logFailedListenersOfTestEndedEvent(tester, failedListenersAndThemErrors)
   * logFailedListenersOfAllTestsEndedEvent(tester, failedListenersAndThemErrors)
  */
};

const tester = new Tester("testing something", {
  logger: new Logger()
});

tester.addTest(function succesTyncTest() {});

tester.addTest(function failSyncTest() {
  throw new ErrorWithSmallStack("error #42");
});

tester.addTest(async function /*anonimus*/() {}, {
  name: "succesAsyncTest"
});

tester.addTest(function failAsyncTest() {
  return Promise.reject(new ErrorWithSmallStack("index out of range"));
});

const createFnThatThrowsAfterCountOfCalls = function(countOfCallsToError) {
  return function() {
    countOfCallsToError -= 1;
    if (countOfCallsToError < 0) {
      throw new Error("error");
    }
  };
};

tester.setCleanProcedure(createFnThatThrowsAfterCountOfCalls(2));

tester.addTest(function succesSyncTest2() {});

tester.run();
