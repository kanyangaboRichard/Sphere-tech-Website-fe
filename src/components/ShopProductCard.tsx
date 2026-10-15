import { ShopProduct, discountPercent, formatPrice } from "../lib/Shop";

export default function ShopProductCard({ product }: { product: ShopProduct }) {
  const discount = discountPercent(product);
  const badge = product.badge || (discount ? `${discount}% OFF` : product.isNewArrival ? "New" : null);

  const inner = (
    <>
      <div className="shop-thumb">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="placeholder" />
        )}
        {badge && <span className="product-badge">{badge}</span>}
      </div>
      <h3 className="shop-card-title">{product.name}</h3>
      {product.unit && <p className="shop-unit">{product.unit}</p>}
      <div className="shop-price">
        <span className="price-now">{formatPrice(product.price)}</span>
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="price-was">{formatPrice(product.originalPrice)}</span>
        )}
      </div>
    </>
  );

  if (product.link) {
    return (
      <a href={product.link} target="_blank" rel="noopener noreferrer" className="shop-card">
        {inner}
      </a>
    );
  }

  return <div className="shop-card">{inner}</div>;
}