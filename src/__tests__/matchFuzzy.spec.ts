import { matchFuzzy } from "..";

describe("matchFuzzy", () => {
    it("returns null when there is no match", () => {
        expect(matchFuzzy("a", "b")).toBeNull();
        expect(matchFuzzy("a", "there cen't be e metch")).toBeNull();
        expect(matchFuzzy("overview", "onerview")).toBeNull();
        expect(matchFuzzy("overview", "voerview")).toBeNull();
    });

    it("finds a match no matter what casing is used", () => {
        expect(matchFuzzy("a", "A")!.offset).toBe(0);
        expect(matchFuzzy("D", "guido")!.offset).toBe(3);
        expect(matchFuzzy("gUIdO", "TheOneThatIsAwesomeIsGuiDo")!.offset).toBe(21);
    });

    describe("when having multiple match options", () => {
        it("returns the match with the least offset", () => {
            const resultA = matchFuzzy("a", "aa")!;
            expect(resultA.offset).toBe(0);
            expect(resultA.positions).toEqual([0]);
            expect(resultA.extraChars).toBe(0);
            expect(resultA.trailingChars).toBe(1);

            const resultB = matchFuzzy("bla", "blablabla")!;
            expect(resultB.offset).toBe(0);
            expect(resultB.positions).toEqual([0, 1, 2]);
            expect(resultB.extraChars).toBe(0);
            expect(resultB.trailingChars).toBe(6);

            const resultC = matchFuzzy("bla", "aaaaablablablaa")!;
            expect(resultC.offset).toBe(5);
            expect(resultC.positions).toEqual([5, 6, 7]);
            expect(resultC.extraChars).toBe(0);
            expect(resultC.trailingChars).toBe(7);
        });

        it("returns the match with the least characters in between the target", () => {
            const result = matchFuzzy("guido", "Gui......doGui....doGui.....doGui...doGui.......doGui........do")!;

            expect(result.offset).toBe(30);
            expect(result.positions).toEqual([30, 31, 32, 36, 37]);
            expect(result.extraChars).toBe(3);
            expect(result.trailingChars).toBe(25);
        });
    });

    describe("when passing character limits", () => {
        const target = "This iz a pretty long sentence. Yes, pretty long. Really, pretty long, very much.";

        it("finds a match where below limits", () => {
            const result = matchFuzzy("iz much", target, { x: 0 })!;

            expect(result.offset).toBe(5);
            expect(result.positions).toEqual([5, 6, 7, 76, 77, 78, 79]);
            expect(result.extraChars).toBe(68);
            expect(result.trailingChars).toBe(1);
        });

        it("finds no match where above limits", () => {
            const resultA = matchFuzzy("iz much", target, { " ": 11 });
            const resultB = matchFuzzy("iz much", target, { " ": 99, ".": 0 });

            expect(resultA).toBeNull();
            expect(resultB).toBeNull();
        });
    });
});
