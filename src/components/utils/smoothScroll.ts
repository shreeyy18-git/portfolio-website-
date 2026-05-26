/**
 * Custom ScrollSmoother replacement for GSAP Club GreenSock (gsap-trial) ScrollSmoother plugin.
 * Provides smooth scrolling via CSS transform on the content wrapper with scroll state management.
 *
 * The ScrollSmoother class acts as both the static API and the instance type,
 * matching the original gsap-trial/ScrollSmoother interface used in this project:
 *   ScrollSmoother.create({...}) -> returns ScrollSmoother instance
 *   instance.scrollTop(), instance.paused(), instance.scrollTo()
 *   ScrollSmoother.refresh(true)
 */

interface ScrollSmootherVars {
    wrapper: string;
    content: string;
    smooth?: number;
    speed?: number;
    effects?: boolean;
    autoResize?: boolean;
    ignoreMobileResize?: boolean;
}

// Track the current active instance for static refresh()
let _activeInstance: ScrollSmoother | null = null;

export class ScrollSmoother {
    // ── Instance state ──
    private wrapper: HTMLElement | null = null;
    private content: HTMLElement | null = null;
    private _scrollY: number = 0;
    private _paused: boolean = false;
    private targetScrollY: number = 0;
    private rafId: number | null = null;
    private smoothFactor: number;
    private resizeHandler: (() => void) | null = null;

    /**
     * Private constructor — instances are created via ScrollSmoother.create().
     */
    private constructor(vars: ScrollSmootherVars) {
        this.wrapper = document.querySelector(vars.wrapper);
        this.content = document.querySelector(vars.content);
        this.smoothFactor = vars.smooth || 1.5;

        if (!this.wrapper || !this.content) {
            console.warn("ScrollSmoother: wrapper or content element not found");
            return;
        }

        this.setupScrollCapture();
        this._scrollY = window.scrollY || 0;
        this.targetScrollY = this._scrollY;
        this.updateTransform();
        this.startLoop();

        this.resizeHandler = () => this.refresh();
        window.addEventListener("resize", this.resizeHandler);
    }

    // ── Static API ──

    /**
     * Create a new ScrollSmoother instance.
     */
    static create(vars: ScrollSmootherVars): ScrollSmoother {
        const instance = new ScrollSmoother(vars);
        _activeInstance = instance;
        return instance;
    }

    /**
     * Refresh / recalculate smoother dimensions.
     */
    static refresh(updateBody?: boolean): void {
        if (_activeInstance) {
            _activeInstance.refresh(updateBody);
        }
    }

    // ── Internal setup ──

    /**
     * Intercept native scroll events and prepare wrapper/content for smooth scrolling.
     */
    private setupScrollCapture(): void {
        if (!this.wrapper) return;

        window.addEventListener(
            "scroll",
            () => {
                if (!this._paused) {
                    this.targetScrollY = window.scrollY || 0;
                }
            },
            { passive: true }
        );

        this.wrapper.style.overflow = "hidden";
        this.wrapper.style.position = "fixed";
        this.wrapper.style.top = "0";
        this.wrapper.style.left = "0";
        this.wrapper.style.width = "100%";
        this.wrapper.style.height = "100%";

        if (this.content) {
            this.content.style.willChange = "transform";
        }

        this.updateBodyHeight();
    }

    /**
     * Set body height to match content height so native scroll tracking works.
     */
    private updateBodyHeight(): void {
        if (this.content) {
            document.body.style.height = this.content.scrollHeight + "px";
        }
    }

    /**
     * Apply transform offset to the content wrapper.
     */
    private updateTransform(): void {
        if (this.content) {
            this.content.style.transform = `translateY(${-this._scrollY}px)`;
        }
    }

    /**
     * RAF-based smooth scroll loop.
     */
    private startLoop(): void {
        const tick = () => {
            if (this._paused) {
                this._scrollY = this.targetScrollY;
                this.updateTransform();
            } else {
                const diff = this.targetScrollY - this._scrollY;
                if (Math.abs(diff) > 0.5) {
                    this._scrollY += diff * (1 / Math.max(this.smoothFactor, 1));
                    this.updateTransform();
                } else if (Math.abs(diff) > 0) {
                    this._scrollY = this.targetScrollY;
                    this.updateTransform();
                }
            }
            this.rafId = requestAnimationFrame(tick);
        };
        this.rafId = requestAnimationFrame(tick);
    }

    // ── Instance API ──

    /**
     * Get or set the current scroll position.
     */
    scrollTop(value?: number): number {
        if (value !== undefined) {
            this.targetScrollY = value;
            window.scrollTo(0, value);
            if (this._paused) {
                this._scrollY = value;
                this.updateTransform();
            }
        }
        return this._scrollY;
    }

    /**
     * Pause or resume smooth scrolling.
     */
    paused(state: boolean): void {
        this._paused = state;
        if (!state) {
            this.targetScrollY = window.scrollY || 0;
        }
    }

    /**
     * Smooth scroll to a target element, selector, or position.
     */
    scrollTo(
        target: string | HTMLElement | number,
        smooth?: boolean,
        _position?: string
    ): void {
        let targetY: number;

        if (typeof target === "number") {
            targetY = target;
        } else if (typeof target === "string") {
            const el = document.querySelector(target);
            if (!el) return;
            const rect = el.getBoundingClientRect();
            targetY = rect.top + this._scrollY;
        } else if (target instanceof HTMLElement) {
            const rect = target.getBoundingClientRect();
            targetY = rect.top + this._scrollY;
        } else {
            return;
        }

        if (smooth !== false) {
            window.scrollTo({ top: targetY, behavior: "smooth" });
            this.targetScrollY = targetY;
        } else {
            window.scrollTo(0, targetY);
            this.targetScrollY = targetY;
            this._scrollY = targetY;
            this.updateTransform();
        }
    }

    /**
     * Recalculate content dimensions and sync scroll.
     */
    refresh(updateBody?: boolean): void {
        if (updateBody) {
            this.updateBodyHeight();
        }
        this.targetScrollY = window.scrollY || 0;
    }

    /**
     * Clean up.
     */
    kill(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
        }
        if (this.wrapper) {
            this.wrapper.style.overflow = "";
            this.wrapper.style.position = "";
            this.wrapper.style.top = "";
            this.wrapper.style.left = "";
            this.wrapper.style.width = "";
            this.wrapper.style.height = "";
        }
        if (this.content) {
            this.content.style.transform = "";
            this.content.style.willChange = "";
        }
        document.body.style.height = "";
    }
}

// Export a smoother global reference
export let smoother: ScrollSmoother | null = null;