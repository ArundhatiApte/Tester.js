"use strict";

const createMethodToSetBitAt = function(indexOfBit) {
  return function(isOn) {
    return this[_bitMap].setBitAt(indexOfBit, isOn);
  };
};

const createMethodToGetBitAt = function(indexOfBit) {
  return function() {
    return this[_bitMap].getBitAt(indexOfBit);
  };
};

const _bitMap = "_f";

module.exports = {
  createMethodToSetBitAt,
  createMethodToGetBitAt,
  _bitMap
};
