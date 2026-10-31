import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Flower2, Sun, Leaf, Snowflake, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/shopify";
import { useReveal } from "@/hooks/useCartSync";
import hero from "@/assets/hero.jpg";
import primavera from "@/assets/primavera.jpg";
import verano from "@/assets/verano.jpg";
import otonoInvierno from "@/assets/otono-invierno.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BOUTIQUE ML — Moda elegante para cada estación" },
      { name: "description", content: "Boutique ML: colecciones de ropa de primavera, verano, otoño e invierno con estilo elegante en rosa, dorado y blanco." },
      { property: "og:title", content: "BOUTIQUE ML — Moda para cada estación" },
      { property: "og:description", content: "Descubre nuestras colecciones de temporada, elegantes y femeninas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SEASONS = [
  { key: "primavera", name: "Primavera", icon: Flower2, img: primavera, text: "Flores, tonos suaves y telas ligeras." },
  { key: "verano", name: "Verano", icon: Sun, img: verano, text: "Lino, blancos luminosos y frescura." },
  { key: "otono", name: "Otoño", icon: Leaf, img: otonoInvierno, text: "Capas cálidas y texturas acogedoras." },
  { key: "invierno", name: "Invierno", icon: Snowflake, img: otonoInvierno, text: "Abrigos elegantes y tejidos suaves." },
];

const FILTERS = [{ key: "todas", name: "Todas" }, ...SEASONS.map((s) => ({ key: s.key, name: s.name }))];

function Index() {
  const [season, setSeason] = useState("todas");
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", season],
    queryFn: () => fetchProducts(24, season === "todas" ? undefined : `tag:${season}`),
  });
  useReveal();

  return (
    <div className="overflow-hidden">
      <SiteHeader />

      {/* Portada */}
      <section className="relative flex min-h-screen items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={hero} alt="Vestido rosa pastel en Boutique ML" width={1600} height={1008} className="animate-slow-zoom h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </div>
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className="animate-float absolute text-gold opacity-60"
            style={{ left: `${10 + i * 14}%`, top: `${15 + ((i * 37) % 65)}%`, animationDelay: `${i * 0.9}s`, width: 14 + (i % 3) * 6 }}
          />
        ))}
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="max-w-xl">
            <p className="animate-fade-up text-xs uppercase tracking-[0.4em] text-gold">Nueva colección de temporada</p>
            <h1 className="animate-fade-up mt-6 text-6xl font-light leading-[0.95] md:text-8xl" style={{ animationDelay: "0.15s" }}>
              Elegancia para <em className="text-gradient-gold font-medium">cada estación</em>
            </h1>
            <p className="animate-fade-up mt-6 max-w-md text-muted-foreground" style={{ animationDelay: "0.3s" }}>
              Prendas femeninas y delicadas, seleccionadas para acompañarte en primavera, verano, otoño e invierno.
            </p>
            <div className="animate-fade-up mt-10 flex flex-wrap gap-4" style={{ animationDelay: "0.45s" }}>
              <Button variant="gold" size="lg" className="h-12 px-10" asChild>
                <a href="#coleccion">Comprar ahora</a>
              </Button>
              <Button variant="elegant" size="lg" className="h-12 px-10" asChild>
                <a href="#temporadas">Ver temporadas</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cinta */}
      <div className="border-y border-gold/30 bg-primary py-4">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap font-display text-xl italic text-primary-foreground">
          {[...Array(2)].flatMap((_, k) =>
            ["Primavera", "✦", "Verano", "✦", "Otoño", "✦", "Invierno", "✦", "Boutique ML", "✦"].map((w, i) => (
              <span key={`${k}-${i}`} className={w === "✦" ? "text-gold" : ""}>{w}</span>
            )),
          )}
        </div>
      </div>

      {/* Temporadas */}
      <section id="temporadas" className="mx-auto max-w-7xl px-6 py-28">
        <div className="reveal text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">Colecciones</p>
          <h2 className="mt-4 text-5xl font-light md:text-6xl">Viste la temporada</h2>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => {
                setSeason(s.key);
                document.getElementById("coleccion")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="reveal group relative aspect-[3/4] overflow-hidden rounded-2xl text-left shadow-soft"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <img src={s.img} alt={s.name} loading="lazy" width={800} height={1008} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-background">
                <s.icon className="h-6 w-6 text-gold-light transition-transform duration-500 group-hover:rotate-45" />
                <h3 className="mt-3 text-4xl font-light">{s.name}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">{s.text}</p>
                <span className="mt-4 block h-px w-10 bg-gold-light transition-all duration-500 group-hover:w-24" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Colección */}
      <section id="coleccion" className="bg-gradient-blush py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="reveal text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Tienda</p>
            <h2 className="mt-4 text-5xl font-light md:text-6xl">Nuestra colección</h2>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {FILTERS.map((f) => (
              <Button key={f.key} variant={season === f.key ? "gold" : "elegant"} className="px-6" onClick={() => setSeason(f.key)}>
                {f.name}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
          ) : products.length === 0 ? (
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-gold/40 bg-card p-12 text-center shadow-soft">
              <Sparkles className="mx-auto h-8 w-8 text-gold" />
              <p className="mt-4 font-display text-2xl">No se encontraron productos</p>
              <p className="mt-2 text-sm text-muted-foreground">Muy pronto llegarán nuevas prendas de temporada.</p>
            </div>
          ) : (
            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
              {products.map((p, i) => <ProductCard key={p.node.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
