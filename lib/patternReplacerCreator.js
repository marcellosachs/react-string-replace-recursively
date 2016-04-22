'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ = require('lodash');
var substituteHelper = require('./substituteHelper');

var patternReplacerCreator = function patternReplacerCreator(config) {

  return function patternReplacer(inputText) {
    var remnantConfig = arguments.length <= 1 || arguments[1] === undefined ? config : arguments[1];


    var patternIds = _.keys(remnantConfig);

    if (patternIds.length === 0) {
      return [inputText];
    } else {
      var _ret = function () {
        var headId = patternIds[0];
        var headValue = remnantConfig[headId];

        var tail = _.omit(remnantConfig, headId);

        var nonMatcherFn = function nonMatcherFn(text) {
          return patternReplacer(text, tail);
        };

        var rightFlankNonMatcherTextFn = headValue.rightFlankNonMatcherTextFn || _.identity;
        var rightFlankNonMatcherFn = _.flowRight(nonMatcherFn, rightFlankNonMatcherTextFn);

        var matcherFn = function matcherFn(text) {
          var textFn = headValue.textFn || _.identity;
          var newText = textFn(text);
          var toIgnore = headValue.ignore || [];
          var matcherTail = _.omit(tail, toIgnore);
          var recursiveCall = patternReplacer(newText, matcherTail);
          return headValue.matcherFn(newText, recursiveCall);
        };
        return {
          v: substituteHelper(inputText, headValue.pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn)
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };
};

module.exports = patternReplacerCreator;