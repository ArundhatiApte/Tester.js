"use strict";

const expect = require("assert"),
      BitMap = require("./BitMap.js");
      
const test = function() {
  const indexToState = new Map([
    [0, true], [1, false],
    [2, false], [3, true],
    [4, false], [5, true],
    [6, true], [7, false]
  ]);
  const bitMap = new BitMap();
  
  (function fillBitMap(bitMap, indexToState) {
    for (const [index, isOn] of indexToState.entries()) {
      bitMap.setBitAt(index, isOn);
    }
  })(bitMap, indexToState);
  
  (function checkDataOfBitMap(bitMap, indexToState) {
    let isOnInBitMap;
    for (const [index, isOn] of indexToState.entries()) {
      isOnInBitMap = bitMap.getBitAt(index);
      expect.equal(isOnInBitMap, isOn);
    }
  })(bitMap, indexToState);
  
  console.log("ok");
};

test();
