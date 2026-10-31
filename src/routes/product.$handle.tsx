import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchProductByHandle, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "Prenda — BOUTIQUE ML" },
      { name: "description", content: "Descubre los detalles de esta prenda de temporada en Boutique ML." },
      { property: "og:title", content: "Prenda — BOUTIQUE ML" },
      { property: "og:description", content: "Moda elegante para cada estación." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", handle], queryFn: () => fetchProductByHandle(handle) });
  const [variantIdx, setVariantIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  }
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6">
        <p className="font-display text-3xl">Prenda no encontrada</p>
        <Button variant="gold" asChild><Link to="/">Volver a la tienda</Link></Button>
      </div>
    );
  }

  const p = product.node;
  const variants = p.variants.edges.map((e) => e.node);
  const variant = variants[variantIdx];
  const images = p.images.edges.map((e) => e.node);

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({ product, variantId: variant.id, variantTitle: variant.title, price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions || [] });
    toast.success("Agregado a tu bolsa", { description: p.title, position: "top-center" });
  };

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <div className="mt-8 grid gap-12 md:grid-cols-2">
          <div className="animate-fade-up">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-blush shadow-soft">
              {images[imgIdx] && <img src={images[imgIdx].url} alt={images[imgIdx].altText ?? p.title} className="h-full w-full object-cover" />}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((im, i) => (
                  <button key={im.url} onClick={() => setImgIdx(i)} className={`h-20 w-16 overflow-hidden rounded-lg border-2 ${i === imgIdx ? "border-gold" : "border-transparent"}`}>
                    <img src={im.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="animate-fade-up md:pt-8" style={{ animationDelay: "0.15s" }}>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">Boutique ML</p>
            <h1 className="mt-4 text-5xl font-light">{p.title}</h1>
            <p className="mt-4 text-2xl text-gold">{variant && formatPrice(variant.price.amount, variant.price.currencyCode)}</p>
            <span className="my-8 block h-px w-16 bg-gold" />
            <p className="leading-relaxed text-muted-foreground">{p.description}</p>
            {variants.length > 1 && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.25em]">Opciones</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <Button key={v.id} variant={i === variantIdx ? "gold" : "elegant"} size="sm" className="px-5" disabled={!v.availableForSale} onClick={() => setVariantIdx(i)}>
                      {v.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Button variant="gold" size="lg" className="mt-10 h-14 w-full" onClick={handleAdd} disabled={cartLoading || !variant?.availableForSale}>
              {cartLoading ? <Loader2 className="animate-spin" /> : variant?.availableForSale ? "Agregar a la bolsa" : "Agotado"}
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
