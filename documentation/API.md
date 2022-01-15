## Table of contents

- [class Tester](#class-tester)
    - new Tester(name[, options])
    - addTest(test[, options])
    - name
    - onAllTestsEnded
    - onBeforeAllTestsStarted
    - onTestEnded
    - run()
    - setPrepareProcedure(fn)
    - setTeardownProcedure(fn)
- [class Event](#class-event)
    - addListener(listener[, isAsync])
- [class ReportAboutTest](#class-reportabouttest)
    - getHasPrepare()
    - getHasTeardown()
    - getIsMainTestFailed()
    - getIsPrepareFailed()
    - getIsTeardownFailed()
    - isSucces()
- [class ReportAboutAllTests](#class-reportaboutalltests)
- [interface Logging](#interface-logging)
    - logFailedListenersOfAllTestsEndedEvent(tester, resultsOfListenersCalls)
    - logFailedListenersOfBeforeAllTestsStartedEvent(tester, resultsOfListenersCalls)
    - logFailedListenersOfTestEndedEvent(tester, resultsOfListenersCalls)
    - writeHeader(tester)
    - writeReportAboutAllTests(tester, report)
    - writeReportAboutTest(tester, report)
- [class ResultOfListenerCall](#class-resultoflistenercall)

## class Tester

### new Tester(name[, options])

* `name <string>` name of tester
* `options <Object>`:
    * `logger <Logging>`  
implementing Logging interface object, allow change way of printing messages

### addTest(test[, options])

  * `test <function>`
  * `options <Object>`
      * `isParallel <bool>`  
Indicates whether to run this test without waiting for the end of the previous ones.
By default, the tests are run sequentially, one after the other.
      * `name <string>` 
      Name of the test. By default, the name of the test function is used.

Adds new test.

### name

* `<string>`

Name of the tester.

### onAllTestsEnded `<Event>`

The event is generated after all tests are completed.  
Event handler: `function(tester, report)`

* `tester <Tester>`
* `report <ReportAboutAllTests>`

### onBeforeAllTestsStarted `<Event>`

The event is generated before running all tests.  
Event handler: `function(tester)`, где  

* `tester <Tester>`

### onTestEnded `<Event>`

The event is generated after end of each test.
Event handler: `function(tester, report)` 

* `tester <Tester>`
* `report <ReportAboutTest>`

### run()

* Returns `<Promise<ReportAboutAllTests>>`

Runs all tests.
If one ore more handlers of BeforeAllTestsStarted event was failed, the run of all tests will be canceled, method `run()`
will return `<Promise>` with null.

### setPrepareProcedure(fn)

* `fn <function>`

Sets the preparing function, that will be called before every test.
If function will fail, call of test and clean function will be canceled.

### setCleanProcedure(fn)

* `fn <function>`

Sets the cleaning function, that will be called after every test.
If test will fail, call of clean function will be canceled.

## class Event

### addListener(listener)
* `listener <function>` event handler

Adds event handler.

## class ReportAboutTest

### getHasPrepare()

* Returns `<bool>`

Indicates whether there was a preparing operation.

### getHasClean()

* Returns `<bool>`

Indicates whether there was a cleaning operation.

### getIsMainTestFailed()

* Returns `<bool>`

Indicates whether the main test function was failed.

### getIsPrepareFailed()

* Returns `<bool>`

Indicates whether the preparing procedure was failed.

### getIsCleanFailed()

* Returns `<bool>`

Indicates whether the cleaning procedure was failed.
      
### errorOfPrepare <Error|any>

Error at preparing procedure. If the function has completed successfully - `undefined`.

### errorOfMainTest <Error|any>

Error at main test function. If the function has completed successfully - `undefined`.

### errorOfClean <Error|any>

Error at cleaning procedure. If the function has completed successfully - `undefined`.

### isSucces()

* Returns `<bool>`

Indicates whether the test was completed successfully. If there was an error when performing a preparing operation, test, or a closing
operation, the method returns `false`.

## class ReportAboutAllTests

### countOfFailedTests

* `<number>`

### countOfSuccesTests

* `<number>`

### reportsAboutFailedTests <ReportAboutTest[]>

If one or more tests failed, this value will contain an array of reports `<ReportAboutTest>` whose tests failed.
If all tests were successful, the value of property will be `undefined`.

## Interface Logging

### logFailedListenersOfAllTestsEndedEvent(tester, resultsOfListenersCalls)

* `tester <Tester>`
* `resultsOfListenersCalls <ResultOfListenerCall[]>`

Called when one ore more listeners of AllTestsEnded event failed.
Objects of class `Tester` dont```t cath errors, throwed by logFailedListenersOfAllTestsEndedEvent.

### logFailedListenersOfBeforeAllTestsStartedEvent(tester, resultsOfListenersCalls)

* `tester <Tester>`
* `resultsOfListenersCalls <ResultOfListenerCall[]>`

Called when one ore more listeners of onBeforeAllTestsStarted event failed.
Objects of class `Tester` dont```t cath errors, throwed by logFailedListenersOfBeforeAllTestsStartedEvent.
      
### logFailedListenersOfTestEndedEvent(tester, resultsOfListenersCalls)

* `tester <Tester>`
* `resultsOfListenersCalls <ResultOfListenerCall[]>`

Called when one ore more listeners of OnTestEnded event failed.
Objects of class `Tester` dont```t cath errors, throwed by logFailedListenersOfOnTestEndedEvent.
      
### writeHeader(tester)

* `tester <Tester>`

Called before running all tests.
      
### writeReportAboutAllTests(tester, report)

* `tester <Tester>`
* `report <ReportAboutAllTests>`

Called after all tests are completed.
      
### writeReportAboutTest(tester, report)

* `tester <Tester>`
* `report <ReportAboutTest>`

Called after each test is completed.

## class ResultOfListenerCall

### listener <function>

Listener that throwed error.

### error <Error|any>

Throwed value by listener.
