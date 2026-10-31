import { Link } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export function ProductCard({ product, index }: { product: ShopifyProduct; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const img = p.images.edges[0]?.node;
  const img2 = p.images.edges[1]?.node;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Agregado a tu bolsa", { description: p.title, position: "top-center" });
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: p.handle }}
      className="reveal group block"
      style={{ transitionDelay: `${(index % 4) * 120}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-blush shadow-soft">
        {img && (
          <img src={img.url} alt={img.altText ?? p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        )}
        {img2 && (
          <img src={img2.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        )}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Button variant="gold" className="h-11 w-full" onClick={handleAdd} disabled={isLoading || !variant?.availableForSale}>
            {isLoading ? <Loader2 className="animate-spin" /> : <><Plus />Agregar a la bolsa</>}
          </Button>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-display text-xl transition-colors group-hover:text-gold">{p.title}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.description}</p>
        <p className="mt-2 text-sm font-medium tracking-wider text-gold">
          {formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}
        </p>
      </div>
    </Link>
  );
}
