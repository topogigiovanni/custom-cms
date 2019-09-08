const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

let glob = global;

const schemaHelperConstructor = function (mgSchema) {
  if (!mgSchema) {
    mgSchema = {
      Types: {
        Mixed: 'Mixed',
        ObjectId: 'ObjectId'
      }
    }
  }
  function stringify (schema) {
    return JSON.stringify(schema, function (key, value) {
      if (value instanceof RegExp) {
        return ('__REGEXP ' + value.toString())
      } else if (typeof value === 'function') {
        if (key === 'validator') {
          return value.toString()
        }
        return value.name
      }
      return value
    })
  }

  function normalizeObj(obj) {
    if(!obj) {
      return;
    }

    const isArray = _.isArray(obj);

    var keys = isArray ? obj : Object.keys(obj);

    keys.forEach((k, i) => {
      var o = isArray ? k : obj[k];

      if(_.isArray(o)){
        o = normalizeObj(o);
      }

      if(_.isObject(o) && o.obj){
        o = o.obj;
      }

      if(isArray){
        obj[i] = o;
      }

      return o;
    });

    return obj;
  }

  function parse (json) {
    return normalizeObj(JSON.parse(json, function (key, value) {
      if (glob.hasOwnProperty(value)) {
        return glob[value] || {};
      } else if (value === 'Mixed') {
        return mgSchema.Types.Mixed
      } else if (value === 'ObjectId') {
        return mgSchema.Types.ObjectId
      } else if (key === 'validator') {
        return (new Function('return( ' + value + ' );'))()
      } if (value && value.toString && value.toString().indexOf('__REGEXP ') === 0) {
        var m = value.split('__REGEXP ')[1].match(/\/(.*)\/(.*)?/)
        return new RegExp(m[1], m[2] || '')
      }
      return value || {};
    }).obj);
  }

  return {
    stringify: stringify,
    parse: parse
  }
};

const schemaHelper = schemaHelperConstructor(Schema);

module.exports = schemaHelper;

