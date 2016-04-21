'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ = require('lodash');
var substituteHelper = require('./substituteHelper');

var patternReplacerCreator = function patternReplacerCreator(config) {

  var _shouldIgnore = function _shouldIgnore(id, surroundingPatterns) {
    var patternsToIgnore = _.reduce(surroundingPatterns, function (acc, surroundingPatternId) {
      var x = config[surroundingPatternId].ignore || [];
      return _.concat(acc, x);
    }, []);
    return _.includes(patternsToIgnore, id);
  };

  return function patternReplacer(inputText) {
    var remnantConfig = arguments.length <= 1 || arguments[1] === undefined ? config : arguments[1];
    var surroundingPatterns = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];


    var patternIds = _.keys(remnantConfig);

    if (patternIds.length === 0) {
      return inputText;
    } else {
      var _ret = function () {
        var headId = patternIds[0];
        var headValue = remnantConfig[headId];
        var tail = _.omit(remnantConfig, headId);

        var nonMatcherFn = function nonMatcherFn(text) {
          return patternReplacer(text, tail, surroundingPatterns);
        };

        var rightFlankNonMatcherFn = void 0;

        if (headValue.rightFlankNonMatcherTextFn) {
          rightFlankNonMatcherFn = _.flowRight(nonMatcherFn, headValue.rightFlankNonMatcherTextFn);
        } else {
          rightFlankNonMatcherFn = nonMatcherFn;
        }

        var matcherFn = void 0;
        if (_shouldIgnore(headId, surroundingPatterns)) {
          // another way to handle ignorance might be to remove what should be ignored from the remnant config that gets passed to recursive call
          matcherFn = nonMatcherFn;
        } else {
          matcherFn = function matcherFn(text) {
            var textFn = headValue.textFn || _.identity;
            var newText = textFn(text);
            var newSurroundingPatterns = _.concat(surroundingPatterns, [headId]);
            var recursiveCall = patternReplacer(newText, tail, newSurroundingPatterns);
            return headValue.matcherFn(newText, recursiveCall);
          };
        }
        return {
          v: substituteHelper(inputText, headValue.pattern, matcherFn, nonMatcherFn, rightFlankNonMatcherFn)
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  };
};

module.exports = patternReplacerCreator;