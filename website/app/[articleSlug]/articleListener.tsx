"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import PlaybackIcon from "../components/playbackIcon";
import NarrationOptions from "./narrationOptions";
import styles from "./articleListener.module.css";

function clock(seconds: number) {
    const whole = Math.floor(seconds);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

export default function ArticleListener({ src, duration }: { src: string, duration: number }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [started, setStarted] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [failed, setFailed] = useState(false);
    const [ended, setEnded] = useState(false);
    const [speed, setSpeed] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;
        const pause = () => audio?.pause();
        window.addEventListener("pagehide", pause);
        return () => {
            window.removeEventListener("pagehide", pause);
            pause();
        };
    }, []);

    async function toggle() {
        const audio = audioRef.current;
        if (!audio) return;
        if (!failed && !audio.paused) {
            audio.pause();
            return;
        }
        if (failed) {
            // A failed media request can be cached by the browser.
            audio.src = `${src}?retry=${Date.now()}`;
            audio.load();
        }
        setFailed(false);
        try {
            await audio.play();
        } catch (error) {
            if (!(error instanceof DOMException && error.name === "AbortError")) setFailed(true);
        }
    }

    let label = "Listen to article";
    if (failed) label = "Retry audio";
    else if (playing) label = "Pause audio";
    else if (ended) label = "Listen again";
    else if (started) label = "Resume audio";

    return (
        <div role="group" aria-label="Article narration">
            <audio ref={audioRef} src={src} preload="none"
                onPlay={() => {
                    setPlaying(true);
                    setStarted(true);
                    setEnded(false);
                }}
                onPause={() => setPlaying(false)}
                onEnded={() => { setPlaying(false); setStarted(false); setEnded(true); }}
                onError={() => { setPlaying(false); setFailed(true); }}
                onTimeUpdate={event => setElapsed(event.currentTarget.currentTime)} />
            <div className={styles.bar}>
                <button type="button" className={styles.toggle} data-expanded={started} onClick={toggle} aria-label={label}>
                    <span className={styles.disc}><PlaybackIcon playing={playing} /></span>
                    {!started && <span className={styles.intro}>{label}</span>}
                </button>
                {started && <>
                    <span className={styles.time}>{clock(elapsed)}</span>
                    <input type="range" className={styles.seek} aria-label="Seek through article"
                        aria-valuetext={`${clock(elapsed)} of ${clock(duration)}`}
                        min={0} max={duration} step="1" value={Math.min(elapsed, duration)}
                        style={{ "--played": `${Math.min(100, elapsed / duration * 100)}%` } as CSSProperties}
                        onChange={event => {
                            const time = event.currentTarget.valueAsNumber;
                            if (audioRef.current) audioRef.current.currentTime = time;
                            setElapsed(time);
                        }} />
                </>}
                <span className={styles.time}>{clock(duration)}{!started && " min"}</span>
                <NarrationOptions key={started ? "settings" : "info"} started={started} speed={speed}
                    onSpeed={rate => {
                        const audio = audioRef.current;
                        if (audio) {
                            audio.defaultPlaybackRate = rate;
                            audio.playbackRate = rate;
                        }
                        setSpeed(rate);
                    }} />
            </div>
            {failed && <span className={styles.error} role="status">Audio couldn’t load. Try playing it again.</span>}
        </div>
    );
}
