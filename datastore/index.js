const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const express = require('express');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  var id;

  counter.getNextUniqueId((err, uniqueId) => {
    if (err) {
      throw ('Could not get unique ID');
    } else {
      id = uniqueId;
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          throw ('error writing file to be created');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  var data;

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Cannot read the given directory');
    } else {
      data = _.map(files, (filename) => {
        return { 'id': filename.substring(0, 5), 'text': filename.substring(0, 5) };
      });
      callback(null, data);
    }
  });
};


exports.readOne = (id, callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Cannot read the given directory');
    } else {
      var result = files.indexOf(id + '.txt');
      if (result === -1) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        fs.readFile(path.join(exports.dataDir, files[result]), 'utf8', (err2, innerText) => {
          if (err2) {
            throw ('Cannot read file within given directory');
          } else {
            callback(null, {id: id, text: innerText});
          }
        });
      }
    }
  });
};


exports.update = (id, text, callback) => {

  exports.readOne(id, (err, object) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err2) => {
        if (err2) {
          throw ('error updating file to be created');
        }
        callback(null, () => console.log('File has been written!'));
      });
    }
  });
};

exports.delete = (id, callback) => {

  exports.readOne(id, (err, object) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(path.join(exports.dataDir, id + '.txt'), (err2) => {
        if (err2) {
          throw ('error deleting file');
        }
        callback(null, () => console.log('File has been deleted!'));
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// /datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
