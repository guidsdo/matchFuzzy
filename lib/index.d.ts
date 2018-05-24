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
export declare function sort(a: MatchResult, b: MatchResult): 1 | -1 | 0;
