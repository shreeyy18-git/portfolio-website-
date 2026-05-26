/**
 * Custom SplitText replacement for GSAP Club GreenSock (gsap-trial) SplitText plugin.
 * Wraps text nodes in character/word/line <span> elements with class names.
 * Exposes the same API: constructor, chars/words/lines properties, and revert().
 */

interface SplitTextVars {
    type?: string;
    linesClass?: string;
    charsClass?: string;
    wordsClass?: string;
}

interface PositionedWord {
    element: HTMLElement;
    top: number;
}

export class SplitText {
    public chars: HTMLElement[] = [];
    public words: HTMLElement[] = [];
    public lines: HTMLElement[] = [];
    public linesClass: string = "";
    public charsClass: string = "";
    public wordsClass: string = "";

    private elements: Element[] = [];
    private originalHTMLs: Map<Element, string> = new Map();

    constructor(
        target: string | string[] | Element | Element[],
        vars?: SplitTextVars
    ) {
        this.linesClass = vars?.linesClass || "split-line";
        this.charsClass = vars?.charsClass || "split-char";
        this.wordsClass = vars?.wordsClass || "split-word";
        const types = vars?.type || "chars,words,lines";

        // Resolve targets to Element array
        this.elements = this.resolveTargets(target);

        const doChars = types.includes("chars");
        const doLines = types.includes("lines");

        this.elements.forEach((el) => {
            if (!(el instanceof HTMLElement)) return;
            // Save original HTML for revert
            this.originalHTMLs.set(el, el.innerHTML);

            // Get text content from direct text nodes only (skip already-wrapped content)
            const textNodes: Text[] = [];
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
            while (walker.nextNode()) {
                const node = walker.currentNode as Text;
                // Only include direct text nodes that have non-whitespace content
                if (node.textContent && node.textContent.trim().length > 0) {
                    textNodes.push(node);
                }
            }

            if (textNodes.length === 0) {
                // If no direct text nodes, try to use innerText
                const text = el.innerText || "";
                if (!text.trim()) return;
                el.innerHTML = "";
                textNodes.push(document.createTextNode(text));
                el.appendChild(textNodes[0]);
            }

            // Build char and word spans
            const fragment = document.createDocumentFragment();
            const allWordElements: HTMLElement[] = [];

            textNodes.forEach((textNode) => {
                const text = textNode.textContent || "";
                const words = text.split(/(\s+)/);

                words.forEach((word) => {
                    if (word.length === 0) return;

                    if (/^\s+$/.test(word)) {
                        // Preserve whitespace as a text node
                        fragment.appendChild(document.createTextNode(word));
                        return;
                    }

                    // Create word span
                    const wordSpan = document.createElement("span");
                    wordSpan.className = "split-word" + (this.wordsClass ? " " + this.wordsClass : "");

                    if (doChars) {
                        // Wrap each character
                        for (let i = 0; i < word.length; i++) {
                            const charSpan = document.createElement("span");
                            charSpan.className = "split-char" + (this.charsClass ? " " + this.charsClass : "");
                            charSpan.textContent = word[i];
                            wordSpan.appendChild(charSpan);
                            this.chars.push(charSpan);
                        }
                    } else {
                        wordSpan.textContent = word;
                    }

                    fragment.appendChild(wordSpan);
                    allWordElements.push(wordSpan);
                    this.words.push(wordSpan);
                });
            });

            // Clear element and append new structure
            el.innerHTML = "";
            el.appendChild(fragment);

            // Build lines after DOM is updated so positions are measurable
            if (doLines) {
                this.buildLines(el, allWordElements);
            }
        });

        // If multiple elements were targeted, flatten and deduplicate lines from all
        if (doLines && this.elements.length > 1) {
            this.rebuildGlobalLines();
        }
    }

    /**
     * Detect natural line breaks by measuring word element positions.
     * Words on the same vertical line (same bounding box top) are grouped.
     */
    private buildLines(_container: HTMLElement, wordElements: HTMLElement[]): void {
        if (wordElements.length === 0) return;

        const positioned: PositionedWord[] = wordElements.map((el) => ({
            element: el,
            top: el.getBoundingClientRect().top,
        }));

        // Group by top position (with small tolerance for sub-pixel differences)
        const tolerance = 1;
        const lineGroups: HTMLElement[][] = [];

        positioned.forEach((pw) => {
            // Find matching line group
            let found = false;
            for (const group of lineGroups) {
                const firstTop = group[0].getBoundingClientRect().top;
                if (Math.abs(pw.top - firstTop) <= tolerance) {
                    group.push(pw.element);
                    found = true;
                    break;
                }
            }
            if (!found) {
                lineGroups.push([pw.element]);
            }
        });

        // Wrap each line group in a line span
        lineGroups.forEach((group) => {
            const lineSpan = document.createElement("span");
            lineSpan.className = "split-line" + (this.linesClass ? " " + this.linesClass : "");

            // Move elements into the line span
            const parent = group[0].parentNode;
            if (!parent) return;

            // Insert the line span before the first word in the group
            parent.insertBefore(lineSpan, group[0]);

            group.forEach((wordEl) => {
                lineSpan.appendChild(wordEl);
            });

            this.lines.push(lineSpan);
        });
    }

    /**
     * Rebuild lines across all targeted elements for consistent line arrays.
     */
    private rebuildGlobalLines(): void {
        // Collect all line spans from all containers
        const allLines: HTMLElement[] = [];
        this.elements.forEach((el) => {
            const lineSpans = el.querySelectorAll(":scope > .split-line");
            lineSpans.forEach((span) => {
                if (span instanceof HTMLElement) {
                    allLines.push(span);
                }
            });
        });
        this.lines = allLines;
    }

    /**
     * Resolve various target formats to an array of Elements.
     */
    private resolveTargets(target: string | string[] | Element | Element[]): Element[] {
        if (typeof target === "string") {
            const nodes = document.querySelectorAll(target);
            return Array.from(nodes);
        }
        if (Array.isArray(target)) {
            const result: Element[] = [];
            target.forEach((t) => {
                if (typeof t === "string") {
                    const nodes = document.querySelectorAll(t);
                    result.push(...Array.from(nodes));
                } else if (t instanceof Element) {
                    result.push(t);
                }
            });
            return result;
        }
        if (target instanceof Element) {
            return [target];
        }
        return [];
    }

    /**
     * Restore original HTML content for all affected elements.
     */
    revert(): void {
        this.originalHTMLs.forEach((html, el) => {
            el.innerHTML = html;
        });
        this.chars = [];
        this.words = [];
        this.lines = [];
    }
}