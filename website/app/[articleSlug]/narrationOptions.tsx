"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import styles from "./articleListener.module.css";

const speeds = [0.75, 1, 1.25, 1.5, 2];

export default function NarrationOptions({ started, speed, onSpeed }: {
    started: boolean;
    speed: number;
    onSpeed: (rate: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const id = useId();

    useLayoutEffect(() => {
        const button = trigger.current;
        const menu = panel.current;
        if (!open || !button || !menu) return;
        const viewport = window.visualViewport;
        const header = document.querySelector("header.siteHeader");

        function position() {
            if (!button || !menu) return;
            const anchor = button.getBoundingClientRect();
            const margin = 8;
            const gap = 10;
            const top = viewport?.offsetTop ?? 0;
            const bottom = top + (viewport?.height ?? window.innerHeight);
            const left = (viewport?.offsetLeft ?? 0) + margin;
            const right = left + (viewport?.width ?? window.innerWidth) - 2 * margin;
            const headerBottom = header?.getBoundingClientRect().bottom ?? top;
            const above = anchor.top - Math.max(top, headerBottom) - margin - gap;
            const below = bottom - anchor.bottom - margin - gap;
            const flip = below < menu.scrollHeight && above > below;
            menu.dataset.side = flip ? "above" : "below";
            menu.style.maxHeight = `${Math.max(0, flip ? above : below)}px`;
            menu.style.maxWidth = `${Math.max(0, right - left)}px`;
            const menuRight = Math.max(left + menu.offsetWidth, Math.min(anchor.right, right));
            menu.style.right = `${anchor.right - menuRight}px`;
        }

        function outside(event: PointerEvent) {
            if (event.target instanceof Node && !button?.contains(event.target) && !menu?.contains(event.target)) setOpen(false);
        }

        position();
        const observer = new ResizeObserver(position);
        observer.observe(menu);
        observer.observe(button);
        if (header) observer.observe(header);
        window.addEventListener("scroll", position, true);
        window.addEventListener("resize", position);
        viewport?.addEventListener("resize", position);
        viewport?.addEventListener("scroll", position);
        document.addEventListener("pointerdown", outside);
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", position, true);
            window.removeEventListener("resize", position);
            viewport?.removeEventListener("resize", position);
            viewport?.removeEventListener("scroll", position);
            document.removeEventListener("pointerdown", outside);
        };
    }, [open]);

    return (
        <div className={styles.options} onKeyDown={event => {
            if (event.key === "Escape" && open) {
                setOpen(false);
                trigger.current?.focus({ preventScroll: true });
            }
        }} onBlur={event => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}>
            <button ref={trigger} type="button" className={styles.optionsButton}
                aria-label={started ? "Playback settings" : "About this narration"}
                aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
                <svg key={String(started)} width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    {started ? <>
                        <path d="M3 7.5h4m6 0h8M3 16.5h9m6 0h3" />
                        <circle cx="10" cy="7.5" r="2.7" /><circle cx="15" cy="16.5" r="2.7" />
                    </> : <>
                        <circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" />
                    </>}
                </svg>
            </button>
            <div id={id} ref={panel} className={styles.panel} data-open={open} inert={!open}>
                {started ? <fieldset>
                    <legend>Playback speed</legend>
                    <div className={styles.rates}>
                        <span aria-hidden="true" className={styles.selection}
                            style={{ transform: `translateX(${speeds.indexOf(speed) * 100}%)` }} />
                        {speeds.map(rate => (
                            <label key={rate}>
                                <input type="radio" name={id} checked={speed === rate} onChange={() => onSpeed(rate)} />
                                <span>{rate}×</span>
                            </label>
                        ))}
                    </div>
                </fieldset> : "This article is narrated with Heart, our synthetic English voice."}
            </div>
        </div>
    );
}
