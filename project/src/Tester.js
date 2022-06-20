"use strict";

const OneEventEmiter = require("./modules/OneEventEmitter"),
      DefaultLogger = require("./modules/Logger"),
      createFnToSetupLoggerOnEvent = require("./utils/createFnToSetupLoggerOnEvent"),
      createNameOfAnonumisTester = require("./utils/createNameOfAnonumisTester"),
      createNameOfAnonimusTest = require("./utils/createNameOfAnonimusTest"),
      runDescriptorOfTestToGetReport = require("./utils/runDescriptorOfTestToGetReport");

const _descriptorsAboutTests = "_",
      _logger = "_l",
      _prepareProcedure = "_p",
      _cleanProcedure = "_t";

const defaultStreamForLog = process.stdout;

const LoggingTester = class {
  constructor(name, options) {
    this.onBeforeAllTestsStarted = new OneEventEmiter();
    this.onTestEnded = new OneEventEmiter();
    this.onAllTestsEnded = new OneEventEmiter();

    this[_descriptorsAboutTests] = [];
    this.name = name || createNameOfAnonumisTester();
    
    if (options) {
      this._setupWithConfig(options);
    } else {
      this._setupDefaults();
    }
  }
  
  _setupWithConfig(config) {
    this[_logger] = config.logger || new DefaultLogger(defaultStreamForLog);
    this._setupLoggingListeners();
  }
  
  _setupDefaults() {
    this[_logger] = new DefaultLogger(defaultStreamForLog);
    this._setupLoggingListeners();
  }
  
  _setupLoggingListeners() {
    const logger = this[_logger];
    this._setupOnBeforeTestsStartedListener(logger);
    this._setupOnTestEndedListener(logger);
    this._setupOnAllTestsEndedListener(logger);
  }

  addTest(fn, options) {
    if (!fn) {
      throw new Error("Tester: missed test.");
    }
    if (!options) {
      this[_descriptorsAboutTests].push({
        test: fn,
        name: fn.name || createNameOfAnonimusTest()
      });
      return;
    }
    const descriptorOfTest = {
      test: fn,
      name: options.name || fn.name || createNameOfAnonimusTest()
    };
    
    let flag = options.isParallel;
    if (flag) {
      descriptorOfTest.isParallel = true;
    }
    flag = options.isAsync;
    if (flag) {
      descriptorOfTest.isAsync = true;
    }
    this[_descriptorsAboutTests].push(descriptorOfTest);
  }

  setPrepareProcedure(fn) {
    this[_prepareProcedure] = fn;
  }

  setCleanProcedure(fn) {
    this[_cleanProcedure] = fn;
  }

  async run() {
    let event = this.onBeforeAllTestsStarted,
        failedListeners;
        
    if (event.hasListeners()) {
      failedListeners = await event._emitAndGetFailed(this);
      if (failedListeners) {
        this[_logger].logFailedListenersOfBeforeAllTestsStartedEvent(this, failedListeners);
        return null;
      }
    }

    const onOneTestEnded = this._createOnOneTestEnded(),
          reports = await this._runDescriptorsOfTests(onOneTestEnded);

    event = this.onAllTestsEnded;
    if (event.hasListeners()) {
      failedListeners = await event._emitAndGetFailed(this, reports);
      if (failedListeners) {
        this[_logger].logFailedListenersOfAllTestsEndedEvent(this, failedListeners);
        return reports;
      }
    }
    return reports;
  }
  
  async _runDescriptorsOfTests(onOneTestEnded) {
    const prepare = this[_prepareProcedure],
          clean = this[_cleanProcedure],
          executingAll = [],
          descOfTests = this[_descriptorsAboutTests];
    let chainOfSeqelueceTestPromises = Promise.resolve(),
        promise;

    const createNextPromiseInChain = function(prepare, descriptorOfTest, clean) {
      const runNextTest = runDescriptorOfTestToGetReport.bind(null, prepare, descriptorOfTest, clean),
            out = chainOfSeqelueceTestPromises.then(runNextTest).then(onOneTestEnded);
      chainOfSeqelueceTestPromises = out;
      return out;
    };
    
    for (const descriptorOfTest of descOfTests) {
      if (descriptorOfTest.isParallel) {
        promise = runDescriptorOfTestToGetReport(prepare, descriptorOfTest, clean).then(onOneTestEnded);
      } else {
        promise = createNextPromiseInChain(prepare, descriptorOfTest, clean);
      }
      executingAll.push(promise);
    }
    
    const reports = await Promise.all(executingAll);
    return this._createOnAllTestsEndedReport(reports);
  }

  _createOnOneTestEnded() {
    const event = this.onTestEnded,
          logger = this[_logger],
          self = this;
          
    if (event.hasListeners()) {
      return async function writeErrorIfHas(reportAboutTest) {
        if (!event.hasListeners()) {
          return reportAboutTest;
        }
        const failedListeners = await event._emitAndGetFailed(this, reportAboutTest);
        if (failedListeners) {
          logger.logFailedListenersOfTestEndedEvent(failedListeners);
        }
        return reportAboutTest;
      };
    } else {
      return noOperation;
    }
  }

  _createOnAllTestsEndedReport(reportsAboutTests) {
    const out = Object.create(null),
          failed = [];
    let countOfSuccesTests = 0,
        countOfFailedTests = 0;
        
    for (const report of reportsAboutTests) {
      if (report.isSucces()) {
        countOfSuccesTests += 1;
      } else {
        countOfFailedTests += 1;
        failed.push(report);
      }
    }

    out.countOfSuccesTests = countOfSuccesTests;
    out.countOfFailedTests = countOfFailedTests;
    
    if (countOfFailedTests) {
      out.reportsAboutFailedTests = failed;
    }
    return out;
  }
};

const noOperation = function() {},
      nameOfAnonimusFunction = "anonimus";

const Proto = LoggingTester.prototype;

Proto._setupOnBeforeTestsStartedListener = createFnToSetupLoggerOnEvent(
  "onBeforeAllTestsStarted",  "writeHeader"
);
Proto._setupOnTestEndedListener = createFnToSetupLoggerOnEvent(
  "onTestEnded", "writeReportAboutTest"
);
Proto._setupOnAllTestsEndedListener = createFnToSetupLoggerOnEvent(
  "onAllTestsEnded", "writeReportAboutAllTests"
);

module.exports = LoggingTester;
