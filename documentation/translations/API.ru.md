## Содержание

- [Класс Tester](#класс-tester)
    - new Tester(name[, options])
    - addTest(test[, options])
    - name
    - onAllTestsEnded
    - onBeforeAllTestsStarted
    - onTestEnded
    - run()
    - setPrepareProcedure(fn)
    - setTeardownProcedure(fn)
- [Класс Event](#класс-event)
    - addListener(listener[, isAsync])
- [Класс ReportAboutTest](#класс-reportabouttest)
    - getHasPrepare()
    - getHasTeardown()
    - getIsMainTestFailed()
    - getIsPrepareFailed()
    - getIsTeardownFailed()
    - isSucces()
- [Класс ReportAboutAllTests](#класс-reportaboutalltests)
- [Интерфейс Logging](#интерфейс-logging)
    - logFailedListenersOfAllTestsEndedEvent(tester, resultsOfListenersCalls)
    - logFailedListenersOfBeforeAllTestsStartedEvent(tester, resultsOfListenersCalls)
    - logFailedListenersOfTestEndedEvent(tester, resultsOfListenersCalls)
    - writeHeader(tester)
    - writeReportAboutAllTests(tester, report)
    - writeReportAboutTest(tester, report)
- [Класс ResultOfListenerCall](#класс-resultoflistenercall)

## Класс Tester

### new Tester(name[, options])

* `name <string>` имя тестера
* `options <Object>`, со свойствами:
    * `logger <Logging>`  
    объект, реализующий интерфейс Logging, позволяет заменить стандартный способ вывода сообщений

### addTest(test[, options])

  * `test <function>`
  * `options <Object>`, со свойствами:
      * `isParallel <bool>`  
        Показывает запускать ли этот тест без ожидания окончания предыдущих.
        По умолчанию тесты запускаются последовательно, друг за другом.
      * `name <string>` 
      Имя теста, по умолчанию используется имя функции test

Добавляет новый тест.

### name

* `<string>`

Имя тестера

### onAllTestsEnded `<Event>`
Событие генерируется после завершения всех тестов.  
Обработчик события: `function(tester, report)`, где  

* `tester <Tester>`
* `report <ReportAboutAllTests>`

### onBeforeAllTestsStarted `<Event>`

Событие генерируется перед запуском всех тестов.  
Обработчик события: `function(tester)`, где  

* `tester <Tester>`

### onTestEnded `<Event>`

Событие генерируется после завершения каждого теста.  
Обработчик события: `function(tester, report)`, где  

* `tester <Tester>`
* `report <ReportAboutTest>`

### run()

* Возвращает `<Promise<ReportAboutAllTests>>`

Запускает тесты.
Если один или более обработчиков события BeforeAllTestsStarted завершились ошибкой, запуск тестов будет отменен, метод run() вернет `<Promise>` с `null`.

### setPrepareProcedure(fn)

* `fn <function>`

Устанавливает функцию, которая будет вызываться перед каждым тестом.
Если вызов завершится ошибкой, вызов основного теста и завершительной операции будет отменен.

### setCleanProcedure(fn)

* `fn <function>`

Устанавливает функцию, которая будет вызываться после каждого теста.
Если тест завершиться ошибкой, вызов завершительной операции будет отменен.

## Класс Event

### addListener(listener)

* `listener <function>` обработчик события

Добавляет обработчик события.

## Класс ReportAboutTest

### getHasPrepare()

* Возвращает `<bool>`

Показывет, была ли подготовительная операция.

### getHasClean()

* Возвращает `<bool>`

Показывает, была ли заключительная операция.

### getIsMainTestFailed()

* Возвращает `<bool>`

Показывает, завершился ли ошибкой основной тест.

### getIsPrepareFailed()

* Возвращает `<bool>`

Показывает, завершилась ли ошибкой подготовительная операция.

### getIsCleanFailed()

* возвращает `<bool>`

Показывает, завершилась ли ошибкой заключительная операция.
      
### errorOfPrepare <Error|any>

Ошибка, которой завершилась подготовительная операция. Если функция завершилась успешно - `undefined `.

### errorOfMainTest <Error|any>

Ошибка, которой завершился основной тест. Если функция завершилась успешно - `undefined `.

### errorOfClean <Error|any>

Ошибка, которой завершилась заключительная операция. Если функция завершилась успешно - `undefined `.

### isSucces()

* Возвращает `<bool>`

Показывает, завершился ли тест успешно. Если была ошибка при выполнении подготовительной опреции, теста или заключительной
операции метод вернет `false`.

## Класс ReportAboutAllTests

### countOfFailedTests

* `<number>`

Число тестов, завершившихся ошибкой.

### countOfSuccesTests

* `<number>`

Число успешных тестов.

### reportsAboutFailedTests <ReportAboutTest[]>

Если один тест или более, завершился ошибкой, это значение будет содержать массив отчетов `<ReportAboutTest>`, тесты которых завершились ошибкой.
Если все тесты прошли успешно, свойство failed будет отсутствовать.

## Интерфейс Logging

### logFailedListenersOfAllTestsEndedEvent(tester, resultsOfListenersCalls)

* `tester <Tester>`
* `resultsOfListenersCalls <ResultOfListenerCall[]>`

Вызывается когда один или более обработчиков события AllTestsEnded завершились ошибкой.
Объекты класса Tester не перехватывают ошибки, которые могут возникнуть при вызове logFailedListenersOfOnAllTestsEndedEvent.
      
### logFailedListenersOfBeforeAllTestsStartedEvent(tester, resultsOfListenersCalls)

* `tester <Tester>`
* `resultsOfListenersCalls <ResultOfListenerCall[]>`

Вызывается когда один или более обработчиков события onBeforeAllTestsStarted завершились ошибкой.
Объекты класса Tester не перехватывают ошибки, которые могут возникнуть при вызове logFailedListenersOfOnBeforeAllTestsStartedEvent.
      
### logFailedListenersOfTestEndedEvent(tester, resultsOfListenersCalls)

* `tester <Tester>`
* `resultsOfListenersCalls <ResultOfListenerCall[]>`

Вызывается когда один или более обработчиков события OnTestEnded завершились ошибкой.
Объекты класса Tester не перехватывают ошибки, которые могут возникнуть при вызове logFailedListenersOfOnTestEndedEvent.
      
### writeHeader(tester)

* `tester <Tester>`

Вызывается перед запуском всех тестов.
      
### writeReportAboutAllTests(tester, report)

* `tester <Tester>`
* `report <ReportAboutAllTests>`

Вызывается после завершения всех тестов.
      
### writeReportAboutTest(tester, report)

* `tester <Tester>`
* `report <ReportAboutTest>`

Вызывается после завершения каждого теста.

## Класс ResultOfListenerCall

### listener <function>

Обработчик события, вызов которого завершился ошибкой.

### error <Error|any>

Значение выброшенное обработчиком.
