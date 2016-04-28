'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var omit = require('lodash.omit');
var identity = require('lodash.identity');
var keys = require('lodash.keys');
var substituteHelper = require('./substituteHelper');

var patternReplacerCreator = function patternReplacerCreator(config) {

  return function patternReplacer(inputText) {
    var remnantConfig = arguments.length <= 1 || arguments[1] === undefined ? config : arguments[1];
    var rowKey = arguments.length <= 2 || arguments[2] === undefined ? '0' : arguments[2];


    var patternIds = keys(remnantConfig);

    var createNewRowKey = function createNewRowKey(i) {
      return [rowKey, '-', i].join('');
    };

    if (patternIds.length === 0) {
      return [inputText];
    } else {
      var _ret = function () {
        var headId = patternIds[0];
        var headValue = remnantConfig[headId];

        var tail = omit(remnantConfig, headId);

        var nonMatcherFn = function nonMatcherFn(text, i) {
          var newRowKey = createNewRowKey(i);
          return patternReplacer(text, tail, newRowKey);
        };

        var matcherFn = function matcherFn(text, i) {
          var textFn = headValue.textFn || identity;
          var newText = textFn(text);
          var toIgnore = headValue.ignore || [];
          var matcherTail = omit(tail, toIgnore);

          var newRowKey = createNewRowKey(i);
          var recursiveCall = patternReplacer(newText, matcherTail, newRowKey);
          return headValue.matcherFn(newText, recursiveCall, newRowKey);
        };
        return {
          v: substituteHelper(inputText, headValue.pattern, matcherFn, nonMatcherFn)
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };
};

module.exports = patternReplacerCreator;