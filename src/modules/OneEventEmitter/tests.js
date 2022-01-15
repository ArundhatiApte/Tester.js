"use strict";

const expectEqual =  require("assert").equal,
      OneEventEmiter = require("./OneEventEmitter");

const createCreatorOfFns = (function() {
  let generatorOfNums = 0;
  const getNextNum = function(fn) {
    return generatorOfNums += 1;
  };

  const createFnWithNewId = function(createFn) {
    const fn = createFn();
    fn.id = getNextNum();
    return fn;
  };
  
  return function(createFn) {
    return createFnWithNewId.bind(null, createFn);
  };
})();
  

const test = async function() {
  const context = {some: 1},
        isAsync = true,
        emiter = new OneEventEmiter(context);   

  const createSuccesSyncFn = createCreatorOfFns(function() {
    return function() {};
  });
  
  const succesSyncFn = createSuccesSyncFn(),
        succesSyncFn2 = createSuccesSyncFn();
  
  const createSuccesAsyncFn = createCreatorOfFns(function() {
    return async function() {};
  });
  
  const succesAsyncFn = createSuccesAsyncFn(),
        succesAsyncFn2 = createSuccesAsyncFn();

  const createFailSyncFn = createCreatorOfFns(function() {
    return function failedSyncFn() {
      throw errorOfFailSyncFn;
    };
  });
  const errorOfFailSyncFn = new Error("fs");

  const failSyncFn = createFailSyncFn(),
        failSyncFn2 = createFailSyncFn();

  const createFailAsyncFn = createCreatorOfFns(function() {
    return async function failedAsyncFn() {
      throw errorOfFailAsyncFn;
    };
  });
  const errorOfFailAsyncFn= new Error("fa");
  
  const failAsyncFn = createFailAsyncFn(),
        failAsyncFn2 = createFailAsyncFn();

  emiter.addListener(succesSyncFn);
  emiter.addListener(succesSyncFn2, !isAsync);
  
  emiter.addListener(succesAsyncFn);
  emiter.addListener(succesAsyncFn2, isAsync);
  
  emiter.addListener(failSyncFn);
  emiter.addListener(failSyncFn2, !isAsync);

  emiter.addListener(failAsyncFn);
  emiter.addListener(failAsyncFn2, isAsync);
  
  const arg1 = 2, arg2 = 3,
        failed = await emiter._emitAndGetFailed(arg1, arg2);
  expectEqual(false, failed === null);

  const failedListeners = [
    [failSyncFn, errorOfFailSyncFn],
    [failSyncFn2, errorOfFailSyncFn],
    [failAsyncFn, errorOfFailAsyncFn],
    [failAsyncFn2, errorOfFailAsyncFn]
  ].map(function([fn, error]) {
    return new FailedListener(fn, error);
  });
  checkFailedListenersInReport(failedListeners, failed);
  
  console.log("ok");
};

const FailedListener = function(listener, error) {
  this.listener = listener;
  this.error = error;
};


const checkFailedListenersInReport = function(failedListeners, failedListenersFromReport) {
  let count = failedListeners.length;
  if (count !== failedListenersFromReport.length) {
    throw new Error("кол - во");
  }
  const compareEntriesByIdOfFns = function(entryA, entryB) {
    const idOfListenerA = entryA.listener.id,
          idOfListenerB = entryB.listener.id;
    return idOfListenerA - idOfListenerB;
  };
  
  const getSorted = function(entries) {
    const clonedEntries = entries.slice();
    clonedEntries.sort(compareEntriesByIdOfFns);
    return clonedEntries;
  };
  
  let aEntry, bEntry;
  const aEntries = getSorted(failedListeners),
        bEntries = getSorted(failedListenersFromReport);

  for (let count; count; ) {
    count -= 1;
    aEntry = aEntries[count];
    bEntry = bEntries[count];
    
    expectEqual(aEntry.listener, bEntry.listener);
    expectEqual(aEntry.error.message, bEntry.error.message);
  }
};

test();
