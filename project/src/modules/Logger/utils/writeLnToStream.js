"use strict";

const writeLnToStream = function(stream, message) {
  stream.write(message);
  stream.write("\n");
};

module.exports = writeLnToStream;
