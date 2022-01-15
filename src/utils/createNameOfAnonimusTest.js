"use strict";

const createNameOfAnonimusTest = function() {
  return "anonimus test#" + (numberOfAnonimusTest += 1);
};

let numberOfAnonimusTest = 0;

module.exports = createNameOfAnonimusTest;
