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
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  // files: ['filename', 'filename', 'filename']
  // fs.readFile(path, callback(err, data) data is the contents of the file)

  // const expectedTodoList = [{ id: '00001', text: '00001' }, { id: '00002', text: '00002' }];

  var data;

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Cannot read the given directory');
    } else {
      data = _.map(files, (filename) => {
        fs.readFile(path.join(exports.dataDir, filename), (err2, text) => {
          if (err2) {
            throw ('Cannot read file within given directory');
          } else {
            // let id = filename.substring(0, 5);
            return { 'id': filename.substring(0, 5), 'text': filename.substring(0, 5) };
          }
        });
      });
      callback(null, data);
    }
  });

  // fs.readdir(path[,options], callback); return an array of all file names
  // exports.dataDir
  //callback(err, files [names of files in directory minus '.' and '..' in file name])

  // return an array of todos, example: [{id: #, text: #}, {id: #2, text: #2}]
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// /datastore/data

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
