"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Try to find a given query in a given target in a "fuzzy" manner.
 *
 * @param query the string you search with
 * @param target the string you search in
 */
function matchFuzzy(query, target) {
    if (!target || !query || target.length < query.length)
        return null;
    const queryLowerCased = query.toLowerCase();
    const targetLowerCased = target.toLowerCase();
    const occurencesPerChar = [];
    for (let i = 0; i < queryLowerCased.length; i++) {
        const character = queryLowerCased[i];
        const startIndex = occurencesPerChar.length ? occurencesPerChar[i - 1][0] + 1 : 0;
        const occurences = findOccurences(targetLowerCased, character, startIndex);
        if (!occurences.length)
            return null;
        occurencesPerChar.push(occurences);
    }
    let bestCombination = null;
    const combinations = [];
    getPossibleCombinations(occurencesPerChar, combinations);
    for (const set of combinations) {
        const extraCharCount = calculateExtraChars(set);
        if (!bestCombination || bestCombination[0] > extraCharCount)
            bestCombination = [extraCharCount, set];
        // Better than 0 character difference isn't possible, so just break;
        if (bestCombination[0] === 0)
            break;
    }
    return {
        offset: bestCombination[1][0],
        positions: bestCombination[1],
        extraChars: bestCombination[0],
        trailingChars: target.length - (bestCombination[1][bestCombination[1].length - 1] + 1)
    };
}
exports.matchFuzzy = matchFuzzy;
function sort(a, b) {
    // How much extra characters are inbetween each character of the search query? Better match = higher rank
    if (a.extraChars !== b.extraChars)
        return a.extraChars < b.extraChars ? -1 : 1;
    // If above result is equal; how many characters are in front of the result? Less = higher rank
    if (a.offset !== b.offset)
        return a.offset < b.offset ? -1 : 1;
    // If above result is equal; how many characters are after the result? Less = higher rank
    if (a.trailingChars !== b.trailingChars)
        return a.trailingChars < b.trailingChars ? -1 : 1;
    // There can be an equal match, then we don't really care
    return 0;
}
exports.sort = sort;
function getPossibleCombinations(characterPositions, result, depth = 0) {
    const currentOccurence = characterPositions[depth];
    if (depth === 0) {
        // Init result with for first position (depth is 0)
        currentOccurence.forEach(occurence => result.push([occurence]));
        // Only continue if there is something to continue to
        if (characterPositions.length > 1)
            getPossibleCombinations(characterPositions, result, depth + 1);
        // Remove sets that are too small and thus weren't a total match
        for (let i = 0; i < result.length; i++) {
            if (result[i].length !== characterPositions.length) {
                result.splice(i, 1);
                i--;
            }
        }
    }
    else {
        for (const occurence of currentOccurence) {
            result.forEach((set, i) => {
                // Does set have a position at [depth]? And is that position before me?
                if (depth === set.length && set[set.length - 1] < occurence) {
                    set.push(occurence);
                    // Only continue if there are other depts to handle
                    if (characterPositions.length - 1 > depth) {
                        getPossibleCombinations(characterPositions, result, depth + 1);
                    }
                }
            });
        }
    }
}
/**
 * Where does the given character occur in given target?
 *
 * Examples:
 * findOccurences("aaaaa", "b", 0)      => [];
 * findOccurences("aabaaba", "b", 0)    => [2, 5];
 * findOccurences("aabaaba", "b", 2)    => [5];
 *
 * @param target where to search the character in
 * @param character character to find the occurence of
 * @param startIndex from where to search (array position, so starts at 0)
 *
 */
function findOccurences(target, character, startIndex = 0, result = []) {
    const matchIndex = target.indexOf(character, startIndex);
    return matchIndex >= 0 ? findOccurences(target, character, matchIndex + 1, [...result, matchIndex]) : result;
}
/**
 * Find out how much positions are inbetween the given positions, to find out how accurate a fuzzy search was.
 *
 * Examples:
 * [0, 1, 2, 3] => 0
 * [0, 5, 7]    => 5
 * [9, 12, 13]  => 2
 *
 */
function calculateExtraChars(characterPositions) {
    let totalCharsInBetween = 0;
    let previousCharPosition = characterPositions[0];
    for (let i = 1; i < characterPositions.length; i++) {
        const position = characterPositions[i];
        totalCharsInBetween += position - previousCharPosition - 1;
        previousCharPosition = position;
    }
    return totalCharsInBetween;
}
//# sourceMappingURL=index.js.map