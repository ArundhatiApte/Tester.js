"use strict";

const ErrorWithSmallStack = class extends Error {
  constructor(message) {
    super(message);
    this.stack = extractFisrtTwoLines(this.stack);
  }
};

const extractFisrtTwoLines = function(text) {
  return extractPartBeforeFisrtNCharsFromText(text, "\n", 1);
};

const extractPartBeforeFisrtNCharsFromText = function(text, char, countOfMatches) {
  const totalCountOfChars = text.length;
  let currentCountOfMatches = 0,
      currentChar;
  for (let i = 0; i < totalCountOfChars; i += 1) {
    currentChar = text[i];
    if (currentChar === char) {
      if (currentCountOfMatches === countOfMatches) {
        return text.slice(0, i);
      }
      currentCountOfMatches += 1;
      continue;
    }
  }
};

module.exports = ErrorWithSmallStack;
