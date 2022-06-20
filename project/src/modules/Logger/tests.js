"use strict";

const ReportAboutTest = require("./../ReportAboutTest"),
      ErrorWithSmallStack = require("./../../tests/ErrorWithSmallStack"),
      Logger = require("./Logger");

const test = function() {
  const logger = new Logger(process.stdout);
  const tester = {name: "test something"};

  logger.writeHeader(tester);

  const reportAboutTest = new ReportAboutTest("test adding entries");
  reportAboutTest.setHasPrepare(true);
  reportAboutTest.setHasClean(true);
  reportAboutTest.setIsCleanFailed(true);
  reportAboutTest.errorOfClean = new ErrorWithSmallStack("error");
  
  logger.writeReportAboutTest(tester, reportAboutTest);
  
  logger.writeReportAboutAllTests(tester, {
    countOfSuccesTests: 4,
    countOfFailedTests: 1,
  });

  const entriesAboutFailedListeners = [
    function listener1() {}, function listener2() {}, function listener3() {}
  ].map(function(listener) {
    return {
      listener,
      isSucces: false,
      error: new ErrorWithSmallStack("error of " + listener.name)
    };
  });
  logger.logFailedListenersOfBeforeAllTestsStartedEvent(tester, entriesAboutFailedListeners);
  logger.logFailedListenersOfAllTestsEndedEvent(tester, entriesAboutFailedListeners);
  logger.logFailedListenersOfTestEndedEvent(tester, entriesAboutFailedListeners);
  
  console.log("\n\nok");
};

test();
