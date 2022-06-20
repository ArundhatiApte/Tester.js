"use strict";

let generatorOfNum = 0;

const createNameOfAnonumisTester = function() {
  return "Tester#" + (generatorOfNum += 1);
};

module.exports = createNameOfAnonumisTester;
