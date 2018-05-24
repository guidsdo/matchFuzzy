# matchFuzzy
Match your query fuzzy on given target

[![Build Status](https://travis-ci.org/guidojo/matchFuzzy.svg?branch=master)](https://travis-ci.org/guidojo/matchFuzzy)
[![npm version](https://badge.fury.io/js/matchfuzzy.svg)](https://badge.fury.io/js/matchfuzzy)
[![Coverage Status](https://coveralls.io/repos/github/guidojo/matchFuzzy/badge.svg?branch=master)](https://coveralls.io/github/guidojo/matchFuzzy?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Usage
```typescript
export declare type MatchResult = {
    offset: number;
    positions: number[];
    extraChars: number;
    trailingChars: number;
};

/**
 * Try to find a given query in a given target in a "fuzzy" manner.
 *
 * @param query the string you search with
 * @param target the string you search in
 * @param characterLimit maximum amount of characters in result. Example: { " ": 6, ".": 0 } means a sentence with a maximum of 6 spaces.
 */
export declare function matchFuzzy(query: string, target: string, characterLimit?: {
    [character: string]: number;
}): MatchResult | null;

/**
 * Array sort function in order: extra chars, offset, trailing chars.
 *
 * @param a result a
 * @param b result b
 */
export declare function sort(a: MatchResult, b: MatchResult): 1 | -1 | 0;
```
