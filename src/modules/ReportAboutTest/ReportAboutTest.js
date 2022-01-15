"use strict";

const BitMap = require("./BitMap");

const {
  createMethodToSetBitAt,
  createMethodToGetBitAt,
  _bitMap
} = require("./creatingMethodsForBitMap.js");

const ReportAboutTest = class {
  constructor(name, test) {
    this.name = name;
    this.test = test;
    this.errorOfTest = this.errorOfPrepare = this.errorOfClean = null;
    this[_bitMap] = new BitMap();
  }
  
  isSucces() {
    if (this.getHasPrepare() && this.getIsPrepareFailed()) {
      return false;
    }
    if (this.getIsMainTestFailed()) {
      return false;
    }
    if (this.getHasClean() && this.getIsCleanFailed()) {
      return false;
    }
    return true;
  }
};

const Proto = ReportAboutTest.prototype;

const positionsOfFlags = Proto._positionsOfFlags = Object.freeze({
  hasPrepare: 0,
  isPrepareFailed: 1,
  isMainTestFailed: 2,
  hasClean: 3,
  isCleanFailed: 4
});

Proto.setHasPrepare = createMethodToSetBitAt(positionsOfFlags.hasPrepare);
Proto.getHasPrepare = createMethodToGetBitAt(positionsOfFlags.hasPrepare);

Proto.setIsPrepareFailed = createMethodToSetBitAt(positionsOfFlags.isPrepareFailed);
Proto.getIsPrepareFailed = createMethodToGetBitAt(positionsOfFlags.isPrepareFailed);

Proto.setIsMainTestFailed = createMethodToSetBitAt(positionsOfFlags.isMainTestFailed);
Proto.getIsMainTestFailed = createMethodToGetBitAt(positionsOfFlags.isMainTestFailed);

Proto.setHasClean = createMethodToSetBitAt(positionsOfFlags.hasClean);
Proto.getHasClean = createMethodToGetBitAt(positionsOfFlags.hasClean);

Proto.setIsCleanFailed = createMethodToSetBitAt(positionsOfFlags.isCleanFailed);
Proto.getIsCleanFailed = createMethodToGetBitAt(positionsOfFlags.isCleanFailed);

module.exports = ReportAboutTest;
