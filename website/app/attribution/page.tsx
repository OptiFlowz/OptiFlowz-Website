import FadeInOnScroll from "@/app/components/fadeInOnScroll";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attribution",
  description: "Attribution - Assets OptiFlowz uses in the website or its products",
};

export default function Attribution() {
    return(
        <main>
            <FadeInOnScroll>
                <h1 className="mainTitle">Attribution</h1>
            </FadeInOnScroll>
            <section className="w-full max-w-3xl px-6 pb-16">
                <h2 className="text-2xl mb-4">14-inch MacBook Pro 3D model</h2>
                <p className="text-white/70 leading-relaxed">
                    <a className="underline" href="https://sketchfab.com/3d-models/macbook-pro-14-space-gray-95b968f6e3054642be42093ea56f90b8">Macbook Pro 14 Space Gray</a>
                    {" by "}<a className="underline" href="https://sketchfab.com/appleyss">appleyss</a>
                    {", licensed under "}<a className="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
                    {" Adapted with a scroll-controlled view, adjusted materials and lighting, and OptiFlowz platform video on the display."}
                </p>
            </section>
        </main>
    )
}
