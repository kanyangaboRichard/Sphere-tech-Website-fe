import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopProductCard from "@/components/ShopProductCard";
import { getShopCategories, getShopProducts } from "../../lib/Shop";

export const metadata: Metadata = { title: "Shop with us" };

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const { category: activeSlug = "" } = await searchParams;

  const categories = await getShopCategories();
  const activeCategory = activeSlug ? categories.find(c => c.slug === activeSlug) : undefined;

  const products = await getShopProducts({ categoryId: activeCategory?.id });
  const newArrivals = products.filter(p => p.isNewArrival);
  const deals = products.filter(p => p.isDeal);
  const rest = products.filter(p => !p.isNewArrival && !p.isDeal);

  return (
    <>
      <Header />
      <main className="container">
        <section className="shop-hero">
          <h1>Shop with us</h1>
          <p>Hand-picked products from our partners, delivered to you.</p>
        </section>

        <div className="pills">
          <Link href="/shop" className={`pill ${!activeSlug ? "active" : ""}`}>
            All
          </Link>
          {categories.map(c => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className={`pill ${activeSlug === c.slug ? "active" : ""}`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty">
            <h2>No products yet</h2>
            <p>Check back soon — new items are added regularly.</p>
          </div>
        )}

        {newArrivals.length > 0 && (
          <section className="shop-section">
            <div className="section-head">
              <h2>New Arrivals</h2>
            </div>
            <div className="shop-grid">
              {newArrivals.map(p => <ShopProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {deals.length > 0 && (
          <section className="shop-section">
            <div className="section-head">
              <h2>Offers &amp; Deals</h2>
            </div>
            <div className="shop-grid">
              {deals.map(p => <ShopProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section className="shop-section">
            <div className="section-head">
              <h2>{activeCategory ? activeCategory.name : "All Products"}</h2>
            </div>
            <div className="shop-grid">
              {rest.map(p => <ShopProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}