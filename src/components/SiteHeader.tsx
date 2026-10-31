import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CartDrawer } from "./CartDrawer";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/85 py-3 backdrop-blur-md" : "py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.25em] md:flex">
          <a href="/#temporadas" className="transition-colors hover:text-gold">Temporadas</a>
          <a href="/#coleccion" className="transition-colors hover:text-gold">Colección</a>
        </nav>
        <Link to="/" className="font-display text-2xl tracking-[0.3em] md:text-3xl">
          BOUTIQUE <span className="text-gradient-gold font-semibold">ML</span>
        </Link>
        <CartDrawer />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-gradient-blush py-16 text-center">
      <p className="font-display text-3xl tracking-[0.3em]">
        BOUTIQUE <span className="text-gradient-gold font-semibold">ML</span>
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Moda para cada estación</p>
      <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} Boutique ML</p>
    </footer>
  );
}
