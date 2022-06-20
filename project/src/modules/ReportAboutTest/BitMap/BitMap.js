"use strict";

const BitMap = class {
  constructor() {
    this[_number] = 0;
  }
  
  onBitAt(index) {
    _checkIndex(index);
    const mask = 1 << index;
    this[_number] |= mask;
  }
  
  offBitAt(index) {
    if (this.getBitAt(index)){
      const mask = 1 << index;
      this[_number] ^= mask;
    }
  }
  
  setBitAt(index, isOn) {
    isOn ? this.onBitAt(index) : this.offBitAt(index);
  }
  
  getBitAt(index) {
    _checkIndex(index);
    const mask = 1 << index,
          result = (this[_number] & mask);
    return !!result;
  }
}; 

const _number = "_",
      maxIndex = BitMap.maxIndex = 31;

const _checkIndex = function(indexOfBit) {
  const isInRange = (0 <= indexOfBit && indexOfBit <= maxIndex);
  if (isInRange) {
    return;
  } else {
    throw new Error("BitMap:: index out of range.");
  }
};

module.exports = BitMap;
