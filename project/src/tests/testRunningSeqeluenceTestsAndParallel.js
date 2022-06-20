"use strict";

const expect = require("assert"),
      Tester = require("./../Tester");

const checkRunningTesterWithAsyncTestsInTime = (function() {

  const checkRunningTesterWithAsyncTestsInTime = async function(
    timeMSForOneTest, countOfTests, isAllTestsParallel,
    minTimeMSForAllTests, maxTimeMSForAllTests
  ) {
    const tester = createTesterWithAsyncTests(
      timeMSForOneTest, countOfTests, isAllTestsParallel);
    const timeMSAtStart = Date.now();
    await tester.run();
    const timeMSAtFinish = Date.now(),
          elapsedTimeMS = timeMSAtFinish - timeMSAtStart;
    const isInRange = isNumInRange(
      elapsedTimeMS, minTimeMSForAllTests, maxTimeMSForAllTests);
    expect.ok(isInRange);
  };

  const createTesterWithAsyncTests = function(timeMSForOneTest, countOfTests, isAllTestsParallel) {
    const name = createNameOfTester(isAllTestsParallel),
          tester = new Tester(name);

    addAsyncTestsToTester(tester, timeMSForOneTest, countOfTests, isAllTestsParallel);
    return tester;
  };

  const createNameOfTester = function(isAllTestsParallel) {
    return isAllTestsParallel ? "test parallel" : "test seqeluency"
  };

  const addAsyncTestsToTester = function(tester, timeMSForOneTest, countOfTests, isAllTestsParallel) {
    const prefixOfTestName = isAllTestsParallel ? "parallel" : "seqeluence";
    let test;
    for (let i = 0; i < countOfTests; i += 1) {
      test = createAwaitingTest(timeMSForOneTest);
      tester.addTest(test, {
        name: prefixOfTestName + " test #" + i,
        isAsync: true,
        isParallel: isAllTestsParallel
      });
    }
  };

  const createAwaitingTest = function(timeMSForTest) {
    return wait.bind(null, timeMSForTest);
  };

  const wait = function(ms) {
    return new Promise(function(resolve) {
      return setTimeout(resolve, ms);
    });
  };

  const isNumInRange = function(number, min, max) {
    return min <= number && number <= max;
  };
  
  return checkRunningTesterWithAsyncTestsInTime;
})();

(async function() {
  const timeMSForOneTest = 400,
        countOfTests = 6;
  const isParallelToMinTimeAndMaxTimeOfTests = [
    [true, [timeMSForOneTest, timeMSForOneTest * 2]],
    [false, [timeMSForOneTest * countOfTests, timeMSForOneTest * (countOfTests + 1)]]
  ];

  for (const [isAllTestsParallel, [minTimeMSForAllTests, maxTimeMSForAllTests]] of isParallelToMinTimeAndMaxTimeOfTests) {
    await checkRunningTesterWithAsyncTestsInTime(
      timeMSForOneTest, countOfTests, isAllTestsParallel,
      minTimeMSForAllTests, maxTimeMSForAllTests
    );
    console.log("\n");
  }

  console.log("===========OK===========");
})();
