"use strict";

const ReportAboutTest = require("./../../modules/ReportAboutTest");

const {
  statusOfCall,
  invokeSyncOrAsync
} = require("./../../modules/launcherOfMethods");

const statusOfCall_succes = statusOfCall.succes;

const runDescriptorOfTestToGetReport = async function(prepare, descriptorOfTest, clean) {
  const mainTest = descriptorOfTest.test,
        report = new ReportAboutTest(descriptorOfTest.name, mainTest),
        contextOfCall = null;
  let resultOfCall;
  
  if (prepare) {
    report.setHasPrepare(true);
    resultOfCall = await invokeSyncOrAsync(contextOfCall, prepare);

    if (resultOfCall.status !== statusOfCall_succes) {
      report.setIsPrepareFailed(true);
      report.errorOfPrepare = resultOfCall.error;
      return report;
    }
  }

  resultOfCall = await invokeSyncOrAsync(contextOfCall, mainTest);
  if (resultOfCall.status !== statusOfCall_succes) {
    report.setIsMainTestFailed(true);
    report.errorOfTest = resultOfCall.error;
    return report;
  }

  if (clean) {
    report.setHasClean(true);
    resultOfCall = await invokeSyncOrAsync(contextOfCall, clean);
    
    if (resultOfCall.status !== statusOfCall_succes) {
      report.setIsCleanFailed(true);
      report.errorOfClean = resultOfCall.error;
    }
  }
  return report;
};

module.exports = runDescriptorOfTestToGetReport;
