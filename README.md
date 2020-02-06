# React String Replace Recursively

[![npm](https://img.shields.io/npm/dt/react-string-replace-recursively.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/dm/react-string-replace-recursively.svg?maxAge=2592000)]()
## Installation
`npm install react-string-replace-recursively --save`


## Usage
```js
var reactStringReplace = require('react-string-replace-recursively');
var config = {
  'hashTag': {
    pattern: /(#[a-z\d][\w-]*)/ig,
    matcherFn: function (rawText, processed, key) {
      return <Link key={key} to={"tags/" + rawText}>{processed}</Link>;
    }
  },
  'searchTerm': {
    pattern: /(chair)/ig,
    matcherFn: function (rawText, processed, key) {
      return <span key={key} className='search-term-match'>{processed}</span>;
    }
  }
};

var inputString = "I appreciate a good #chairback I must say";
var result = reactStringReplace(config)(inputString);
var parent = <ParentComponent>{result}</ParentComponent>;
```
This would amount to doing :
```js
var parent = (
  <ParentComponent>
    ["I appreciate a good ",
     <Link key={'0-1'} to={"tags/#chairback"}>
       ["#",
        <span key={'0-1-1'} className='search-term-match'>"chair"</span>,
        "back"]
     </Link>,
     " I must say"]
  </ParentComponent>
);
```

Note that the `matcherFn` has three parameters : `rawText`, `processed` and `key`.
The `rawText` corresponds to the section of the string which matches the pattern.
The `processsed` parameter, however, corresponds to the result of replacing other patterns which occur within `rawText`.
Thus if you want to replace patterns within patterns, make sure to wrap your React Components around `processed` as we did in this example. See [Configuration and Limitations](#configuration-and-limitations) for more on pattern intersections.

The `key` is a string that will be unique for any substring of `inputString` that gets replaced.
Be sure to include it within the `key` prop of the returned React component as we did in this example, for React asks that components in an array are provided with unique keys.

## English Description

This library is for replacing substrings of a string that match a particular pattern with a [React](https://facebook.github.io/react) Component, taking special care to account for patterns that occur within other patterns (see [Configuration and Limitations](#configuration-and-limitations) for more on pattern intersections).

For example, I use it to replace substrings matching the 'hashtag' pattern with React Link components from the [react-router](https://github.com/reactjs/react-routerReact) library. You can see it in action on this web app - [crosswise](https://note-taking-crosswise.herokuapp.com/search/?page=1&query=flatMap).

The word *replace* is used loosely here because in a strict sense you can't *replace* a substring with something that is not a string. A string cannot have constituent parts that are not also strings themselves.

This complication is the reason this library exists, for if one were just replacing substrings with things that were also strings, one could get away with using Javascript's native [String.Prototype.replace](http://www.w3schools.com/jsref/jsref_replace.asp) method.

To avoid the conundrum of replacing substrings with things that are not strings, the function supplied by this library creates a special array representation of its input string. This array cleaves the input string in such a way that the desired substring replacements become array-element replacements instead.

Replacing elements in this array is conundrum-free because in Javascript arrays, you can replace an element of one kind (eg String) with an element of any other kind (eg React Component).

After replacements are enacted on this special array, the array may no longer consist entirely of strings, but it will have preserved the sequential structure of the original input string.

What this means is that if *substring1* precedes *substring2* in the input string,
then the elements in which *substring1 or its replacement* appears will precede the elements in which *substring2 or its replacement* appears.

Because sequential structure is thus maintained, the array can be used for displaying the contents of the original string (as enhanced by replacements).

In React, this is a simple affair - one needs simply place the resulting array within another component :
```js
<ParentComponent>{array}</ParentComponent>
```


## Configuration and Limitations

### Pattern Intersections
As far as intersections go, patterns placed earlier in the `config` parameter will be prioritized.

Suppose that `pattern1` is placed earlier than `pattern2`.
Suppose `instance1` and `instance2` are instances of `pattern1` and `pattern2`, respectively.

If `instance1` partially intersects with `instance2`, then `instance1` will be detected and replaced and `instance2` will be ignored.

If `instance1` occurs within `instance2`, then again `instance1` will be detected and replaced and `instance2` will be ignored.

If `instance1` occurs around `instance2`, then by default both will be detected and replaced (see example in [Usage](#usage)). However, if you would like `instance2` to be ignored in this case, you can specify this with the `ignore` key in the config hash. For example, I prefer to ignore hashtag patterns when they appear within urls :
```js
  ...
  'url': {
    pattern: ...
    matcherFn: ...
    ignore: ['hashtag']
  },
  'hashtag': {
    ...
  }
  ...
```

### Text Manipulation

Remember that, for a given `pattern1` , its `matcherFn` must wrap a React Component around `processed` if we desire to replace other patterns that occur within an instance of `pattern1` as well.

Suppose in addition to this, we want to manipulate the string that gets shown within `processed`, ie the string in which our procedure will make any further pattern replacements.

For example, suppose our regular expression for inline code happened to capture the surrounding back-ticks. We can use a regular expression that doesn't do this, but for the sake of example, let's suppose we're using one that does.

In this case, we'd want to remove those back-ticks from strings matching the pattern once those strings are detected, and before they are subjected to replacements based on instances of patterns that can occur within the inline-code pattern (such as search term matches).

In order to perform a text manipulation like this, supply a `textFn` in the pattern's config.
Below is the `textFn` that would be used with inline-code in the hypothetical example :

```js
  ...
  'inlineCode': {
    pattern: /(`[\s\S]+?`)/ig,
    textFn: function (text) {
      return text.slice(1, text.length -1);
    },
    matcherFn: function (rawText, processed) {
      return <code>{processed}</code>;
    }
  },
  ...
```
