# React Replace

This library is for replacing substrings of a string that match a particular pattern with something else.
I use it in particular for swapping substrings with React components.
For example, I use it to replace substrings matching the 'hashtag' pattern with React Link components from the React Router library.

The word *replace* is used loosely here because in a strict sense you can't *replace* a substring with something that is not a string.
A string cannot have constituent parts that are not also strings themselves.

This complication is the reason this library exists, for if one were just replacing substrings with things that were also strings, one could get away with using Javscript's native String.Prototype.replace method.

To avoid the conundrum of replacing substrings with things that are not strings, the function supplied by this library creates a special array representation of its input string.
This array cleaves the input string in such a way that the desired substring replacements become array-element replacements instead.

Replacing elements in this array is conundrum-free because in JS arrays, you can replace an element of one kind (eg `String`) with an element of any other kind (eg `React Component`).


After replacements are enacted on this special array, the array may no longer consist entirely of strings, though it will have preserved the sequential structure of the original input string.

What this means is that if substring1 precedes substring2 in the input string,
then the elements in which (substring1 or its replacement) appears will precede the elements in which (substring2 or its replacement) appears.

Because sequential structure is thus maintained, the array can be used for displaying the contents of the original string (as enhanced by replacements).

In React, this is a simple affair - one needs simply place the array within another component :
```<ParentComponent>{array}</ParentComponent>```