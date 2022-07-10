"use strict";

const writeLnToStream = require("./utils/writeLnToStream"),
      labels = require("./utils/labels");

const {
  symbolOfSucces, symbolOfFail
} = labels;

const newLine = "\n";

const Logger = class {
  constructor(streamForLog) {
    this[_stream] = streamForLog;
  }

  writeHeader(tester) {
    return writeLnToStream(this[_stream], tester.name);
  }

  writeReportAboutAllTests(tester, reportAboutAllTests) {
    const streamForLog = this[_stream];
    streamForLog.write(tester.name);
    streamForLog.write(" (V: ");

    let count = reportAboutAllTests.countOfSuccesTests;
    if (count !== undefined) {
      streamForLog.write(count.toString());
    } else {
      streamForLog.write("0");
    }

    count = reportAboutAllTests.countOfFailedTests;
    if (count) {
      streamForLog.write(" , X:");
      streamForLog.write(count.toString());
    }
    streamForLog.write(")\n");
  }

  writeReportAboutTest(tester, reportAboutTest) {
    const streamForLog = this[_stream];
    const isSucces = reportAboutTest.isSucces();

    if (isSucces) {
      streamForLog.write(symbolOfSucces);
      streamForLog.write(" : ");
      writeLnToStream(streamForLog, reportAboutTest.name);
      return;
    }
    streamForLog.write(newLine);
    streamForLog.write(symbolOfFail);
    streamForLog.write(" : ");
    writeLnToStream(streamForLog, reportAboutTest.name);

    if (isSucces) {
      return;
    }

    if (reportAboutTest.getHasPrepare() && reportAboutTest.getIsPrepareFailed()) {
      _writeSubErrorOfTest(streamForLog, labels.prepare, reportAboutTest.errorOfPrepare);
    }
    if (reportAboutTest.getIsMainTestFailed()) {
      _writeSubErrorOfTest(streamForLog, labels.mainTest, reportAboutTest.errorOfTest);
    }
    if (reportAboutTest.getHasClean() && reportAboutTest.getIsCleanFailed()) {
      _writeSubErrorOfTest(streamForLog, labels.clean, reportAboutTest.errorOfClean);
    }
  }
};

const _writeSubErrorOfTest = function(streamForLog, nameOfOperation, error) {
  streamForLog.write("  X: ");
  streamForLog.write(nameOfOperation);
  streamForLog.write(" - ");
  if (error) {
   _writeErrorToStream(streamForLog, error);
  }
  streamForLog.write(newLine);
};

const _writeErrorToStream = function(stream, error) {
  if (error instanceof Error) {
    stream.write(error.stack);
  } else {
    stream.write(new String(error).toString());
  }
};

const _stream = "_";

const Proto = Logger.prototype;

const createFnToLogFailedListenersOfEvent = function(nameOfEvent) {
  return function(tester, failedListeners) {
    return _logFailedListenersOfEvent.call(this, nameOfEvent, failedListeners);
  };
};

Proto.logFailedListenersOfBeforeAllTestsStartedEvent = createFnToLogFailedListenersOfEvent(
  "onBeforeAllTestsStarted"
);
Proto.logFailedListenersOfAllTestsEndedEvent = createFnToLogFailedListenersOfEvent(
  "onAllTestsEnded"
);
Proto.logFailedListenersOfTestEndedEvent = createFnToLogFailedListenersOfEvent(
  "onTestEnded"
);

const _logFailedListenersOfEvent = function(nameOfEvent, failedListeners) {
  const stream = this[_stream];
  stream.write("Errors of ");
  stream.write(nameOfEvent);
  stream.write(" event:\n  ");

  for (const failedListener of failedListeners) {
    _writeFailedListenerToStream(stream, failedListener);
    stream.write("\n  ");
  }
  stream.write(newLine);
};

const _writeFailedListenerToStream = function(stream, errorAndFn) {
  stream.write("•)");

  const nameOfFunction = errorAndFn.listener.name;
  if (nameOfFunction) {
    stream.write(nameOfFunction);
    stream.write(" ");
  } else {
    stream.write("anonimus ");
  }

  _writeErrorToStream(stream, errorAndFn.error);
};

module.exports = Logger;
