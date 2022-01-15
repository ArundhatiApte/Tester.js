"use strict";

const expect = require("assert"),
      runDescriptorOfTestToGetReport = require("./runDescriptorOfTestToGetReport");
      
const testCombinations = async function() {
  const isAsync = true;
  
  const succesSyncFn = function() {
    return Math.random() * 1000;
  };
  const failSyncFn = function() {
    throw new Error("failSyncFn");
  };
  
  const succesAsyncFn = async function() {
    return succesSyncFn();
  };
  const failAsyncFn = async function() {
    throw new Error("failAsyncFn");
  };
  
  const _getIsFnSucces = function(fn) {
    return fn === succesSyncFn || fn === succesAsyncFn;
  };
  
  const combinations = [
    [succesSyncFn, succesSyncFn, !isAsync, succesSyncFn],
    [failSyncFn, succesSyncFn, !isAsync, succesSyncFn],
    [succesSyncFn, failSyncFn, !isAsync, succesSyncFn],
    [succesSyncFn, succesSyncFn, !isAsync, failSyncFn],
    
    [succesAsyncFn, succesAsyncFn, isAsync, succesAsyncFn],
    [failAsyncFn, succesAsyncFn, isAsync, succesAsyncFn],
    [succesAsyncFn, failAsyncFn, isAsync, succesAsyncFn],
    [succesAsyncFn, succesAsyncFn, isAsync, failAsyncFn]
  ].map(function([
    prepare,
    mainTest, isMainTestAsync,
    clean
  ]) {
    return {
      prepare, 
      isPrepareSucces: _getIsFnSucces(prepare),
      
      mainTest, 
      isMainTestAsync, 
      isMainTestSucces: _getIsFnSucces(mainTest),
      
      clean, 
      isCleanSucces: _getIsFnSucces(clean)
    }
  });
  
  const checkDescriptorByCombination = async function(combination) {
    const {
      prepare, isPrepareSucces,
      mainTest, isMainTestAsync, isMainTestSucces,
      clean, isCleanSucces
    } = combination;
    
    const report = await runDescriptorOfTestToGetReport(prepare, {
      name: mainTest.name,
      test: mainTest
    }, clean);

    expect.equal(report.test, mainTest);
    expect.equal(report.getIsPrepareFailed(), !isPrepareSucces);
    if (!isPrepareSucces) {
      expect.ok(!!report.errorOfPrepare);
      return;
    }
    expect.equal(report.getIsMainTestFailed(), !isMainTestSucces);
    if (!isMainTestSucces) {
      expect.ok(!!report.errorOfTest);
    }
    expect.equal(report.getIsCleanFailed(), !isCleanSucces);
    if (!isCleanSucces) {
      expect.ok(!!report.errorOfClean);
    }
  };
  
  await Promise.all(combinations.map(checkDescriptorByCombination));
};

(async function runTests() {
  await testCombinations();
  console.log("=======================  OK =========================");
})();
