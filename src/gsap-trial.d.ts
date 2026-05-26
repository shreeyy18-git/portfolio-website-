declare module "gsap-trial/SplitText" {
    export class SplitText {
        constructor(
            target: string | string[] | Element | Element[],
            vars?: Record<string, any>
        );
        chars: HTMLElement[];
        words: HTMLElement[];
        lines: HTMLElement[];
        linesClass: string;
        charsClass: string;
        wordsClass: string;
        revert(): void;
        static create(
            targets: string | string[] | Element | Element[],
            vars?: Record<string, any>
        ): SplitText;
    }
}