import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-main">
      <section className="not-found-stage">
        <div className="not-found-watermark" aria-hidden="true">404</div>

        <div className="not-found-content">
          <svg className="not-found-spark" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 6v52M6 32h52M13.6 13.6l36.8 36.8M50.4 13.6 13.6 50.4" />
          </svg>
          <h1>Page not found.</h1>
          <p>
            This page does not exist. Please head back home and try again.
          </p>

          <Link href="/" className="not-found-home-button noLineHover">
            Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
