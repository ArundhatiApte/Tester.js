"use strict";

const expectEqual = require("assert").equal;
const {
  invokeSync,
  invokeAsync,
  invokeSyncOrAsync,
  statusOfCall
} = require("./launcherOfMethods");

const test = async function() {
  
  const succesSyncFn = function() {};
  const succesAsyncFn = async function() {};
  
  const errorOfFailSyncFn = new Error("st");
  const failSyncFn = function() {
    throw errorOfFailSyncFn;
  };
  const errorOfFailAsyncFn = new Error("fa");
  const failAsyncFn = async function() {
    throw errorOfFailAsyncFn;
  };
  
  expectEqual(
    invokeSync(null, succesSyncFn).status,
    statusOfCall.succes
  );
  
  let r = invokeSync(null, failSyncFn);
  expectEqual(r.status, statusOfCall.error);

  r = invokeSync(null, succesSyncFn);
  expectEqual(r.status, statusOfCall.succes);
  
  // async

  r = await invokeAsync(null, succesAsyncFn);
  expectEqual(r.status, statusOfCall.succes);

  r = await invokeAsync(null, failAsyncFn);
  expectEqual(r.status, statusOfCall.error);

  // syncOrAsync
  const checkCallingSyncOrAsyncFn = async function(fn, expectedStatus) {
    const resultOfCall = await invokeSyncOrAsync(null, fn);
    expectEqual(expectedStatus, resultOfCall.status);
  };
  
  const fnToStatus = [
    [succesSyncFn, statusOfCall.succes],
    [succesAsyncFn, statusOfCall.succes],
    [failSyncFn, statusOfCall.error],
    [failAsyncFn, statusOfCall.error]
  ];

  await Promise.all(fnToStatus.map(function([fn, expectedStatusOfCall]) {
    return checkCallingSyncOrAsyncFn(fn, expectedStatusOfCall);
  }));
};

(async function runTests() {
  await test();
  console.log("OK");
})();
