export default function PlaybackIcon({ playing }: { playing: boolean }) {
    return (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            {playing ? (
                <>
                    <rect x="4" y="3" width="2.5" height="10" rx="0.7" />
                    <rect x="9.5" y="3" width="2.5" height="10" rx="0.7" />
                </>
            ) : <path d="m5 2.7 8 5.3-8 5.3V2.7Z" />}
        </svg>
    );
}
