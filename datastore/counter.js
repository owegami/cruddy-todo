const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const express = require('express');

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

// I: num
// O: num with 5 zeroes in front of it
// Why do we want this? Standardizes the length of the given num
const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// I: callback
// O: callback with a number (or error); number is counter
const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

// I: count, and callback
// O: no return, callback if counterStringexists
const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

// I: none
exports.getNextUniqueId = (callback) => {

  readCounter((err, count) => {
    if (err) {
      throw ('error reading count');
    } else {
      // counter becomes a number
      // increment counter
      count += 1;
      // now write that counter to txt file
      writeCounter(count, (err, count) => {
        // now read the counter again
        readCounter((err, count) => {
          if (err) {
            throw ('error reading updated count');
          } else {
            // do we need to return here?
            return zeroPaddedNumber(count);
          }
        });
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
// ./datastore/counter.txt
