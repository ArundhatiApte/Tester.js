"use strict";

const createFnToSetupLoggerOnEvent = function(nameOfEvent, nameOfMethodToLog) {
  return function(logger) {
    return setupListenerOnEvent.call(this, nameOfEvent, logger, nameOfMethodToLog);
  };
};

const setupListenerOnEvent = function(nameOfEvent, logger, nameOfMethodToLog) {
  const event = this[nameOfEvent],
        methodToLog = logger[nameOfMethodToLog],
        listener = methodToLog.bind(logger),
        isAsync = false;
  event.addListener(listener, false);
};

module.exports = createFnToSetupLoggerOnEvent;
